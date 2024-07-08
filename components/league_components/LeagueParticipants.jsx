import { View, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import { getTotalPointsEarned } from '../../lib/appwrite';

const LeagueParticipants = ({ leagueMembers, weekNum }) => {
    // State to hold the points for each member
    const [points, setPoints] = useState({});

    // Fetch points for all members
    useEffect(() => {
        const fetchPoints = async () => {
            const pointsMap = {};
            for (const member of leagueMembers) {
                const earnedPoints = await getTotalPointsEarned(member.$id, weekNum);
                pointsMap[member.$id] = earnedPoints;
            }
            setPoints(pointsMap);
        };

        fetchPoints();
    }, [leagueMembers, weekNum]);

    // Sort league members by weekPoints in descending order
    const sortedMembers = [...leagueMembers].sort((a, b) => b.weekPoints - a.weekPoints);

    // Split the sorted members into contributors and participants
    const contributors = sortedMembers.slice(0, 5);
    const participants = sortedMembers.slice(5);

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%', marginTop: 30 }}>
            <View>
                <Text>League Contributors</Text>
                {contributors.map((contributor, index) => (
                    <View key={contributor.$id} style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                        <Text style={{ fontSize: 16 }}>{index + 1}. {contributor.username}</Text>
                    </View>
                ))}
                {participants.length > 0 && <Text style={{ marginTop: 10 }}>League Participants</Text>}
                {participants.map((participant, index) => (
                    <View key={participant.$id} style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                        <Text style={{ fontSize: 16 }}>{index + 1 + contributors.length}. {participant.username}</Text>
                    </View>
                ))}
            </View>
            <View>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Points</Text>
                {contributors.map((contributor, index) => (
                    <View key={contributor.$id} style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                        <Text style={{ fontSize: 16 }}>{points[contributor.$id] ?? 'Loading...'}</Text>
                    </View>
                ))}
                <View style={{ marginTop: 14 }}>
                    {participants.map((participant, index) => (
                        <View key={participant.$id} style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                            <Text style={{ fontSize: 16 }}>{points[participant.$id] ?? 'Loading...'}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
};

export default LeagueParticipants;
