import { useEffect, useState, useMemo } from 'react';
import { useGlobalContext } from '../../context/GlobalProvider';
import { updatePickAttributes } from '../../lib/appwrite';
import { FontAwesome } from '@expo/vector-icons';
import { useLineupCache } from '../../context/lineupContext';
import { removePickFromWeeklyLineup, getAllWeeklyLineups, getPicksByIds } from '../../lib/appwrite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const usePickLineup = (initialWeekNum = 0, userId = null) => {
    const { user, setUser, league, setLeague, weekNum, refreshPicks, setRefreshPicks } = useGlobalContext();
    const [cycleWeekNum, setCycleWeekNum] = useState(initialWeekNum);
    const lineupCache = useLineupCache();
    const [totalPotentialPoints, setTotalPotentialPoints] = useState(0);
    const [picks, setPicks] = useState([]); // Initialize state for picks
    const [picksLoaded, setPicksLoaded] = useState(false)

    // Function to fetch lineups if needed
    const fetchLineups = async () => {
        try {
            // Fetch all weekly lineups
            const allLineups = await getAllWeeklyLineups(userId);

            if (allLineups) {
                const lineupsWithPicks = [];

                // Iterate over each lineup and fetch the picks
                for (const lineup of allLineups) {
                    const picks = await getPicksByIds(lineup.picks);
                    lineupsWithPicks.push({
                        weekNumber: lineup.weekNumber,
                        picks,
                    });
                }
                return lineupsWithPicks;
            } else {
                console.log("No lineups available");
                return [];
            }
        } catch (error) {
            console.error('Failed to fetch all weekly lineups:', error);
            return [];
        }
    };

    // Effect to load picks depending on the user
    useEffect(() => {
        const loadPicks = async () => {
            if (userId === user.$id) {
                // If the user matches, load picks from cache
                const cachedPicks = lineupCache[cycleWeekNum] || [];
                setPicks(cachedPicks);
            } else {
                // Fetch picks from the server for the specific user
                const fetchedLineups = await fetchLineups();
                const currentWeekLineup = fetchedLineups.find(lineup => lineup.weekNumber === cycleWeekNum);
                setPicks(currentWeekLineup ? currentWeekLineup.picks : []);
            }
            setPicksLoaded(true);
        };

        loadPicks();
    }, [cycleWeekNum, userId, user, lineupCache]);

    const totalPointsEarned = useMemo(() => {
        return picks.reduce((total, pick) => {
            if (pick.status === 'won') {
                return total + pick["potential-points"];
            }
            return total;
        }, 0);
    }, [picks]);

    useEffect(() => {
        setTotalPotentialPoints(picks.reduce((total, pick) => total + pick["potential-points"], 0));
    }, [picks, totalPointsEarned, refreshPicks]);

    const renderStatusIcon = (status) => {
        if (status === 'won') {
            return <FontAwesome name="check-circle" size={24} color="green" />;
        } else if (status === 'lost') {
            return <FontAwesome name="times-circle" size={24} color="red" />;
        } else {
            return <FontAwesome name="circle-o" size={24} color="black" />;
        }
    };

    const goToPreviousWeek = () => {
        setCycleWeekNum(prevWeek => Math.max(prevWeek - 1, 1));
    };

    const goToNextWeek = () => {
        setCycleWeekNum(prevWeek => {
            return Math.min(prevWeek + 1, weekNum);
        });
    };

    const deletePickFromPL = async (pick, pickId, sheetName, date, swiped = true) => {
        try {
            // Update the lineup cache by removing the pick
            const updatedPicks = lineupCache[weekNum].filter(pick => pick.$id !== pickId);
            lineupCache[weekNum] = updatedPicks;

            // Update the AsyncStorage to reflect the changes in selected picks
            const storedPicks = await AsyncStorage.getItem(`selectedPicks_${user.$id}_${sheetName}_${date}`);
            const selectedPicks = storedPicks ? JSON.parse(storedPicks) : {};

            const newSelectedPicks = {};
            for (const key in selectedPicks) {
                if (selectedPicks[key] !== pickId) {
                    newSelectedPicks[key] = selectedPicks[key];
                }
            }

            await AsyncStorage.setItem(`selectedPicks_${user.$id}_${sheetName}_${date}`, JSON.stringify(newSelectedPicks));
            if (swiped) router.replace('./pick-lineup');
            setRefreshPicks(true);
            await removePickFromWeeklyLineup(pickId, user.$id, weekNum, pick["potential-points"]);

        } catch (error) {
            console.error('Error deleting pick:', error);
        }
    };

    return {
        cycleWeekNum,
        picks,
        totalPointsEarned,
        totalPotentialPoints,
        renderStatusIcon,
        goToPreviousWeek,
        goToNextWeek,
        deletePickFromPL,
        picksLoaded,
    };
};

export default usePickLineup;
