import { useEffect, useState, useMemo } from 'react';
import { useGlobalContext } from '../../context/GlobalProvider';
import { updatePickAttributes } from '../../lib/appwrite';
import { FontAwesome } from '@expo/vector-icons';
import { useLineupCache } from '../../context/lineupContext';

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
    const deletePick = (pickId) => {
        // Logic to delete the pick from the state or backend
    };


    return {
        cycleWeekNum,
        picks,
        totalPointsEarned,
        totalPotentialPoints,
        renderStatusIcon,
        goToPreviousWeek,
        goToNextWeek,
        deletePick,
    };
};

export default usePickLineup;
