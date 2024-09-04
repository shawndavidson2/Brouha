import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUser, checkAndUpdateWeekNum, resetWeek, checkOrCreateWeeklyLineup, getAllUsersForLeaderboard, getAllLeaguesForLeaderboard } from "../lib/appwrite";

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
                //setIsLoading(false);
                setIsInitialized(true);
            }
        };

        const updateWeekNum = async () => {

            // Hardcoded start date for Week 1 (September 3, 2024 at midnight)
            const startWeek1 = new Date('2024-09-03T00:00:00');

            // Get the current date and time
            const currentDate = new Date();

            // Calculate the number of weeks since the start of Week 1
            const millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
            const weeksSinceStart = Math.floor((currentDate - startWeek1) / millisecondsPerWeek);

            // Calculate the current week number
            let currentWeekNum = 1 + weeksSinceStart;
            if (currentWeekNum < 1) currentWeekNum = 1;

            console.log('Current Week Number:', currentWeekNum);
            setWeekNum(currentWeekNum)

            const needsWeekClearing = await checkAndUpdateWeekNum(currentWeekNum)
            if (needsWeekClearing) {
                //await resetWeek(currentWeekNum);
            }
            console.log(currentWeekNum)
            return currentWeekNum;

        };

        const getLeaderboardData = async (week) => {

            setIsLoading(false);

            const leagues = await getAllLeaguesForLeaderboard();
            setLeagues(leagues);

            const users = await getAllUsersForLeaderboard();
            setUsers(users);

            setLeaderboardLoading(false);
        };

        initialize().then((user) => { updateWeekNum().then((week) => { getLeaderboardData(week) }) })

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
