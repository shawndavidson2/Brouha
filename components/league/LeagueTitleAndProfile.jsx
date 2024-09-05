import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import React from 'react';
import { icons } from '../../constants';
import { useRouter } from 'expo-router'; // Import useRouter for back navigation

const LeagueTitleAndProfile = ({ currentUser, leagueTitle, weekNum, hideProfile }) => {
    const router = useRouter();

    const profile = () => {
        router.push({ pathname: "../../profile" });
    };

    const goBack = () => {
        router.back(); // Navigate back
    };

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                {hideProfile && (
                    <TouchableOpacity onPress={goBack} style={styles.backButton}>
                        <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>
                )}
                <View style={styles.titleContainer}>
                    <Text style={styles.leagueTitle} numberOfLines={1}>
                        {leagueTitle}
                    </Text>
                    <Text style={styles.weekText}>
                        Week {weekNum}
                    </Text>
                </View>
                {!hideProfile && (
                    <TouchableOpacity onPress={profile} style={styles.profileButton}>
                        <Image
                            source={icons.profile}
                            resizeMode="contain"
                            style={styles.profileImage}
                        />
                    </TouchableOpacity>
                )}
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
        fontFamily: 'RobotoSlab-Bold',
    },
    weekText: {
        fontSize: 20,
        fontWeight: 'medium',
        marginTop: 2,
        textAlign: 'center',
        fontFamily: 'RobotoSlab-Regular',
    },
    backButton: {
        position: 'absolute',
        left: 25,
        top: 10, // Align to the top
    },
    backText: {
        fontSize: 18,
        fontFamily: 'RobotoSlab-Regular',
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
