import { View, Text, Alert, TextInput, FlatList, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { createAndJoinLeague, searchLeagues, joinLeague, isLeagueNameUnique } from '../lib/appwrite';
import { router } from 'expo-router';
import { useGlobalContext } from '../context/GlobalProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const JoinLeague = () => {
    const { user, setUser, league, setLeague, setIsLoggedIn } = useGlobalContext();
    const [leagueName, setLeagueName] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedLeague, setSelectedLeague] = useState(null);

    const goBack = () => {
        router.back();
    };

    const handleCreateAndJoinLeague = async () => {
        if (leagueName.trim() === '') {
            Alert.alert('Error', 'Please enter a league name.');
            return;
        }
        try {
            if (user.league) {
                Alert.alert("Error", "You are already in a league!")
            } else {
                // Check if the league name is unique
                const isUnique = await isLeagueNameUnique(leagueName);
                if (!isUnique) {
                    Alert.alert('Error', 'League name already exists. Please choose a different name.');
                    return;
                }

                const { newLeague, updatedUser } = await createAndJoinLeague(leagueName);
                Alert.alert('Success', `League '${newLeague.name}' created and joined!`);
                setUser(updatedUser);
                setIsLoggedIn(true);
                setLeague(newLeague);
                router.replace('./league')
            }
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const handleSearchLeagues = async () => {
        try {
            const leagues = await searchLeagues(leagueName);
            setSearchResults(leagues);
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const handleJoinLeague = async (leagueId) => {
        try {
            if (user.league) {
                Alert.alert("Error", "You are already in a league!")
            } else {
                const { updatedUser, updatedLeague } = await joinLeague(leagueId);
                Alert.alert('Success', `Joined league '${updatedLeague.name}' successfully!`);
                setUser(updatedUser);
                setIsLoggedIn(true);
                setLeague(updatedLeague);
                router.replace('./league')
            }
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <GestureHandlerRootView>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <View style={{ height: '100%' }}>
                        <View className="w-full flex justify-center items-center mt-6 px-4">
                            <TouchableOpacity className="flex w-full items-start mb-0 mt-0">
                                <Text onPress={goBack} style={{ fontSize: 18 }}>Back</Text>
                            </TouchableOpacity>
                            <View className="pt-0 mt-20">
                                <Text style={styles.header}>Join or Create a League</Text>
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter league name"
                                value={leagueName}
                                onChangeText={setLeagueName}
                            />
                            <TouchableOpacity style={styles.button} onPress={handleSearchLeagues}>
                                <Text style={styles.buttonText}>Search Leagues</Text>
                            </TouchableOpacity>
                            {searchResults.length > 0 && (
                                <FlatList
                                    data={searchResults}
                                    keyExtractor={(item) => item.$id}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity onPress={() => setSelectedLeague(item.$id)}>
                                            <Text style={{ padding: 10, backgroundColor: selectedLeague === item.$id ? '#DBB978' : 'white' }}>
                                                {item.name}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                />
                            )}
                            <TouchableOpacity style={styles.button} onPress={() => handleJoinLeague(selectedLeague)} disabled={!selectedLeague}>
                                <Text style={styles.buttonText}>Join Selected League</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={handleCreateAndJoinLeague}>
                                <Text style={styles.buttonText}>Create and Join League</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
};

export default JoinLeague;
