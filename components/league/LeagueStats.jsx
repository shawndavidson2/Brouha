import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

const LeagueStats = ({ rank, weekPoints, totalPoints, weekNum }) => {

    const formatNumber = (num) => {
        return num ? num.toLocaleString() : 0;
    };

    // if (rank === null || weekPoints === null || totalPoints === null) {
    //     return null;
    // }

    return (
        <View style={styles.outerContainer}>
            <View style={styles.container}>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>League Rank</Text>
                    <Text style={styles.statValue}>{formatNumber(rank)}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Week {weekNum} Pts</Text>
                    <Text style={styles.statValue}>{formatNumber(weekPoints)}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Total Pts</Text>
                    <Text style={styles.statValue}>{formatNumber(totalPoints)}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        width: '100%', // Ensure the outer container takes up full width
        alignItems: 'center', // Center the inner container horizontally
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 0,
        borderRadius: 10,
        paddingRight: 15
    },
    statItem: {
        alignItems: 'center',
        paddingHorizontal: 10, // Add horizontal padding to space out items evenly
    },
    statLabel: {
        fontSize: 17,
        fontWeight: 'bold',
        fontFamily: 'RobotoSlab-bold'
    },
    statValue: {
        fontSize: 20,
        marginTop: 5,
        fontFamily: 'RobotoSlab-Regular'
    },
    divider: {
        borderLeftWidth: 3, // Thicker line
        borderLeftColor: '#8b2326', // Red color
        height: '100%',
    },
});

export default LeagueStats;
