import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAllWeeklyLineups } from '../lib/appwrite';

const LineupContext = createContext();

export const LineupProvider = ({ children }) => {
    const [lineupCache, setLineupCache] = useState({});

    useEffect(() => {
        const fetchAllLineups = async () => {
            try {
                const allLineups = await getAllWeeklyLineups();
                const lineupCache = allLineups.reduce((acc, lineup) => {
                    acc[lineup.weekNumber] = lineup.picks;
                    return acc;
                }, {});
                setLineupCache(lineupCache);
            } catch (error) {
                console.error('Failed to fetch all weekly lineups:', error);
            }
        };

        fetchAllLineups();
    }, []);

    return (
        <LineupContext.Provider value={lineupCache}>
            {children}
        </LineupContext.Provider>
    );
};

export const useLineupCache = () => useContext(LineupContext);
