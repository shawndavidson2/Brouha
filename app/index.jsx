import { ScrollView, View, ActivityIndicator, StyleSheet } from 'react-native';
import React from 'react';
import { Redirect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '../context/GlobalProvider';
import SignIn from './(auth)/sign-in';
import { symbolName } from 'typescript';

const index = () => {
    const { isLoading, isLoggedIn } = useGlobalContext();

    if (!isLoading && isLoggedIn) return <Redirect href="./league" />

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={{ height: '100%' }}>
                {isLoading ? (
                    <View style={styles.safeArea}>
                        <ActivityIndicator size="large" color="#8b2326" />
                    </View>
                ) : (
                    <SignIn />
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#343434',
    },
});

export default index;
