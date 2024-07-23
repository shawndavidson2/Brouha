import { ScrollView, View, ActivityIndicator } from 'react-native';
import React from 'react';
import { Redirect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '../context/GlobalProvider';
import SignIn from './(auth)/sign-in';

const index = () => {
    const { isLoading, isLoggedIn } = useGlobalContext();

    if (!isLoading && isLoggedIn) return <Redirect href="./league" />

    return (
        <SafeAreaView className="bg-red-100 h-full">
            <ScrollView contentContainerStyle={{ height: '100%' }}>
                {isLoading ? (
                    <View >
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                ) : (
                    <SignIn />
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

export default index;
