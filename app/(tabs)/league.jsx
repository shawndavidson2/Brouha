import { View, Text, TouchableOpacity, Image,  StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { icons } from '../../constants';
import LeagueParticipants from '../../components/league/LeagueParticipants';
import LeagueStats from '../../components/league/LeagueStats';
import LeagueTitleAndProfile from '../../components/league/LeagueTitleAndProfile';
import JoinLeagueButton from '../../components/league/JoinLeagueButton';
import { useGlobalContext } from '../../context/GlobalProvider';
import { UpdateUserStats } from '../../components/UpdateUserStats';
import { useLineupCache } from '../../context/lineupContext';
import { useRefresh } from '../../context/RefreshContext';

const League = () => {
    const { user, setUser, league, setLeague, weekNum, isInitialized: isGlobalInitialized } = useGlobalContext();
    const [loading, setLoading] = useState(false);
    const { triggerRefresh } = useRefresh();
    const lineupCache = useLineupCache();
    const [refreshKey, setRefreshKey] = useState(0); // Add a refresh key state

    // When the user first logs in, we want to update their stats...
    useEffect(() => {

        const updateStats = async () => {
            if (isGlobalInitialized && league) {
                setLoading(true);  // Set loading to true before updating stats
                await UpdateUserStats(user, setUser, league, setLeague, weekNum, lineupCache);
                setLoading(false); // Set loading to false after updating stats
            }
        };
        updateStats();
    }, [isGlobalInitialized]);

    const joinLeague = () => {
        router.push("../join-league");
    };

    const onRefresh = async () => {
        setRefreshKey(prevKey => prevKey + 1); // Change the refresh key to restart the component
        triggerRefresh(); // Call the triggerRefresh function to refresh RootLayout
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
            <SafeAreaView key={refreshKey} style={styles.safeArea}>
                <View style={styles.container}>
                    <FlatList
                        ListHeaderComponent={() => (
                            <>
                                <LeagueTitleAndProfile currentUser={user} leagueTitle={league.name} weekNum={weekNum} />
                                <LeagueStats rank={league.rank} weekPoints={league["weekly-total-points"]} totalPoints={league["cumulative-total-points"]} weekNum={weekNum} />
                                <LeagueParticipants />
                            </>
                        )}
                        refreshControl={
                            <RefreshControl refreshing={loading} onRefresh={onRefresh} />
                        }
                    />
                    <JoinLeagueButton joinLeague={joinLeague} />
                </View> 
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
                        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
                    }
                />
                <JoinLeagueButton joinLeague={joinLeague} />
            </SafeAreaView>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        margin: 20,
        backgroundColor: '#fefcf9',
        borderRadius: 10,
        borderTopColor: '#8b2326',
        borderTopWidth: 20,
        justifyContent: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    weekNavigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    subHeader: {
        fontSize: 18,
        textAlign: 'center',
    },
    scrollView: {
        flex: 1,
    },
    pickItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    pickDetails: {
        flex: 1,
    },
    pickText: {
        fontSize: 16,
    },
    gameText: {
        fontSize: 14,
        color: '#555',
    },
    pointsText: {
        fontSize: 16,
    },
    statusIcon: {
        marginLeft: 10,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    totalText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    totalPointsText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    earnedPointsText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'green',
    },
    deleteButton: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        width: 75,
        height: '100%',
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#343434',
    },
});

export default League;
