import { View, Text, Alert, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { createAndJoinLeague, searchLeagues, joinLeague } from '../lib/appwrite';
import { router } from 'expo-router';
import { useGlobalContext } from '../context/GlobalProvider';

const JoinLeague = () => {
    const { setUser, league, setLeague, setIsLoggedIn, getCurrentUser } = useGlobalContext();
    const [leagueName, setLeagueName] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedLeague, setSelectedLeague] = useState(null);

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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
            <Text style={{ fontSize: 24, marginBottom: 16 }}>Join or Create a League</Text>
            <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 16, paddingHorizontal: 8, width: '100%' }}
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
    );
};

export default JoinLeague;
