import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUser, checkAndUpdateWeekNum, resetWeek, checkOrCreateWeeklyLineup, getAllUsersForLeaderboard, getAllLeaguesForLeaderboard, updateLeagueAttributes } from "../lib/appwrite";
import Loading from "../components/Loading";

import Constants from 'expo-constants';

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
            const appVersion = Constants.expoConfig?.version || 'Unknown Version';  // Safely access version or provide fallback
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
            // Hardcoded start date for Week 1 (September 4, 2024 at 8 PM EDT)
            const startWeek1 = new Date('2024-09-04T20:00:00-04:00');  // 8 PM EDT
            const currentDate = new Date();
            const millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
            const weeksSinceStart = Math.floor((currentDate - startWeek1) / millisecondsPerWeek);
            let currentWeekNum = 1 + weeksSinceStart;
            if (currentWeekNum < 1) currentWeekNum = 1;

            console.log('Current Week Number:', currentWeekNum);
            setWeekNum(currentWeekNum);

            //const needsWeekClearing = await checkAndUpdateWeekNum(currentWeekNum);
            return currentWeekNum;
        };

        const getLeaderboardData = async (week) => {
            setIsLoading(false); // Set loading to true when starting

            try {
                // Fetch leagues and users in parallel
                const [leagues, users] = await Promise.all([getAllLeaguesForLeaderboard(), getAllUsersForLeaderboard()]);

                // Sort leagues by 'cumulative-total-points'
                const sortedLeagues = leagues.sort((a, b) => b['cumulative-total-points'] - a['cumulative-total-points']);

                // Assign ranks based on points and update leagues in parallel
                let rank = 1;
                const leaguesToUpdate = sortedLeagues.map((league, index) => {
                    if (index > 0 && sortedLeagues[index]['cumulative-total-points'] === sortedLeagues[index - 1]['cumulative-total-points']) {
                        league.rank = sortedLeagues[index - 1].rank; // Same rank as previous league
                    } else {
                        league.rank = rank;
                    }

                    rank++;

                    // Update the league if its rank has changed
                    return updateLeagueAttributes(league, { rank: league.rank });
                });

                // Wait for all league updates to finish
                //await Promise.all(leaguesToUpdate);

                // Update state with the sorted leagues and users
                setLeagues(sortedLeagues);
                setUsers(users);

            } catch (error) {
                console.error("Error fetching leaderboard data: ", error);
            } finally {
                setLeaderboardLoading(false); // Stop loading when done

            }
        };


        initialize().then((user) => {
            updateWeekNum().then((week) => {
                getLeaderboardData(week);
            });
        });

    }, []);

    if (isLoading) {
        return <Loading />;
    }

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
