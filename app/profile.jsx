import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams } from 'expo-router'
import styles from './styles'
import { useGlobalContext } from '../context/GlobalProvider'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { icons } from '../constants'
import { Image } from 'react-native'
import { signOut } from '../lib/appwrite'
import { useState, useEffect } from 'react'
import { router } from 'expo-router'
import { ScrollView } from 'react-native'
import ProfileLineup from '../components/pick-lineup/ProfileLineup'

const Profile = () => {
    const { user, setUser, setIsLoggedIn, league } = useGlobalContext();

    const [leagueName, setLeagueName] = useState("No League Yet");

    useEffect(() => {
        if (user && league) {
            setLeagueName(league.name);
        }
    }, [user]);

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
            <View style={styles.container}>
                <ScrollView contentContainerStyle={{ height: '100%' }} >
                    <View className="w-full flex flex-row justify-between items-center mt-6 px-4 mb-2">
                        <TouchableOpacity onPress={goBack} className="mb-0 mt-0">
                            <Text style={{ fontSize: 18 }}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={logout} className="mb-0">
                            <Text className="text-base text-red-500">Logout</Text>
                        </TouchableOpacity>
                    </View>


                    <View className="pt-0">
                        <Text className="text-center pt-0" style={{ fontSize: 35, fontWeight: 'bold' }}>{user?.username ? user.username : ""}</Text>
                        <Text className="text-center font-medium mt-2" style={{ fontSize: 16 }}>League: {leagueName}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 25 }}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontSize: 26, marginTop: 5 }}>{user?.rankCategory ? user.rankCategory : ""}</Text>
                        </View>
                        <View style={{ alignItems: 'center', borderLeftWidth: 1, borderLeftColor: 'black', height: '100%', marginHorizontal: 0 }} />
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontSize: 26, marginTop: 5 }}>{user?.totalPoints >= 0 ? user.totalPoints : ""}  Points</Text>
                        </View>
                    </View>
                    <ProfileLineup />
                </ScrollView >
            </View >
        </SafeAreaView >
    )
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

export default Profile