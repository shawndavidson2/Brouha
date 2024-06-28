import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const index = () => {
    return (
        <View className="flex-1 items-center justify-center bg-red-100">
            <Text className="text-3xl">Brouha!!</Text>
            <StatusBar style="auto" />
            <Link href="/league" style={{ color: 'blue' }}>Go</Link>
        </View>
    )
}

export default index

