import { View, Text, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useGlobalContext } from '../context/GlobalProvider';
import { TouchableOpacity, ScrollView } from 'react-native';
import { signOut } from '../lib/appwrite';
import { useRouter } from 'expo-router';
import styles from './styles';
import ProfileLineup from '../components/pick-lineup/ProfileLineup';
import { StatusBar } from 'expo-status-bar';

const Profile = () => {
    const router = useRouter();

    const { user: globalUser, setUser, setIsLoggedIn, league: globalLeague } = useGlobalContext();
    const { leagueUser } = useLocalSearchParams();

    const parsedLeagueUser = leagueUser ? JSON.parse(leagueUser) : null;

    // Use either the passed user/league or fallback to the global context
    const [user, setUserState] = useState(parsedLeagueUser || globalUser);
    const [league, setLeagueState] = useState(globalLeague);


    const [leagueName, setLeagueName] = useState("No League Yet");

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
                    <ProfileLineup user={user.$id} />
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
