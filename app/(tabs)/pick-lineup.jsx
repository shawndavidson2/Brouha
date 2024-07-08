import React, { useEffect, useState, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Import icon library
import { SafeAreaView } from 'react-native-safe-area-context';
import UpdatePoints from '../../components/updatePoints';
import { useGlobalContext } from '../../context/GlobalProvider';
import { createWeeklyLineup, getUserWeeklyLineup, updatePickAttributes } from '../../lib/appwrite';

const PickLineup = () => {
    const { user, setUser, league, setLeague, weekNum } = useGlobalContext();

    const [picks, setPicks] = useState([]);

    useEffect(() => {
        //console.log(createWeeklyLineup(0, 10, 20, 30));
        getUserWeeklyLineup(weekNum)
            .then((lineup) => {
                setPicks(lineup.picks)
            })
            .catch((error) => {
                console.error(error);
            });

    }, []);


    const totalPointsEarned = useMemo(() => {
        return picks.reduce((total, pick) => {
            if (pick.status === 'won') {
                return total + pick[["potential-points"]];
            }
            return total;
        }, 0);
    }, [picks]);

    useEffect(() => {
        let pointsWon = 0;
        let hasStatusChangedToWon = false;

        picks.forEach((pick) => {
            if (!pick.processed && pick.status === 'won') {
                hasStatusChangedToWon = true;
                pointsWon += pick["potential-points"];
                pick.processed = true;
                updatePickAttributes(pick.$id, { processed: true })
            }
        });
        if (hasStatusChangedToWon) {
            UpdatePoints(pointsWon, user, setUser, league, setLeague);
        }
    }, [picks]);

    const renderStatusIcon = (status) => {
        if (status === 'won') {
            return <FontAwesome name="check-circle" size={24} color="green" />;
        } else if (status === 'lost') {
            return <FontAwesome name="times-circle" size={24} color="red" />;
        } else {
            return <FontAwesome name="circle-o" size={24} color="black" />;
        }
    };

    return (
        <SafeAreaView className="bg-red-100 h-full">
            <View style={styles.container}>
                <Text style={styles.header}>My Pick - Lineup</Text>
                <Text style={styles.subHeader}>Week 0</Text>
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
        </SafeAreaView>
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
    subHeader: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
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
    pointsContainer: {
        flex: 1,
        alignItems: 'center',
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
