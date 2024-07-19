import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAllWeeklyLineups } from '../lib/appwrite';
import { useGlobalContext } from './GlobalProvider';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const LineupContext = createContext();

export const LineupProvider = ({ children }) => {
    const [lineupCache, setLineupCache] = useState({});
    const [isInitialized, setIsInitialized] = useState(false);

    const { weekNum } = useGlobalContext();

    useEffect(() => {
        const fetchAllLineups = async () => {
            try {
                const allLineups = await getAllWeeklyLineups();
                const lineupCache = allLineups.reduce((acc, lineup) => {
                    acc[lineup.weekNumber] = lineup.picks;

                    // Calculate total points earned
                    if (lineup.weekNumber === weekNum) {
                        const points = lineup.picks.reduce((sum, pick) => {
                            return pick.status === "won" ? sum + pick["potential-points"] : sum;
                        }, 0);
                        // setWeeklyPoints(points);
                    }

                    return acc;
                }, {});
                setLineupCache(lineupCache);
            } catch (error) {
                console.error('Failed to fetch all weekly lineups:', error);
            } finally {
                setIsInitialized(true);
            }
        };

        fetchAllLineups();
    }, [weekNum]);

    if (!isInitialized) {
        return (
            <SafeAreaView className="bg-green-100 h-full flex justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        );
    } else {
        return (
            <LineupContext.Provider value={lineupCache}>
                {children}
            </LineupContext.Provider>
        );
    }
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
});

export const useLineupCache = () => useContext(LineupContext);
