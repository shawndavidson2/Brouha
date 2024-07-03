import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Slot, Stack } from 'expo-router'
import GlobalProvider from '../context/GlobalProvider';

const RootLayout = () => {
    return (
        <GlobalProvider>
            <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="profile" options={{ headerShown: false }} />
                <Stack.Screen name="join-league" options={{ headerShown: false }} />
            </Stack>
        </GlobalProvider>
    )
}

export default RootLayout

