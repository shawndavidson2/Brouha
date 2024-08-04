import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import styles from '../app/styles';

export default () => (
    <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#8b2326" />
    </View>
);