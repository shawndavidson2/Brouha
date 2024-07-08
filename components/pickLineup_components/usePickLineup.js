import { useEffect, useState, useMemo } from 'react';
import { useGlobalContext } from '../../context/GlobalProvider';
import { getUserWeeklyLineup, updatePickAttributes } from '../../lib/appwrite';
import UpdatePoints from '../../components/updatePoints';
import { FontAwesome } from '@expo/vector-icons';

const usePickLineup = () => {
    const { user, setUser, league, setLeague, weekNum } = useGlobalContext();
    const [cycleWeekNum, setCycleWeekNum] = useState(weekNum);
    const [picks, setPicks] = useState([]);
    const [lineupCache, setLineupCache] = useState({}); // Cache to store lineups

    const fetchLineup = async (week) => {
        if (!lineupCache[week]) {
            try {
                const lineup = await getUserWeeklyLineup(week);
                setLineupCache((prevCache) => ({
                    ...prevCache,
                    [week]: lineup.picks,
                }));
                setPicks(lineup.picks);
            } catch (error) {
                console.error(error);
            }
        } else {
            setPicks(lineupCache[week]);
        }
    };

    useEffect(() => {
        fetchLineup(cycleWeekNum);
    }, [cycleWeekNum]);

    const totalPointsEarned = useMemo(() => {
        return picks.reduce((total, pick) => {
            if (pick.status === 'won') {
                return total + pick["potential-points"];
            }
            return total;
        }, 0);
    }, [picks]);

    useEffect(() => {
        let pointsWon = 0;
        let hasStatusChangedToWon = false;

        picks.forEach((pick) => {
            if (cycleWeekNum === weekNum && !pick.processed && pick.status === 'won') {
                hasStatusChangedToWon = true;
                pointsWon += pick["potential-points"];
                pick.processed = true;
                updatePickAttributes(pick.$id, { processed: true });
            }
        });

        if (hasStatusChangedToWon) {
            UpdatePoints(pointsWon, user, setUser, league, setLeague);
        }
    }, [picks, user, setUser, league, setLeague, cycleWeekNum]);

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
            const maxWeeks = user["weekly-lineup"] ? user["weekly-lineup"].length - 1 : 0;
            return Math.min(prevWeek + 1, maxWeeks);
        });
    };

    return {
        cycleWeekNum,
        picks,
        totalPointsEarned,
        renderStatusIcon,
        goToPreviousWeek,
        goToNextWeek,
        fetchLineup, // Ensure fetchLineup is returned
    };
};

export default usePickLineup;
