import { View, Text, TouchableOpacity, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import LeagueParticipants from '../components/league/LeagueParticipants';
import LeagueStats from '../components/league/LeagueStats';
import LeagueTitleAndProfile from '../components/league/LeagueTitleAndProfile';
import JoinLeagueButton from '../components/league/JoinLeagueButton';
import { useGlobalContext } from '../context/GlobalProvider';
import { useRefresh } from '../context/RefreshContext';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams } from 'expo-router';
import { leaveLeague } from '../lib/appwrite';
import Loading from '../components/Loading';

const LeagueScreen = () => {
    const router = useRouter();

    const { user, setUser, league: globalLeague, setLeague, weekNum } = useGlobalContext();
    const { passedLeague } = useLocalSearchParams();
    const parsedLeague = passedLeague ? JSON.parse(passedLeague) : null;
    const [league, setLeagueState] = useState(parsedLeague || globalLeague);
    const [loading, setLoading] = useState(false);
    const { triggerRefresh } = useRefresh();
    const [refreshKey, setRefreshKey] = useState(0);
    const [showLeaveButton, setShowLeaveButton] = useState(false); // Button visibility
    const [hasScrolledDown, setHasScrolledDown] = useState(false); // Ensures button remains visible after threshold is reached

    useEffect(() => {
        if (!league) router.replace('../join-league');
    }, [league]);

    const joinLeague = () => {
        router.push("../join-league");
    };

    const onRefresh = async () => {
        setRefreshKey(prevKey => prevKey + 1);
        triggerRefresh();
    };

    const leaveLeagueButton = () => {
        Alert.alert(
            "Leave League",
            "Are you sure you want to leave your league?",
            [
                {
                    text: "No",
                    onPress: () => {
                        setShowLeaveButton(false);
                        setHasScrolledDown(false)
                        console.log("User canceled");
                    },
                    style: "cancel"
                },
                {
                    text: "Yes", onPress: async () => {
                        try {
                            setLoading(true);
                            await leaveLeague(user, league);
                            triggerRefresh();
                            router.replace("/join-league");
                        } catch (error) {
                            console.error("Failed to leave league:", error);
                        } finally {
                            setLoading(false);
                        }
                    }, style: "destructive"
                }
            ]
        );
    };

    const handleScroll = ({ nativeEvent }) => {
        const { contentOffset, contentSize, layoutMeasurement } = nativeEvent;

        // Check if user scrolled far enough beyond the end of the list
        if (contentOffset.y > contentSize.height - layoutMeasurement.height + 160 && !hasScrolledDown) {
            setShowLeaveButton(true);
            setHasScrolledDown(true); // Ensures the button stays visible
        }
    };

    if (loading) {
        return <Loading />
    }

    if (league) {
        return (
            <SafeAreaView key={refreshKey} style={styless.safeArea} edges={['left', 'right', 'top']}>
                <View style={styless.leagueBackground}>
                    <FlatList
                        data={[]} // No data since you're using headers and footers
                        ListHeaderComponent={() => (
                            <>
                                <LeagueTitleAndProfile
                                    currentUser={user}
                                    leagueTitle={capitalizeFirstLetterOfEachWord(league.name)}
                                    weekNum={weekNum}
                                    hideProfile={parsedLeague !== null}
                                />
                                <LeagueStats rank={league.rank} weekPoints={league["weekly-total-points"]} totalPoints={league["cumulative-total-points"]} weekNum={weekNum} />
                                <LeagueParticipants league={league} />

                                {/* Conditional rendering for the Leave League button */}
                                {showLeaveButton && !parsedLeague && (
                                    <TouchableOpacity style={styless.leaveLeagueButton} onPress={leaveLeagueButton}>
                                        <Text style={styless.leaveLeagueText}>Leave League</Text>
                                    </TouchableOpacity>
                                )}
                            </>
                        )}
                        refreshControl={
                            <RefreshControl refreshing={loading} onRefresh={onRefresh} />
                        }
                        onScroll={handleScroll} // Listen for scroll event
                        scrollEventThrottle={16} // Improve performance
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
                        data={[]} // No data here as well
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

export default LeagueScreen;

const styless = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'white',
    },
    leagueBackground: {
        flex: 1,
    },
    leaveLeagueButton: {
        //position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        backgroundColor: 'red',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop: 40,
    },
    leaveLeagueText: {
        fontSize: 16,
        color: 'white',
        fontFamily: 'RobotoSlab-Regular',
    },
});
