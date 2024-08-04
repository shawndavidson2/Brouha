import { View, Text, Alert, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { createAndJoinLeague, searchLeagues, joinLeague } from '../lib/appwrite';
import { router } from 'expo-router';
import { useGlobalContext } from '../context/GlobalProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';

const JoinLeague = () => {
    const { setUser, league, setLeague, setIsLoggedIn, getCurrentUser } = useGlobalContext();
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
            const { newLeague, updatedUser } = await createAndJoinLeague(leagueName);
            Alert.alert('Success', `League '${newLeague.name}' created and joined!`);
            // Navigate to the league details or home screen if needed
            //fetchUserLeague();
            setUser(updatedUser);
            setIsLoggedIn(true);
            setLeague(newLeague);
            router.replace('./league')
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
            const { updatedUser, updatedLeague } = await joinLeague(leagueId);
            Alert.alert('Success', `Joined league '${updatedLeague.name}' successfully!`);
            // Navigate to the league details or home screen if needed
            //fetchUserLeague();
            setUser(updatedUser);
            setIsLoggedIn(true);
            setLeague(updatedLeague);
            router.replace('./league')
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <GestureHandlerRootView>
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container} >
                <ScrollView contentContainerStyle={{ height: '100%' }} >
                    <View className="w-full flex justify-center items-center mt-6 px-4">
                        <TouchableOpacity className="flex w-full items-start mb-0 mt-0" >
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
                        <Button title="Search Leagues" onPress={handleSearchLeagues} />
                        {searchResults.length > 0 && (
                            <FlatList
                                data={searchResults}
                                keyExtractor={(item) => item.$id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => setSelectedLeague(item.$id)}>
                                        <Text style={{ padding: 10, backgroundColor: selectedLeague === item.$id ? 'lightgray' : 'white' }}>
                                            {item.name}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                        )}
                        <Button title="Join Selected League" onPress={() => handleJoinLeague(selectedLeague)} disabled={!selectedLeague} />
                        <Button title="Create and Join League" onPress={handleCreateAndJoinLeague} />
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
        </GestureHandlerRootView>
    );
};

export default JoinLeague;
