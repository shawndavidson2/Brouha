import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { Slot, Stack } from 'expo-router';
import GlobalProvider from '../context/GlobalProvider';
import { LineupProvider } from '../context/lineupContext';

const RootLayout = () => {
    const [refreshKey, setRefreshKey] = useState(0);

    const triggerRefresh = () => {
        setRefreshKey(prevKey => prevKey + 1);
    };

    return (
        <GlobalProvider>
            <LineupProvider key={refreshKey}>
                <Stack>
                    <Stack.Screen name="index" options={{ headerShown: false }} />
                    <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="profile" options={{ headerShown: false }} />
                    <Stack.Screen name="join-league" options={{ headerShown: false }} />
                    <Stack.Screen name="gameDetail" options={{ headerShown: false }} />
                </Stack>
            </LineupProvider>
        </GlobalProvider>
    )
}

export default RootLayout;
