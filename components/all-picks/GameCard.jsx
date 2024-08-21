import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import getImageSource from './getImageSource';
import { useRouter } from 'expo-router';

const GameCard = ({ homeTeam, awayTeam, date, time, spread, overUnder, fileUrl }) => {
    const router = useRouter();

    const handlePress = () => {
        const sheetName1 = `${awayTeam}vs${homeTeam}`;
        const sheetName2 = `${homeTeam} vs ${awayTeam}`;
        router.push({
            pathname: '/gameDetail',
            params: { sheetName1, sheetName2, date, time, fileUrl },
        });
    };

    return (
        <View style={styles.card}>
            <View style={styles.teamContainer}>
                <Image source={getImageSource(homeTeam)} style={styles.teamImage} />
                <Text style={styles.vsText}>-vs-</Text>
                <Image source={getImageSource(awayTeam)} style={styles.teamImage} />
            </View>
            <View style={styles.dateTimeContainer}>
                <Text style={styles.dateText}>{date}</Text>
                <Text style={styles.timeText}>{time}</Text>
            </View>
            <View style={styles.spreadContainer}>
                <Text style={styles.spreadText}>{spread}</Text>
                <Text style={styles.overUnderText}>O/U {overUnder}</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={handlePress}>
                <Text style={styles.buttonText}>See Picks</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 8,
        marginVertical: 5,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    teamContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    teamImage: {
        width: 55,
        height: 55,
        resizeMode: 'contain',
    },
    vsText: {
        fontSize: 18,
    },
    dateTimeContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 14,
    },
    timeText: {
        fontSize: 14,
    },
    spreadContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    spreadText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    overUnderText: {
        marginTop: 10,
        fontSize: 20,
        fontWeight: 'bold',
    },
    button: {
        borderWidth: 2,
        borderColor: '#000',
        paddingVertical: 5,
        paddingHorizontal: 7,
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default GameCard;
