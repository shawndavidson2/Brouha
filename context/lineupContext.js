import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAllWeeklyLineups } from '../lib/appwrite';
import { useGlobalContext } from './GlobalProvider';
import styles from '../app/styles';
import Loading from '../components/Loading';

const LineupContext = createContext();

export const LineupProvider = ({ children }) => {
    const [lineupCache, setLineupCache] = useState({});
    const [isInitialized, setIsInitialized] = useState(false);

    const { weekNum } = useGlobalContext();

    useEffect(() => {
        const fetchAllLineups = async () => {
            try {
                const allLineups = await getAllWeeklyLineups();
                if (allLineups) {
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
                }
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
            <Loading />
        );
    } else {
        return (
            <LineupContext.Provider value={lineupCache}>
                {children}
            </LineupContext.Provider>
        );
    }
};

export const useLineupCache = () => useContext(LineupContext);
