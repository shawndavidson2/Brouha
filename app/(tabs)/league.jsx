
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import styles from '../styles';
import LeagueParticipants from '../../components/league/LeagueParticipants';
import LeagueStats from '../../components/league/LeagueStats';
import LeagueTitleAndProfile from '../../components/league/LeagueTitleAndProfile';
import JoinLeagueButton from '../../components/league/JoinLeagueButton';
import { useGlobalContext } from '../../context/GlobalProvider';
import { useRefresh } from '../../context/RefreshContext';
import Loading from '../../components/Loading';
import { StatusBar } from 'expo-status-bar';

const League = () => {
    const { user, setUser, league, setLeague, weekNum, isInitialized: isGlobalInitialized } = useGlobalContext();
    const [loading, setLoading] = useState(false);
    const { triggerRefresh } = useRefresh();
    const [refreshKey, setRefreshKey] = useState(0); // Add a refresh key state

    const joinLeague = () => {
        router.push("../join-league");
    };

    const onRefresh = async () => {
        setRefreshKey(prevKey => prevKey + 1); // Change the refresh key to restart the component
        triggerRefresh(); // Call the triggerRefresh function to refresh RootLayout
    };

    {
        loading && <Loading key={refreshKey} />
    }

    if (league) {
        return (
            <SafeAreaView key={refreshKey} style={styless.safeArea}>
                <View style={styless.leagueBackground}>
                    <FlatList
                        ListHeaderComponent={() => (
                            <>
                                <LeagueTitleAndProfile
                                    currentUser={user}
                                    leagueTitle={capitalizeFirstLetterOfEachWord(league.name)}
                                    weekNum={weekNum}
                                />
                                <LeagueStats rank={league.rank} weekPoints={league["weekly-total-points"]} totalPoints={league["cumulative-total-points"]} weekNum={weekNum} />
                                <LeagueParticipants />
                            </>
                        )}
                        refreshControl={
                            <RefreshControl refreshing={loading} onRefresh={onRefresh} />
                        }
                    />
                </View>
                <StatusBar style="dark" />
            </SafeAreaView>
        );
    } else {
        return (
            <SafeAreaView key={refreshKey} style={styless.safeArea}>
                <View style={styless.leagueBackground}>
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
                </View>
                <StatusBar style="dark" />
            </SafeAreaView>
        );
    }

    function capitalizeFirstLetterOfEachWord(string) {
        return string.replace(/\b\w/g, (char) => char.toUpperCase());
    }
}

export default League;

const styless = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'white',
    },
    leagueBackground: {
        flex: 1,
    },
});
