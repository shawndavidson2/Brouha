import { useEffect, useState, useMemo } from 'react';
import { useGlobalContext } from '../../context/GlobalProvider';
import { updatePickAttributes } from '../../lib/appwrite';
import { FontAwesome } from '@expo/vector-icons';
import { useLineupCache } from '../../context/lineupContext';
import { deletePick } from '../../lib/appwrite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const usePickLineup = (initialWeekNum = 0) => {
    const { user, setUser, league, setLeague, weekNum } = useGlobalContext();
    const [cycleWeekNum, setCycleWeekNum] = useState(initialWeekNum);
    const lineupCache = useLineupCache();
    const [totalPotentialPoints, setTotalPotentialPoints] = useState(0);

    const picks = lineupCache[cycleWeekNum] || [];


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
    }, [picks, totalPointsEarned]);

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
        setCycleWeekNum(prevWeek => Math.max(prevWeek - 1, 0));
    };

    const goToNextWeek = () => {
        setCycleWeekNum(prevWeek => {
            //const maxWeeks = user["weekly-lineup"] ? user["weekly-lineup"].length - 1 : 0;
            return Math.min(prevWeek + 1, weekNum);
        });
    };
    const deletePickFromPL = async (pickId) => {
        try {
            // Update the lineup cache by removing the pick
            const updatedPicks = lineupCache[weekNum].filter(pick => pick.$id !== pickId);
            lineupCache[weekNum] = updatedPicks;

            // Update the AsyncStorage to reflect the changes in selected picks
            const storedPicks = await AsyncStorage.getItem('selectedPicks');
            const selectedPicks = storedPicks ? JSON.parse(storedPicks) : {};

            const newSelectedPicks = {};
            for (const key in selectedPicks) {
                if (selectedPicks[key] !== pickId) {
                    newSelectedPicks[key] = selectedPicks[key];
                }
            }

            await AsyncStorage.setItem('selectedPicks', JSON.stringify(newSelectedPicks));
            router.replace('./pick-lineup')
            await deletePick(pickId);

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
    };
};

export default usePickLineup;