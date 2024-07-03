import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams } from 'expo-router'
import { useGlobalContext } from '../context/GlobalProvider'

const Profile = () => {
    const { user } = useGlobalContext();
    return (
        <SafeAreaView className="bg-red-100 h-full">
            <View className="pt-5">
                <Text className="text-center" style={{ fontSize: 35, fontWeight: 'bold' }}>{user.username}</Text>
                <Text className="text-center font-medium mt-2" style={{ fontSize: 16 }}>League: {user.league.name}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 25 }}>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 26, marginTop: 5 }}>{user.rankCategory}</Text>
                </View>
                <View style={{ alignItems: 'center', borderLeftWidth: 1, borderLeftColor: 'black', height: '100%', marginHorizontal: 0 }} />
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 26, marginTop: 5 }}>{user.totalPoints}  Points</Text>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Profile