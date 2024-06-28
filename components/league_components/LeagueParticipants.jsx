import { View, Text } from 'react-native';
import React from 'react';

const LeagueParticipants = ({ sortedContributors, sortedParticipants }) => {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%', marginTop: 30 }}>
            <View>
                <Text>League Contributors</Text>
                {sortedContributors.map((contributor, index) => (
                    <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                        <Text style={{ fontSize: 16 }}>{index + 1}. {contributor.username}</Text>
                    </View>
                ))}
                <Text className="mt-10">League Participants</Text>
                {sortedParticipants.map((participant, index) => (
                    <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                        <Text style={{ fontSize: 16 }}>{index + 1}. {participant.username}</Text>
                    </View>
                ))}
            </View>
            <View>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Points</Text>
                {sortedContributors.map((contributor, index) => (
                    <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                        <Text style={{ fontSize: 16 }}>{contributor.points}</Text>
                    </View>
                ))}
                <View className="mt-14">
                    {sortedParticipants.map((participant, index) => (
                        <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                            <Text style={{ fontSize: 16 }}>{participant.points}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
};

export default LeagueParticipants;
