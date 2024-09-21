import { View, Text, Alert, TextInput, FlatList, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { createAndJoinLeague, searchLeagues, joinLeague, isLeagueNameUnique, getAllLeaguesForLeaderboard } from '../lib/appwrite';
import { router } from 'expo-router';
import { useGlobalContext } from '../context/GlobalProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRefresh } from '../context/RefreshContext';
import Loading from '../components/Loading';

const JoinLeague = () => {
    const { user, setUser, setLeague, setIsLoggedIn } = useGlobalContext();
    const { triggerRefresh } = useRefresh();
    const [leagueName, setLeagueName] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [allLeagues, setAllLeagues] = useState([]); // Store all leagues
    const [selectedLeague, setSelectedLeague] = useState(null);
    const [viewMode, setViewMode] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchLeagues = async () => {
            setLoading(true);
            try {
                const leagues = await getAllLeaguesForLeaderboard();
                setAllLeagues(leagues);
                setSearchResults(leagues); // Initially display all leagues
            } catch (error) {
                Alert.alert('Error', error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchLeagues();
    }, []);

    const goBack = () => {
        if (viewMode === null) {
            router.back();
        }
        setViewMode(null);
    };

    const handleCreateAndJoinLeague = async () => {
        if (leagueName.trim() === '') {
            Alert.alert('Error', 'Please enter a league name.');
            return;
        }
        try {
            const isUnique = await isLeagueNameUnique(leagueName.trim());
            if (!isUnique) {
                Alert.alert('Error', 'League name already exists. Please choose a different name.');
                return;
            }
            setLoading(true);
            const { newLeague, updatedUser } = await createAndJoinLeague(leagueName.trim());
            Alert.alert('Success', `League '${newLeague.name}' created and joined!`);
            setUser(updatedUser);
            setIsLoggedIn(true);
            setLeague(newLeague);
            triggerRefresh();
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchLeagues = async () => {
        if (leagueName.trim() === '') {
            setSearchResults(allLeagues); // Show all leagues if search is empty
            return;
        }
        try {
            const leagues = await searchLeagues(leagueName.trim());
            setSearchResults(leagues);
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const handleJoinLeague = async (leagueId) => {
        try {
            setLoading(true);
            const { updatedUser, updatedLeague } = await joinLeague(leagueId);
            Alert.alert('Success', `Joined league '${updatedLeague.name}' successfully!`);
            setUser(updatedUser);
            setIsLoggedIn(true);
            setLeague(updatedLeague);
            setLoading(false);
            router.replace('./league');
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const getHeaderText = () => {
        if (viewMode === 'create') return 'Create a New League';
        if (viewMode === 'join') return 'Join an Existing League';
        return 'Join or Create a League';
    };

    if (loading) { return <Loading /> }

    return (
        <GestureHandlerRootView>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>

                    {viewMode !== null && (
                        <TouchableOpacity onPress={goBack}>
                            <Text style={styles.backButtonText}>{"< "}Back</Text>
                        </TouchableOpacity>
                    )}

                    <Text style={[styles.header, { marginTop: 40 }]}>{getHeaderText()}</Text>
                    <Text style={styles.description}>Choose to either join an existing league or create a new one</Text>

                    {viewMode === null ? (
                        <>
                            <TouchableOpacity style={[styles.button, { paddingVertical: 15 }]} onPress={() => { setViewMode('join'); }}>
                                <Text style={styles.buttonText}>Join an Existing League</Text>
                            </TouchableOpacity>

                            <Text style={{ fontSize: 24, textAlign: 'center', marginVertical: 10, fontFamily: 'RobotoSlab-Bold' }}>OR</Text>

                            <TouchableOpacity style={[styles.button, { paddingVertical: 15 }]} onPress={() => setViewMode('create')}>
                                <Text style={styles.buttonText}>Create a New League</Text>
                            </TouchableOpacity>
                        </>
                    ) : viewMode === 'create' ? (
                        <>
                            <TextInput
                                style={[styles.input, { alignSelf: 'center', width: '80%' }]}
                                placeholder="Enter league name"
                                value={leagueName}
                                onChangeText={setLeagueName}
                                placeholderTextColor="#555"
                            />
                            <TouchableOpacity style={styles.button} onPress={handleCreateAndJoinLeague} disabled={loading}>
                                <Text style={styles.buttonText}>Create and Join League</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <TextInput
                                style={[styles.input, { alignSelf: 'center', width: '80%' }]}
                                placeholder="Search leagues"
                                value={leagueName}
                                onChangeText={setLeagueName}
                                placeholderTextColor="#555"
                            />
                            <TouchableOpacity style={styles.button} onPress={handleSearchLeagues}>
                                <Text style={styles.buttonText}>Search Leagues</Text>
                            </TouchableOpacity>
                            {searchResults.length > 0 && (
                                <FlatList
                                    data={searchResults}
                                    keyExtractor={(item) => item.$id}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            onPress={() => setSelectedLeague(item.$id)}
                                            style={[
                                                styles.leagueItem,
                                                selectedLeague === item.$id ? styles.selectedLeague : styles.unselectedLeague
                                            ]}
                                        >
                                            <Text style={styles.leagueName}>{item.name}</Text>
                                            <Text style={styles.leaguePoints}>{item['numUsers']} users</Text>
                                        </TouchableOpacity>
                                    )}
                                />
                            )}
                            <TouchableOpacity style={styles.button} onPress={() => handleJoinLeague(selectedLeague)} disabled={!selectedLeague || loading}>
                                <Text style={styles.buttonText}>Join Selected League</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
};

export default JoinLeague;
