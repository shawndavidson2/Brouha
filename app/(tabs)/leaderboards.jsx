import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import styles from '../styles';
import { getAllUsers, getAllLeagues, updateLeagueAttributes } from '../../lib/appwrite';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '../../context/GlobalProvider';

const Leaderboards = () => {
    const [selectedTab, setSelectedTab] = useState('users');
    const [userLeaders, setUserLeaders] = useState([]);
    const [leagueLeaders, setLeagueLeaders] = useState([]);

    const { user, league } = useGlobalContext();

    useEffect(() => {
        const fetchData = async () => {
            if (selectedTab === 'users') {
                const users = await getAllUsers();
                const sortedUsers = users.sort((a, b) => b.weekPoints - a.weekPoints);
                setUserLeaders(sortedUsers);
            } else {
                const leagues = await getAllLeagues();
                const sortedLeagues = leagues.sort((a, b) => b['weekly-total-points'] - a['weekly-total-points']);
                sortedLeagues.forEach((league, index) => {
                    updateLeagueAttributes(league, { rank: index + 1 });
                });
                setLeagueLeaders(sortedLeagues);
            }
        };

        fetchData();
    }, [selectedTab]);

    const renderLeaderboardItem = (item, index) => {
        let isCurrentUser, isCurrentLeague;
        if (user) isCurrentUser = item.username === user.username;
        if (league) isCurrentLeague = item.name === league.name

        return (
            <View key={item.$id} style={[styles.leaderboardItem, (isCurrentUser || isCurrentLeague) && styles.current]}>
                <Text style={styles.rank}>{index + 1}</Text>
                <Text style={styles.name}>{item.username || item.name}</Text>
                <Text style={styles.points}>{item['weekly-total-points'] != null ? item['weekly-total-points'] : item["weekPoints"]}</Text>
            </View>
        );
    };

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
        </SafeAreaView>
    );
};



export default Leaderboards;
