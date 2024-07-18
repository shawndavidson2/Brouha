import { View, Text } from 'react-native';
import React from 'react';

const LeagueStats = ({ rank, weekPoints, totalPoints, weekNum }) => {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 25 }}>
            <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>League Rank</Text>
                <Text style={{ fontSize: 26, marginTop: 5 }}>{rank}</Text>
            </View>
            <View style={{ borderLeftWidth: 1, borderLeftColor: 'black', height: '100%', marginHorizontal: 10 }} />
            <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Week {weekNum} Points</Text>
                <Text style={{ fontSize: 26, marginTop: 5 }}>{weekPoints}</Text>
            </View>
            <View style={{ borderLeftWidth: 1, borderLeftColor: 'black', height: '100%', marginHorizontal: 10 }} />
            <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Total Points</Text>
                <Text style={{ fontSize: 26, marginTop: 5 }}>{totalPoints}</Text>
            </View>
        </View>
    );
};

export default LeagueStats;
