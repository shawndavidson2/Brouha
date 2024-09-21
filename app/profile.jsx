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
import { formatNumberWithComma } from '../components/utils';
import { AntDesign } from '@expo/vector-icons';

const Profile = () => {
    const { triggerRefresh } = useRefresh();
    const router = useRouter();

    const { user: globalUser, setUser, setIsLoggedIn, league: globalLeague, setLeague, weekNum } = useGlobalContext();
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

    const rankInfo = () => {
        const rank = user.rankCategory

        let rankDescriptions = "";

        if (parsedLeagueUser) {
            rankDescriptions = {
                "Legend": "This user is among the elite with over 75,000 points. A true legend!",
                "HOF": "This user has earned over 60,000 points and is recognized in the Hall of Fame.",
                "All-Pro": "With over 40,000 points, this user is considered All-Pro, showcasing top skills.",
                "Pro": "This user has surpassed 30,000 points and achieved the Pro rank. Great job!",
                "Varsity": "This user has reached Varsity status with over 20,000 points. Keep an eye on them!",
                "JV": "This user is in the Junior Varsity category with over 10,000 points. They're on their way!",
                "Freshman": "This user is starting off strong as a Freshman. Keep watching as they rank up!"
            };
        } else {
            rankDescriptions = {
                "Legend": "You are among the elite with over 75,000 points. A true legend!",
                "HOF": "You've earned over 60,000 points and are recognized in the Hall of Fame.",
                "All-Pro": "With over 40,000 points, you're considered All-Pro, showcasing top skills.",
                "Pro": "A Pro rank means you’ve surpassed 30,000 points. Great job!",
                "Varsity": "Varsity status is achieved with over 20,000 points. Keep pushing!",
                "JV": "With over 10,000 points, you're in the Junior Varsity category. You're on your way!",
                "Freshman": "You’re starting off strong as a Freshman. Keep playing to rank up!"
            };
        }



        Alert.alert(
            "Rank Meaning",
            rankDescriptions[rank] || "No rank information available.",
            [
                { text: "Got it" }
            ],
            { cancelable: true }
        );
    };



    if (loading) { return <Loading /> }

    return (
        <SafeAreaView style={styless.safeArea} edges={['left', 'right', 'top']} >
            <View style={styless.headerRow}>

                <TouchableOpacity style={styless.headerButtons}>
                    <Text onPress={goBack} style={styless.backButtonText}>{"< Back"}</Text>
                </TouchableOpacity>
                {!parsedLeagueUser && (
                    <TouchableOpacity onPress={logout}>
                        <Text style={styless.logoutText}>Logout</Text>
                    </TouchableOpacity>
                )}
            </View>
            <View style={styless.container}>
                <View style={styless.margin}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                        <View style={styless.profileInfo}>
                            <Text style={styless.usernameText}>{user?.username ? user.username : "Unknown User"}</Text>
                        </View>

                        <View style={styless.statItem}>
                            <Text style={styless.totalPointsText}>{user?.totalPoints >= 0 ? formatNumberWithComma(user.totalPoints) : 0}pts</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <View style={styless.statItem}>
                                <Text style={styless.rankText}>Rank: {user?.rankCategory ? user.rankCategory : "No Rank"}</Text>
                            </View>
                            <TouchableOpacity style={styless.infoCircle} onPress={() => { rankInfo() }}>
                                <AntDesign name="infocirlceo" size={15} color="#8b2326" />
                            </TouchableOpacity>
                        </View>
                        <View style={styless.userStats}>
                            <View style={styless.stat}>
                                <Text style={styless.label}>Picks W-L</Text>
                                <Text style={styless.value}>{user.numPicksWon ?? 0}-{user.numPicksLost ?? 0}</Text>
                            </View>
                            <View style={styless.stat}>
                                <Text style={styless.label}>Avg Weekly Pts</Text>
                                <Text style={styless.value}>{(user.totalPoints / weekNum).toFixed(2)}</Text>
                            </View>
                            <View style={styless.stat}>
                                <Text style={styless.label}>Best Week</Text>
                                <Text style={styless.value}>{user.bestWeek ?? 0}</Text>
                            </View>
                        </View>
                        <View style={{ marginTop: 20 }}>

                            <ProfileLineup userId={user.$id} leagueId={league.$id} />

                        </View>
                    </ScrollView>
                </View>
            </View>
            <StatusBar style="light" />
        </SafeAreaView >
    );
}

const styless = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#343434',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#343434',
        marginTop: 10,
        marginBottom: 12,
        paddingHorizontal: 20,
    },
    headerButtons: {
        marginBottom: 10,
        fontFamily: 'RobotoSlab-Regular',
    },
    backButtonText: {
        fontSize: 22,
        fontFamily: 'RobotoSlab-Regular',
        color: '#DBB978',
        textAlign: 'left',
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    margin: {
        marginHorizontal: 12,
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
        fontSize: 18,
        marginBottom: 10,
        fontFamily: 'RobotoSlab-Regular',
        color: '#DBB978',
        textAlign: 'right',
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
    infoCircle: {
        paddingLeft: 6,
        marginTop: 10
    },
    usernameText: {
        marginTop: 16,
        fontSize: 35,
        fontFamily: 'RobotoSlab-ExtraBold'
    },
    leagueText: {
        fontSize: 16,
        fontWeight: '500',
        marginTop: 2,
        fontFamily: 'RobotoSlab-Regular'
    },
    statItem: {
        alignItems: 'center',
        fontFamily: 'RobotoSlab-Regular',
    },
    totalPointsText: {
        fontSize: 25,
        marginTop: 0,
        fontFamily: 'RobotoSlab-Bold',
        color: '#8b2326',
    },
    rankText: {
        fontSize: 16,
        marginTop: 10,
        fontFamily: 'RobotoSlab-Regular',
    },
    userStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        alignItems: 'center',
        marginTop: 25,
    },
    stat: {
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        textDecorationLine: 1,
        fontFamily: 'RobotoSlab-Bold',
    },
    value: {
        fontSize: 17,
        marginTop: 2,
        fontFamily: 'RobotoSlab-Regular',
    },

});

export default Profile;
