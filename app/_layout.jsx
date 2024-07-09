import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Slot, Stack } from 'expo-router'
import GlobalProvider from '../context/GlobalProvider';
import { useState, useEffect } from 'react';
import { getCurrentUser } from '../lib/appwrite';
import { LineupProvider } from '../context/lineupContext';

const RootLayout = () => {
    return (
        <GlobalProvider>
            <LineupProvider>
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

export default RootLayout

