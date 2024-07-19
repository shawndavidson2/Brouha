import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler'; // Import GestureHandlerRootView
import usePickLineup from '../../components/pick-lineup/usePickLineup';
import { FontAwesome } from '@expo/vector-icons'; // Import icon library
import { useGlobalContext } from '../../context/GlobalProvider';

const PickLineup = () => {
    const { weekNum } = useGlobalContext();
    const {
        cycleWeekNum,
        picks,
        totalPointsEarned,
        totalPotentialPoints,
        renderStatusIcon,
        goToPreviousWeek,
        goToNextWeek,
        deletePickFromPL, // Assuming you have a function to delete a pick
    } = usePickLineup(weekNum);

    const renderRightActions = (progress, dragX, onDelete) => {
        return (
            <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Remove from PL</Text>
            </TouchableOpacity>
        );
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
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
                            <Swipeable
                                key={pick.$id}
                                renderRightActions={(progress, dragX) =>
                                    renderRightActions(progress, dragX, () => deletePickFromPL(pick.$id))
                                }
                            >
                                <View style={styles.pickItem}>
                                    <View style={styles.pickDetails}>
                                        <Text style={styles.pickText}>{pick["pick-title"]}</Text>
                                        <Text style={styles.gameText}>{pick.game}</Text>
                                    </View>
                                    <Text style={styles.pointsText}>{pick["potential-points"]} pts</Text>
                                    <View style={styles.statusIcon}>{renderStatusIcon(pick.status)}</View>
                                </View>
                            </Swipeable>
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
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
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
    pickDetails: {
        flex: 1,
    },
    pickText: {
        fontSize: 16,
    },
    gameText: {
        fontSize: 14,
        color: '#555',
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
    deleteButton: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        width: 75,
        height: '100%',
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default PickLineup;
