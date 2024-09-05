import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import styles from '../styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '../../context/GlobalProvider';
import { StatusBar } from 'expo-status-bar';
import Loading from '../../components/Loading';

const Leaderboards = () => {
    const [selectedTab, setSelectedTab] = useState('users');
    const [userLeaders, setUserLeaders] = useState([]);
    const [leagueLeaders, setLeagueLeaders] = useState([]);

    const { user, league, users, leagues, leaderboardLoading } = useGlobalContext();

    useEffect(() => {
        // Load all users
        const fetchUsers = async () => {
            const sortedUsers = users.sort((a, b) => b.totalPoints - a.totalPoints);
            setUserLeaders(assignRanks(sortedUsers, 'totalPoints'));
        };

        // Load all leagues
        const fetchLeagues = async () => {
            //const sortedLeagues = leagues.sort((a, b) => b['cumulative-total-points'] - a['cumulative-total-points']);
            setLeagueLeaders(leagues);
        };

        if (!leaderboardLoading) {
            fetchUsers();
            fetchLeagues();
        }
    }, [leaderboardLoading]);

    // Function to assign ranks based on point values
    const assignRanks = (items, pointsField) => {
        let rank = 1;
        return items.map((item, index) => {
            // If it's not the first item and has the same points as the previous, assign the same rank
            if (index > 0 && item[pointsField] === items[index - 1][pointsField]) {
                item.rank = items[index - 1].rank;
            } else {
                item.rank = rank;
            }
            rank = rank + 1;
            return item;
        });
    };

    const renderLeaderboardItem = (item) => {
        let isCurrentUser = item.username === user?.username;
        let isCurrentLeague = item.name === league?.name;

        return (
            <View key={item.$id} style={[styles.leaderboardItem, (isCurrentUser || isCurrentLeague) && styles.current]}>
                <Text style={styles.rank}>{item.rank}</Text>
                <Text style={styles.name}>{item.username || item.name}</Text>
                <Text style={styles.points}>{item['cumulative-total-points'] != null ? item['cumulative-total-points'] : item.totalPoints}</Text>
            </View>
        );
    };

    if (leaderboardLoading) {
        return <Loading />
    }

    return (
        <SafeAreaView style={styles.safeArea}>
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
            <StatusBar style="light" />
        </SafeAreaView>
    );
};

export default Leaderboards;
