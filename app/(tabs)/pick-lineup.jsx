import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler'; // Import GestureHandlerRootView
import usePickLineup from '../../components/pick-lineup/usePickLineup';
import { FontAwesome } from '@expo/vector-icons'; // Import icon library
import { useGlobalContext } from '../../context/GlobalProvider';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const PickLineup = () => {
    const { weekNum, refreshPicks, setRefreshPicks } = useGlobalContext();
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

    useEffect(() => {
        if (refreshPicks) {
            // Re-fetch or update your picks here

            // After refreshing, reset the flag
            setRefreshPicks(false);
        }
    }, [refreshPicks]);


    const renderRightActions = (pick, progress, dragX, onDelete) => {
        if (cycleWeekNum === weekNum && pick.status === "pending") {
            return (
                <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
                    <Text style={styles.deleteButtonText}>Remove from PL</Text>
                </TouchableOpacity>
            );
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={styles.safeArea}>
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
                                    renderRightActions(pick, progress, dragX, () => deletePickFromPL(pick, pick.$id, pick.game))
                                }
                            >
                                <View style={styles.pickItem}>
                                    <View style={styles.pickDetails}>
                                        <Text style={styles.pickText}>{pick["pick-title"]}</Text>
                                        <Text style={styles.gameText}>{pick.game}</Text>
                                        <Text style={styles.gameText}>{pick.date} {pick.time}</Text>
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
                <StatusBar style="light" />
            </SafeAreaView>
        </GestureHandlerRootView>
    );
};

export default PickLineup;
