import { View, Text } from 'react-native';
import React from 'react';

const LeagueStats = () => {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 25 }}>
            <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>League Rank</Text>
                <Text style={{ fontSize: 26, marginTop: 5 }}>5</Text>
            </View>
            <View style={{ borderLeftWidth: 1, borderLeftColor: 'black', height: '100%', marginHorizontal: 10 }} />
            <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Week 4 Points</Text>
                <Text style={{ fontSize: 26, marginTop: 5 }}>12,460</Text>
            </View>
            <View style={{ borderLeftWidth: 1, borderLeftColor: 'black', height: '100%', marginHorizontal: 10 }} />
            <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Total Points</Text>
                <Text style={{ fontSize: 26, marginTop: 5 }}>48,250</Text>
            </View>
        </View>
    );
};

export default LeagueStats;
