import { View, Text, TouchableOpacity, Image, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { icons } from '../../constants';
import LeagueParticipants from '../../components/league_components/LeagueParticipants';
import LeagueStats from '../../components/league_components/LeagueStats';
import LeagueTitleAndProfile from '../../components/league_components/LeagueTitleAndProfile';
import JoinLeagueButton from '../../components/league_components/JoinLeagueButton';
import { getCurrentUser, appwriteConfig, databases } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';
import { UpdateUserStats } from '../../components/UpdateUserStats';
import { useLineupCache } from '../../context/lineupContext';

const League = () => {
    const { user, setUser, league, setLeague, weekNum, isInitailzed } = useGlobalContext();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0); // Add a refresh key state

    // Use the custom hook to get lineupCache
    const lineupCache = useLineupCache();

    // When the user first logs in, we want to update their stats...
    useEffect(() => {
        const updateStats = async () => {
            setLoading(true);  // Set loading to true before updating stats
            if (!isInitailzed) {
                await UpdateUserStats(user, setUser, league, setLeague, weekNum, lineupCache);
                setLoading(false); // Set loading to false after updating stats
            }
        };
        updateStats();
    }, []);

    const joinLeague = () => {
        router.push("../join-league");
    };

    const onRefresh = async () => {
        setRefreshing(true);
        // await refetch();
        //SSawait UpdateUserStats(user, setUser, league, setLeague, weekNum, lineupCache);
        setRefreshing(false);
        setRefreshKey(prevKey => prevKey + 1); // Change the refresh key to restart the component
    };

    if (loading) {
        return (
            <SafeAreaView key={refreshKey} className="bg-red-100 h-full flex justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        );
    }

    if (league) {
        return (
            <SafeAreaView key={refreshKey} className="bg-red-100 h-full">
                <FlatList
                    ListHeaderComponent={() => (
                        <>
                            <LeagueTitleAndProfile currentUser={user} leagueTitle={league.name} weekNum={weekNum} />
                            <LeagueStats rank={league.rank} weekPoints={league["weekly-total-points"]} totalPoints={league["cumulative-total-points"]} weekNum={weekNum} />
                            <LeagueParticipants />
                        </>
                    )}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
                <JoinLeagueButton joinLeague={joinLeague} />
            </SafeAreaView>
        );
    } else {
        return (
            <SafeAreaView key={refreshKey} className="bg-red-100 h-full">
                <FlatList
                    ListHeaderComponent={() => (
                        <>
                            <LeagueTitleAndProfile currentUser={user} leagueTitle={"NO LEAGUE YET"} weekNum={weekNum} />
                        </>
                    )}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
                <JoinLeagueButton joinLeague={joinLeague} />
            </SafeAreaView>
        );
    }
};

export default League;
