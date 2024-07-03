import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { getAllUsers, getAllLeagues } from '../../lib/appwrite';
import { SafeAreaView } from 'react-native-safe-area-context';

const Leaderboards = () => {
    const [selectedTab, setSelectedTab] = useState('users');
    const [userLeaders, setUserLeaders] = useState([]);
    const [leagueLeaders, setLeagueLeaders] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (selectedTab === 'users') {
                const users = await getAllUsers();
                setUserLeaders(users);
            } else {
                const leagues = await getAllLeagues();
                setLeagueLeaders(leagues);
            }
        };

        fetchData();
    }, [selectedTab]);

    const renderLeaderboardItem = (item) => (
        <View key={item.$id} style={styles.leaderboardItem}>
            <Text style={styles.rank}>{item.totalRank || item.rank}</Text>
            <Text style={styles.name}>{item.username || item.name}</Text>
            <Text style={styles.points}>{item['cumulative-total-points'] != null ? item['cumulative-total-points'] : item["totalPoints"]}</Text>
        </View>
    );

    return (
        <SafeAreaView className="bg-red-100 h-full">
            <View style={styles.container}>
                <View style={styles.leaderboard}>
                    <Text style={styles.title}>{selectedTab === 'users' ? 'User Leaderboards' : 'Leagues Leaderboard'}</Text>
                    <ScrollView>
                        {selectedTab === 'users' ? userLeaders.map(renderLeaderboardItem) : leagueLeaders.map(renderLeaderboardItem)}
                    </ScrollView>
                </View>
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, selectedTab === 'users' && styles.activeTab]}
                        onPress={() => setSelectedTab('users')}
                    >
                        <Text style={styles.tabText}>Users</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, selectedTab === 'leagues' && styles.activeTab]}
                        onPress={() => setSelectedTab('leagues')}
                    >
                        <Text style={styles.tabText}>Leagues</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    leaderboard: {
        flex: 1,
        marginBottom: 24,
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    leaderboardItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    rank: {
        width: 40,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    name: {
        flex: 1,
        textAlign: 'left',
    },
    points: {
        width: 80,
        textAlign: 'right',
        fontWeight: 'bold',
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#000',
    },
    tabText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Leaderboards;
