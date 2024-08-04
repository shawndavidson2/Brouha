import React from 'react';
import { View, ActivityIndicator, SafeAreaView } from 'react-native';
import styles from '../app/styles';

export default ({ key }) => (
    key ? (
        <SafeAreaView key={key} style={styles.safeArea}>
            <ActivityIndicator size="large" color="#8b2326" />
        </SafeAreaView>
    ) : (
        <View style={styles.loadingScreen} >
            <ActivityIndicator size="large" color="#8b2326" />
        </View>
    )
);