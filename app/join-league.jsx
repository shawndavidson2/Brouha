import { View, Text } from 'react-native'
import React from 'react'
import { createAndJoinLeague } from '../lib/appwrite';
import { useState } from 'react';
import { TextInput } from 'react-native';
import { Button } from 'react-native';

const JoinLeague = () => {
    const [leagueName, setLeagueName] = useState('');

    const handleCreateAndJoinLeague = async () => {
        if (leagueName.trim() === '') {
            Alert.alert('Error', 'Please enter a league name.');
            return;
        }

        try {
            const { newLeague, updatedUser } = await createAndJoinLeague(leagueName);
            Alert.alert('Success', `League '${newLeague.name}' created and joined!`);
            // Navigate to the league details or home screen if needed
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
            <Button title="Create and Join League" onPress={handleCreateAndJoinLeague} />
        </View>
    );
};

export default JoinLeague;