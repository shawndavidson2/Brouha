import React, { useEffect, useRef } from 'react';
import { View, ActivityIndicator, SafeAreaView, Text, Animated, StyleSheet, Image } from 'react-native';
//import styles from '../app/styles';

export default ({ key, color, leaderboard }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Fade-in animation for the loading screen
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    return key ? (
        <SafeAreaView key={key} style={styles.safeArea}>
            <ActivityIndicator size="large" color={'#8b2326'} />
        </SafeAreaView>
    ) : (
        <Animated.View style={[color ? styles.loadingScreenWhite : styles.loadingScreen, { opacity: fadeAnim }]}>
            <View style={styles.loaderContainer}>
                {/* Conditionally show the image only if the loading screen is not white */}
                {!color && !leaderboard && (
                    <Image
                        source={require('../assets/images/icon.png')}
                        style={styles.iconImage}
                        resizeMode="contain"
                    />
                )}
                <ActivityIndicator size="large" color={'#8b2326'} />
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    loadingScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#343434',
    },
    loadingScreenWhite: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFF',
    },
    loaderContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconImage: {
        width: 200,
        height: 200,
        marginBottom: 10, // Add space between the image and the spinner
    },
    loadingText: {
        marginTop: 20,
        fontSize: 16,
        color: '#8b2326',
        fontWeight: 'bold',
        fontFamily: 'RobotoSlab-Bold',
    },
});