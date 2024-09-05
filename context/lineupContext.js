import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAllWeeklyLineups, getPicksByIds } from '../lib/appwrite';
import { useGlobalContext } from './GlobalProvider';
import Loading from '../components/Loading';

const LineupContext = createContext();

export const LineupProvider = ({ children }) => {
    const [lineupCache, setLineupCache] = useState({});
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState(null);

    const { user, weekNum } = useGlobalContext();

    useEffect(() => {
        const fetchLineupsIfNeeded = async () => {
            setIsInitialized(false)
            console.log("FETCHING LINEUPS")
            if (lineupCache[weekNum]) {
                setIsInitialized(true);
                return; // Data for this week already cached, no need to fetch again
            }

            try {
                if (user) {
                    const allLineups = await getAllWeeklyLineups(user.$id);
                    if (allLineups) {
                        const newCache = { ...lineupCache };
                        for (const lineup of allLineups) {
                            if (!newCache[lineup.weekNumber]) {
                                //if (lineup.picks.length === 0) return
                                const picks = await getPicksByIds(lineup.picks);
                                newCache[lineup.weekNumber] = picks;
                            }
                        }

                        setLineupCache(newCache);
                    } else {
                        console.log("no lineups")
                    }
                }
            } catch (error) {
                console.error('Failed to fetch all weekly lineups:', error);
                setError(error);
            } finally {
                setIsInitialized(true);
            }
        };

        fetchLineupsIfNeeded();
    }, [user]);


    return (
        <LineupContext.Provider value={lineupCache}>
            {children}
        </LineupContext.Provider>
    );
};

export const useLineupCache = () => useContext(LineupContext);
