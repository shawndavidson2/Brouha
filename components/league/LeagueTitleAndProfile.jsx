import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React from 'react';
import { icons } from '../../constants';
import { router } from 'expo-router';

const LeagueTitleAndProfile = ({ currentUser, leagueTitle, weekNum }) => {
    const profile = () => {
        router.push({ pathname: "../../profile" });
    };

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <View style={styles.titleContainer}>
                    <Text style={styles.leagueTitle} numberOfLines={1}>
                        {leagueTitle}
                    </Text>
                    <Text style={styles.weekText}>
                        Week {weekNum}
                    </Text>
                </View>
                <TouchableOpacity onPress={profile} style={styles.profileButton}>
                    <Image
                        source={icons.profile}
                        resizeMode="contain"
                        style={styles.profileImage}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingVertical: 20,
        position: 'relative',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Center the title and week number
    },
    titleContainer: {
        alignItems: 'center',
    },
    leagueTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#8b2326',
        textAlign: 'center',
        marginBottom: 5,
        fontFamily: 'RobotoSlab-Bold'
    },
    weekText: {
        fontSize: 20,
        fontWeight: 'medium',
        marginTop: 2,
        textAlign: 'center',
        fontFamily: 'RobotoSlab-Regular'
    },
    profileButton: {
        position: 'absolute',
        right: 20,
        top: '35%',
        transform: [{ translateY: -16.5 }], // Vertically center the button
    },
    profileImage: {
        width: 33,
        height: 33,
        tintColor: '#8b2326',
    },
});

export default LeagueTitleAndProfile;
