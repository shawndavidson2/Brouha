import { ScrollView } from 'react-native';
import React from 'react';
import { Redirect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '../context/GlobalProvider';
import SignIn from './(auth)/sign-in';
import { symbolName } from 'typescript';
import styles from './styles';
import Loading from '../components/Loading';
import * as Font from 'expo-font';

const loadFonts = () => {
    return Font.loadAsync({
        'RobotoSlab-Regular': require('../assets/fonts/RobotoSlab-Regular.ttf'),
    });
};



const index = () => {
    const { isLoading, isLoggedIn } = useGlobalContext();

    if (!isLoading && isLoggedIn) return <Redirect href="./league" />

    useEffect(() => {
        loadFonts();
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={{ height: '100%' }}>
                {isLoading ? (
                    <Loading />
                ) : (
                    <SignIn />
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

export default index;
