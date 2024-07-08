import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import usePickLineup from '../../components/pickLineup_components/usePickLineup';
import { FontAwesome } from '@expo/vector-icons'; // Import icon library

const PickLineup = () => {
    const {
        cycleWeekNum,
        picks,
        totalPointsEarned,
        totalPotentialPoints,
        renderStatusIcon,
        goToPreviousWeek,
        goToNextWeek,
    } = usePickLineup();

    return (
        <SafeAreaView className="bg-red-100 h-full" style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.header}>My Pick - Lineup</Text>
                <View style={styles.weekNavigation}>
                    <TouchableOpacity onPress={goToPreviousWeek}>
                        <FontAwesome name="arrow-left" size={24} />
                    </TouchableOpacity>
                    <Text style={styles.subHeader}>Week {cycleWeekNum}</Text>
                    <TouchableOpacity onPress={goToNextWeek}>
                        <FontAwesome name="arrow-right" size={24} />
                    </TouchableOpacity>
                </View>
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
                    <Text style={styles.totalPointsText}>{totalPotentialPoints} pts</Text>
                </View>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalText}>Total Points Earned</Text>
                    <Text style={styles.earnedPointsText}>{totalPointsEarned} pts</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    container: {
        flex: 1,
        padding: 20,
        margin: 10,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    weekNavigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    subHeader: {
        fontSize: 18,
        textAlign: 'center',
    },
    scrollView: {
        flex: 1,
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
});

export default PickLineup;
