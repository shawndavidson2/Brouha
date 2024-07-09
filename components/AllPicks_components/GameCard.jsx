import React from 'react';
import { View, Text, StyleSheet, Button, Image, TouchableOpacity } from 'react-native';
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
                <Text style={styles.overUnderText}>O/U {overUnder}</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={() => { }}>
                <Text style={styles.buttonText}>See Picks</Text>
            </TouchableOpacity>
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
