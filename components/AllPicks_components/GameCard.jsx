import React from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import getImageSource from './getImageSource';

const GameCard = ({ homeTeam, awayTeam, date, time, spread, overUnder }) => {
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
                <Text></Text>
                <Text style={styles.overUnderText}>O/U {overUnder}</Text>
            </View>
            <Button title="See Picks" onPress={() => { }} />
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    teamContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    teamImage: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
    teamText: {
        fontSize: 24,
        fontWeight: 'bold',
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
        fontSize: 18,
        fontWeight: 'bold',
    },
    overUnderText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default GameCard;
