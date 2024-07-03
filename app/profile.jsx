import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const Profile = () => {
    return (
        <SafeAreaView className="bg-red-100 h-full">
            <View className="pt-5">
                <Text className="text-center" style={{ fontSize: 35, fontWeight: 'bold' }}>Username</Text>
                <Text className="text-center font-medium mt-2" style={{ fontSize: 16 }}>League: League Title</Text>
            </View>
        </SafeAreaView>
    )
}

export default Profile