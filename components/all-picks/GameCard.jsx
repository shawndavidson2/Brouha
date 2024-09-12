import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import getImageSource from './getImageSource';
import { useRouter } from 'expo-router';
import { parseDateTime } from './gameDateUtils'

const GameCard = ({ homeTeam, awayTeam, date, time, spread, overUnder, fileUrl }) => {
    const router = useRouter();

    const convertDateToDay = (date, time) => {
        if (!date || !time) {
            console.error('Invalid date or time:', date, time);
            return false;
        }

        const gameDateTime = parseDateTime(date, time);
        const currentTime = new Date();

        // Create date objects for comparison (without time)
        const gameDate = new Date(gameDateTime.toDateString());
        const today = new Date(currentTime.toDateString());

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        if (gameDate.getTime() === today.getTime()) {
            return "Today";
        } else if (gameDate.getTime() === tomorrow.getTime()) {
            return "Tomorrow";
        } else {
            return date; // Return the original date if neither today nor tomorrow
        }
    };

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
                <Image source={getImageSource(awayTeam)} style={styles.teamImage} />
                <Text style={styles.vsText}>- @ -</Text>
                <Image source={getImageSource(homeTeam)} style={styles.teamImage} />
            </View>
            <View style={styles.dateTimeContainer}>
                <Text style={styles.dateText}>{convertDateToDay(date, time)}</Text>
                <Text style={styles.timeText}>{time}</Text>
            </View>
            <View style={styles.spreadContainer}>
                <Text style={styles.spreadText}>{spread}</Text>
                <Text style={styles.overUnderText}>O/U {overUnder.replace(/^(O\s|U\s|Over\s|Under\s)/, '')}</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={handlePress}>
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
        fontSize: 20,
        fontFamily: 'RobotoSlab-Bold'
    },
    dateTimeContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 14,
        fontFamily: 'RobotoSlab-Regular'
    },
    timeText: {
        fontSize: 14,
        fontFamily: 'RobotoSlab-Regular'
    },
    spreadContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    spreadText: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'RobotoSlab-Bold'
    },
    overUnderText: {
        marginTop: 10,
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'RobotoSlab-Bold'
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
        fontFamily: 'RobotoSlab-Bold'
    },
});

export default GameCard;
