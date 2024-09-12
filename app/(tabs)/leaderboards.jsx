import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import styles from '../styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '../../context/GlobalProvider';
import { StatusBar } from 'expo-status-bar';
import Loading from '../../components/Loading';
import { router } from 'expo-router';

const Leaderboards = () => {
    const [selectedTab, setSelectedTab] = useState('users');
    const [userLeaders, setUserLeaders] = useState([]);
    const [leagueLeaders, setLeagueLeaders] = useState([]);

    const { user, league, users, leagues, leaderboardLoading } = useGlobalContext();

    const formatNumberWithComma = (num) => {
        return num ? num.toLocaleString() : 0;
    };

    useEffect(() => {
        // Load all users
        const fetchUsers = async () => {
            const sortedUsers = users.sort((a, b) => b.totalPoints - a.totalPoints);
            setUserLeaders(assignRanks(sortedUsers, 'totalPoints'));
        };

        // Load all leagues
        const fetchLeagues = async () => {
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

    // Function to handle pressing a league item
    const handleLeaguePress = (clickedLeague) => {
        if (clickedLeague.name === league.name) {
            router.push('/league')
        } else {
            router.push({
                pathname: '/LeagueScreen',
                params: { passedLeague: JSON.stringify(clickedLeague) },  // Convert to a string
            });
        }

    };

    // Function to handle pressing a league item
    const handleUserPress = (clickedUser) => {
        if (clickedUser.username === user.username) {
            router.push('/profile')
        } else {
            //leagueUser, passedLeague
            router.push({
                pathname: '/profile',
                params: { passedLeague: JSON.stringify(clickedUser.league), leagueUser: JSON.stringify(clickedUser) },  // Convert to a string
            });
        }

    };

    const renderLeaderboardItem = (item) => {
        let isCurrentUser = item.username === user?.username;
        let isCurrentLeague = item.name === league?.name;

        // If it's a league, make it clickable
        if (selectedTab === 'leagues') {
            return (
                <TouchableOpacity key={item.$id} onPress={() => handleLeaguePress(item)}>
                    <View style={[styles.leaderboardItem, isCurrentLeague && styles.current]}>
                        <Text style={styles.rank}>{item.rank}</Text>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.points}>{formatNumberWithComma(item['cumulative-total-points'])}</Text>
                    </View>
                </TouchableOpacity>
            );
        }

        // Otherwise, just render the user leaderboard item
        return (
            <TouchableOpacity key={item.$id} onPress={() => handleUserPress(item)}>
                <View key={item.$id} style={[styles.leaderboardItem, isCurrentUser && styles.current]}>
                    <Text style={styles.rank}>{item.rank}</Text>
                    <Text style={styles.name}>{item.username}</Text>
                    <Text style={styles.points}>{formatNumberWithComma(item.totalPoints)}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    if (leaderboardLoading) {
        return <Loading leaderboard={true} />
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.leaderboard}>
                    <Text style={styles.leaderboardTitle}>{selectedTab === 'users' ? 'User Leaderboards' : 'League Leaderboards'}</Text>
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
