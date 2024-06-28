import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import Profile from '../profile'
import { FlatList } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { icons } from '../../constants'
import { Image } from 'react-native'

const League = () => {
    const profile = async () => {
        router.push("../profile")
    };

    return (
        <SafeAreaView className="bg-green-100 h-full">
            <FlatList
                ListHeaderComponent={() => (
                    <View className="w-full flex justify-center items-center mt-6 mb-12 px-8">
                        <TouchableOpacity
                            onPress={profile}
                            className="flex w-full items-end mb-10"
                        >
                            <Image
                                source={icons.profile}
                                resizeMode="contain"
                                className="w-8 h-8"
                            />
                        </TouchableOpacity>

                    </View>
                )}
            />
        </SafeAreaView>
    )
}

export default League