import { ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '../context/GlobalProvider';
import SignIn from './(auth)/sign-in';
import styles from './styles';
import Loading from '../components/Loading';
import * as Font from 'expo-font';

const loadFonts = async () => {
    await Font.loadAsync({
        'RobotoSlab-Regular': require('../assets/fonts/RobotoSlab-Regular.ttf'),
        'RobotoSlab-Bold': require('../assets/fonts/RobotoSlab-Bold.ttf'),
        'RobotoSlab-SemiBold': require('../assets/fonts/RobotoSlab-SemiBold.ttf'),
        'RobotoSlab-ExtraBold': require('../assets/fonts/RobotoSlab-ExtraBold.ttf'),
    });
};

const Index = () => {
    const { isLoading, isLoggedIn } = useGlobalContext();
    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        (async () => {
            await loadFonts();
            setFontsLoaded(true);
        })();
    }, []);

    if (!fontsLoaded || isLoading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <Loading />
            </SafeAreaView>
        );
    }

    if (isLoggedIn) {
        return <Redirect href="./league" />;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={{ height: '100%' }}>
                <SignIn />
            </ScrollView>
        </SafeAreaView>
    );
};

export default Index;
