import { View, Text, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useGlobalContext } from '../context/GlobalProvider';
import { TouchableOpacity, ScrollView } from 'react-native';
import { signOut, leaveLeague } from '../lib/appwrite';
import { useRouter } from 'expo-router';
import styles from './styles';
import ProfileLineup from '../components/pick-lineup/ProfileLineup';
import { StatusBar } from 'expo-status-bar';
import { Alert } from 'react-native';
import { useRefresh } from '../context/RefreshContext';
import Loading from '../components/Loading';

const Profile = () => {
    const { triggerRefresh } = useRefresh();
    const router = useRouter();

    const { user: globalUser, setUser, setIsLoggedIn, league: globalLeague, setLeague } = useGlobalContext();
    const { leagueUser, passedLeague } = useLocalSearchParams();

    const parsedLeagueUser = leagueUser ? JSON.parse(leagueUser) : null;
    const parsedLeague = passedLeague ? JSON.parse(passedLeague) : null;

    // Use either the passed user/league or fallback to the global context
    const [user, setUserState] = useState(parsedLeagueUser || globalUser);
    const [league, setLeagueState] = useState(parsedLeague || globalLeague);

    const [leagueName, setLeagueName] = useState("No League Yet");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user && league) {
            setLeagueName(league.name);
        }
    }, [user, league]);

    const goBack = () => {
        router.back();
    };

    const logout = async () => {
        router.replace("./(auth)/sign-in");
        await signOut();
        setUser(null);
        setIsLoggedIn(false);
    };

    const leaveLeagueButton = () => {
        Alert.alert(
            "Leave League",
            "Are you sure you want to leave your league?",
            [
                {
                    text: "No",
                    onPress: () => console.log("User canceled"),
                    style: "cancel" // This will make the button appear as a 'cancel' action
                },
                {
                    text: "Yes",
                    onPress: async () => {
                        try {
                            setLoading(true);
                            // Logic for leaving the league
                            await leaveLeague(user, league); // Assuming `leaveLeague` doesn't need `user` and `league` params as it gets them internally
                            triggerRefresh(); // Refresh data after leaving league
                            router.replace("/join-league"); // Navigate to join league screen
                        } catch (error) {
                            console.error("Failed to leave league:", error);
                        } finally {
                            setLoading(false);
                        }
                    },
                    style: "destructive" // Optional, to indicate a destructive action like leaving
                }
            ]
        );
    };

    if (loading) { return <Loading /> }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styless.container}>
                <ScrollView contentContainerStyle={{ height: '100%' }}>
                    <View style={styless.headerContainer}>
                        <TouchableOpacity onPress={goBack}>
                            <Text style={styless.backText}>Back</Text>
                        </TouchableOpacity>
                        {!parsedLeagueUser && (
                            <TouchableOpacity onPress={logout}>
                                <Text style={styless.logoutText}>Logout</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styless.profileInfo}>
                        <Text style={styless.usernameText}>{user?.username ? user.username : "Unknown User"}</Text>
                        <Text style={styless.leagueText}>League: {leagueName}</Text>

                        {/* Leave League Button, displayed only if the Logout button is visible */}
                        {!parsedLeagueUser && (
                            <TouchableOpacity onPress={leaveLeagueButton}>
                                <Text style={styless.leaveLeagueText}>Leave League</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styless.statsContainer}>
                        <View style={styless.statItem}>
                            <Text style={styless.statText}>{user?.rankCategory ? user.rankCategory : "No Rank"}</Text>
                        </View>
                        <View style={styless.divider} />
                        <View style={styless.statItem}>
                            <Text style={styless.statText}>{user?.totalPoints >= 0 ? user.totalPoints : 0} Points</Text>
                        </View>
                    </View>
                    <ProfileLineup userId={user.$id} leagueId={league.$id} />
                </ScrollView>
            </View>
            <StatusBar style="light" />
        </SafeAreaView>
    );
}

const styless = StyleSheet.create({
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
    headerContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 6,
        paddingHorizontal: 4,
        marginBottom: 2,
    },
    backText: {
        fontSize: 18,
        fontFamily: 'RobotoSlab-Regular'
    },
    logoutText: {
        fontSize: 16,
        color: 'red',
        fontFamily: 'RobotoSlab-Regular'
    },
    leaveLeagueText: {
        fontSize: 16,
        color: 'red',
        fontFamily: 'RobotoSlab-Regular',
        marginTop: 10 // Add some margin to position it properly under the League text
    },
    profileInfo: {
        paddingTop: 15,
        alignItems: 'center',
        fontFamily: 'RobotoSlab-Regular'
    },
    usernameText: {
        fontSize: 35,
        fontFamily: 'RobotoSlab-ExtraBold'
    },
    leagueText: {
        fontSize: 16,
        fontWeight: '500',
        marginTop: 2,
        fontFamily: 'RobotoSlab-Regular'
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 25,
    },
    statItem: {
        alignItems: 'center',
        fontFamily: 'RobotoSlab-Regular'
    },
    statText: {
        fontSize: 26,
        marginTop: 5,
        fontFamily: 'RobotoSlab-Regular'
    },
    divider: {
        alignItems: 'center',
        borderLeftWidth: 1,
        borderLeftColor: 'black',
        height: '100%',
    },
});

export default Profile;
