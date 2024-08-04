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
                    <View className="w-full flex justify-center items-center mt-6 px-4">
                        <TouchableOpacity className="flex w-full items-start mb-0 mt-0" >
                            <Text onPress={goBack} style={{ fontSize: 18 }}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={logout}
                            className="flex w-full items-end mb-0"
                        >
                            <Image
                                source={icons.logout}
                                resizeMode="contain"
                                className="w-6 h-6"
                            />
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

export default Profile