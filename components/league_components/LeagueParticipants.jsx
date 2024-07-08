import { View, Text } from 'react-native';
import React from 'react';

const LeagueParticipants = ({ leagueMembers }) => {
    // Sort league members by weekPoints in descending order
    const sortedMembers = leagueMembers.sort((a, b) => b.weekPoints - a.weekPoints);

    // Split the sorted members into contributors and participants
    const contributors = sortedMembers.slice(0, 5);
    const participants = sortedMembers.slice(5);

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%', marginTop: 30 }}>
            <View>
                <Text>League Contributors</Text>
                {contributors.map((contributor, index) => (
                    <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                        <Text style={{ fontSize: 16 }}>{index + 1}. {contributor.username}</Text>
                    </View>
                ))}
                {participants.length > 0 && <Text className="mt-10">League Participants</Text>}
                {participants.map((participant, index) => (
                    <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                        <Text style={{ fontSize: 16 }}>{index + 1 + contributors.length}. {participant.username}</Text>
                    </View>
                ))}
            </View>
            <View>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Points</Text>
                {contributors.map((contributor, index) => (
                    <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                        <Text style={{ fontSize: 16 }}>{contributor.weekPoints}</Text>
                    </View>
                ))}
                <View className="mt-14">
                    {participants.map((participant, index) => (
                        <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                            <Text style={{ fontSize: 16 }}>{participant.weekPoints}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
};

export default LeagueParticipants;
