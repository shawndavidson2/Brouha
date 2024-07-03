import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Redirect, router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../components/CustomButton'
import { useGlobalContext } from '../context/GlobalProvider'
import SignIn from './(auth)/sign-in'

const index = () => {
    const { isLoading, isLoggedIn } = useGlobalContext();
    if (!isLoading && isLoggedIn) return <Redirect href="./league" />

    return (
        <SafeAreaView className="bg-red-100 h-full">
            < ScrollView contentContainerStyle={{ height: '100%' }
            }>
                <SignIn />
            </ScrollView >

            <StatusBar style='dark' />

        </SafeAreaView >
    )
}

export default index

