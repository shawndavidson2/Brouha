import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUser, checkAndUpdateWeekNum, resetWeek, checkOrCreateWeeklyLineup, getAllUsersForLeaderboard, getAllLeaguesForLeaderboard, updateLeagueAttributes } from "../lib/appwrite";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
    const [weekNum, setWeekNum] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [league, setLeague] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const [refreshPicks, setRefreshPicks] = useState(false);
    const [users, setUsers] = useState();
    const [leagues, setLeagues] = useState();
    const [leaderboardLoading, setLeaderboardLoading] = useState(true);

    useEffect(() => {
        const initialize = async () => {
            setIsLoading(true);
            try {
                const currentUser = await getCurrentUser();
                if (currentUser) {
                    setIsLoggedIn(true);
                    setUser(currentUser);
                    const currentLeague = await currentUser.league;
                    if (currentLeague) {
                        setLeague(currentLeague);
                    }
                } else {
                    setIsLoggedIn(false);
                    setUser(null);
                }
                return currentUser;
            } catch (error) {
                console.log(error);
            } finally {
                setIsInitialized(true);
            }
        };

        const updateWeekNum = async () => {
            // Hardcoded start date for Week 1 (September 3, 2024 at midnight)
            const startWeek1 = new Date('2024-09-03T00:00:00');
            const currentDate = new Date();
            const millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
            const weeksSinceStart = Math.floor((currentDate - startWeek1) / millisecondsPerWeek);
            let currentWeekNum = 1 + weeksSinceStart;
            if (currentWeekNum < 1) currentWeekNum = 1;

            console.log('Current Week Number:', currentWeekNum);
            setWeekNum(currentWeekNum);

            const needsWeekClearing = await checkAndUpdateWeekNum(currentWeekNum);
            if (needsWeekClearing) {
                //await resetWeek(currentWeekNum);
            }
            return currentWeekNum;
        };

        const getLeaderboardData = async (week) => {
            setIsLoading(false);

            // Fetch leagues and users in parallel
            const [leagues, users] = await Promise.all([getAllLeaguesForLeaderboard(), getAllUsersForLeaderboard()]);

            // Sort leagues by 'cumulative-total-points'
            const sortedLeagues = leagues.sort((a, b) => b['cumulative-total-points'] - a['cumulative-total-points']);

            // Assign ranks based on points
            let rank = 1;
            const leaguesToUpdate = [];

            sortedLeagues.forEach((league, index) => {
                if (index > 0 && sortedLeagues[index]['cumulative-total-points'] === sortedLeagues[index - 1]['cumulative-total-points']) {
                    league.rank = sortedLeagues[index - 1].rank; // Same rank as previous league
                } else {
                    league.rank = rank;
                }

                // Only update the league if its rank has changed
                if (league.rank !== sortedLeagues[index].rank) {
                    leaguesToUpdate.push({
                        id: league.id,
                        rank: league.rank
                    });
                }

                rank++;
            });

            // Batch update the leagues' ranks to reduce the number of database calls
            if (leaguesToUpdate.length > 0) {
                await updateLeaguesBatch(leaguesToUpdate); // Assume this function updates leagues in bulk
            }

            setLeagues(sortedLeagues);
            setUsers(users);

            setLeaderboardLoading(false);
        };


        initialize().then((user) => {
            updateWeekNum().then((week) => {
                getLeaderboardData(week);
            });
        });

    }, []);

    return (
        <GlobalContext.Provider
            value={{
                isLoggedIn,
                setIsLoggedIn,
                user,
                setUser,
                league,
                setLeague,
                isLoading,
                weekNum,
                isInitialized,
                refreshPicks,
                setRefreshPicks,
                users,
                leagues,
                leaderboardLoading
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;
