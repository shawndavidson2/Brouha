import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Import icon library
import { SafeAreaView } from 'react-native-safe-area-context';
import usePickLineup from '../../components/pickLineup_components/usePickLineup';

const ProfileLineup = ({ user }) => {
    const [expandedWeek, setExpandedWeek] = useState(null);

    const userWeeks = user["weekly-lineup"] ? user["weekly-lineup"].length : 0;
    const weeks = Array.from({ length: userWeeks }, (_, i) => i);

    const toggleWeek = (week) => {
        if (expandedWeek === week) {
            setExpandedWeek(null);
        } else {
            setExpandedWeek(week);
        }
    };

    return (
        <SafeAreaView className="bg-red-100 h-full" style={styles.safeArea}>
            <View style={styles.container}>
                {weeks.map((week) => (
                    <View key={week}>
                        <TouchableOpacity onPress={() => toggleWeek(week)} style={styles.weekSummary}>
                            <Text style={styles.weekText}>Week {week} Pick Lineup</Text>
                            <FontAwesome name={expandedWeek === week ? "angle-up" : "angle-down"} size={24} />
                        </TouchableOpacity>
                        {expandedWeek === week && (
                            <WeekDetails week={week} />
                        )}
                    </View>
                ))}
            </View>
        </SafeAreaView>
    );
};

const WeekDetails = ({ week }) => {
    const { picks, totalPointsEarned, renderStatusIcon } = usePickLineup(week);

    return (
        <View style={styles.weekDetails}>
            <ScrollView style={styles.scrollView}>
                {picks.map((pick) => (
                    <View key={pick.$id} style={styles.pickItem}>
                        <Text style={styles.pickText}>{pick["pick-title"]}</Text>
                        <Text style={styles.pointsText}>{pick["potential-points"]} pts</Text>
                        <View style={styles.statusIcon}>{renderStatusIcon(pick.status)}</View>
                    </View>
                ))}
            </ScrollView>
            <View style={styles.totalContainer}>
                <Text style={styles.totalText}>Total Potential Points</Text>
                <Text style={styles.totalPointsText}>{picks.reduce((total, pick) => total + pick["potential-points"], 0)} pts</Text>
            </View>
            <View style={styles.totalContainer}>
                <Text style={styles.totalText}>Total Points Earned</Text>
                <Text style={styles.earnedPointsText}>{totalPointsEarned} pts</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    weekHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    weekDetails: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    scrollView: {
        marginBottom: 20,
    },
    pickItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    pickText: {
        fontSize: 16,
        flex: 1,
    },
    pointsText: {
        fontSize: 16,
    },
    statusIcon: {
        marginLeft: 10,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    totalText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    totalPointsText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    earnedPointsText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'green',
    },
    weekSummary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    weekText: {
        fontSize: 18,
    },
});

export default ProfileLineup;
