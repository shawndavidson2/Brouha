import { ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React from 'react';
import { Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import { useGlobalContext } from '../context/GlobalProvider';
import SignIn from './(auth)/sign-in';

const index = () => {
    const { isLoading, isLoggedIn } = useGlobalContext();

    if (!isLoading && isLoggedIn) return <Redirect href="./league" />

    return (
        <SafeAreaView className="bg-red-100 h-full">
            <ScrollView contentContainerStyle={{ height: '100%' }}>
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                ) : (
                    <SignIn />
                )}
            </ScrollView>

            <StatusBar style='dark' />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default index;
