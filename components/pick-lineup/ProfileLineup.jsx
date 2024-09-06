import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Import icon library
import { SafeAreaView } from 'react-native-safe-area-context';
import usePickLineup from '../../components/pick-lineup/usePickLineup';
import { useGlobalContext } from '../../context/GlobalProvider';
import Loading from '../Loading';

const ProfileLineup = ({ userId, leagueId }) => {
    const [expandedWeek, setExpandedWeek] = useState(null);

    const { user, league, weekNum } = useGlobalContext();

    const userWeeks = weekNum;
    const weeks = Array.from({ length: weekNum }, (_, i) => i + 1);
    weeks.reverse();

    const toggleWeek = (week) => {
        if (expandedWeek === week) {
            setExpandedWeek(null);
        } else {
            setExpandedWeek(week);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView>
                <View style={styles.container}>
                    {weeks.map((week) => (
                        // Only show lineup if user.$id matches userId or it's not the current weekNum
                        (league.$id === leagueId || user.$id === userId || week !== weekNum) && (
                            <View key={week}>
                                <TouchableOpacity onPress={() => toggleWeek(week)} style={styles.weekSummary}>
                                    <Text style={styles.weekText}>Week {week} Pick Lineup</Text>
                                    <FontAwesome name={expandedWeek === week ? "angle-up" : "angle-down"} size={24} />
                                </TouchableOpacity>
                                {expandedWeek === week && (
                                    <WeekDetails week={week} userId={userId} />
                                )}
                            </View>
                        )
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const WeekDetails = ({ week, userId }) => {
    const { picks, totalPointsEarned, totalPotentialPoints, renderStatusIcon } = usePickLineup(week, userId);

    if (picks.length === 0) return (
        <View style={styles.weekDetails}>
            <ScrollView style={styles.scrollView}>
                <Loading color={true} />
            </ScrollView>
            <View style={styles.totalContainer}>
                <Text style={styles.totalText}>Total Potential Points</Text>
                <Text style={styles.totalPointsText}> pts</Text>
            </View>
            <View style={styles.totalContainer}>
                <Text style={styles.totalText}>Total Points Earned</Text>
                <Text style={styles.earnedPointsText}> pts</Text>
            </View>
        </View>

    );

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
                <Text style={styles.totalPointsText}>{totalPotentialPoints} pts</Text>
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
        fontFamily: 'RobotoSlab-Regular'
    },
    pickText: {
        fontSize: 16,
        flex: 1,
        fontFamily: 'RobotoSlab-Regular'
    },
    pointsText: {
        fontSize: 16,
        fontFamily: 'RobotoSlab-Regular'
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
        fontFamily: 'RobotoSlab-Regular'
    },
    totalPointsText: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'RobotoSlab-Regular'
    },
    earnedPointsText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'green',
        fontFamily: 'RobotoSlab-Regular'
    },
    weekSummary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        fontFamily: 'RobotoSlab-Regular'
    },
    weekText: {
        fontSize: 18,
        fontFamily: 'RobotoSlab-Regular'
    },
});

export default ProfileLineup;
