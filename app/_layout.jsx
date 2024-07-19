import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Slot, Stack } from 'expo-router';
import GlobalProvider from '../context/GlobalProvider';
import { LineupProvider } from '../context/lineupContext';
import { RefreshProvider, useRefresh } from '../context/RefreshContext';
import { StatusBar } from 'expo-status-bar';

const RootLayout = () => {
    const { refreshKey } = useRefresh();

    return (
        <GlobalProvider key={refreshKey}>
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
    );
};

const App = () => (
    <RefreshProvider>
        <RootLayout />
        <StatusBar style='dark' />
    </RefreshProvider>
);

export default App;
