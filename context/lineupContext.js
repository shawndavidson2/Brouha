import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAllWeeklyLineups, getPicksByIds } from '../lib/appwrite';
import { useGlobalContext } from './GlobalProvider';
import Loading from '../components/Loading';

const LineupContext = createContext();

export const LineupProvider = ({ children }) => {
    const [lineupCache, setLineupCache] = useState({});
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState(null);

    const { weekNum } = useGlobalContext();

    useEffect(() => {
        const fetchLineupsIfNeeded = async () => {
            console.log("FETCHING LINEUPS")
            if (lineupCache[weekNum]) {
                setIsInitialized(true);
                return; // Data for this week already cached, no need to fetch again
            }

            try {
                const allLineups = await getAllWeeklyLineups();
                if (allLineups) {
                    const newCache = { ...lineupCache };

                    for (const lineup of allLineups) {
                        if (!newCache[lineup.weekNumber]) {
                            const picks = await getPicksByIds(lineup.picks);
                            newCache[lineup.weekNumber] = picks;
                        }
                    }

                    setLineupCache(newCache);
                } else {
                    console.log("no lineups")
                }
            } catch (error) {
                console.error('Failed to fetch all weekly lineups:', error);
                setError(error);
            } finally {
                setIsInitialized(true);
            }
        };

        fetchLineupsIfNeeded();
    }, [weekNum]);

    if (!isInitialized) {
        return <Loading />;
    }

    return (
        <LineupContext.Provider value={lineupCache}>
            {children}
        </LineupContext.Provider>
    );
};

export const useLineupCache = () => useContext(LineupContext);
