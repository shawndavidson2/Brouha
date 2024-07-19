import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUser, getCurrentLeague } from "../lib/appwrite";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
    const [weekNum, setWeekNum] = useState(3);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [league, setLeague] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const initialize = async () => {
            try {
                const currentUser = await getCurrentUser();
                if (currentUser) {
                    setIsLoggedIn(true);
                    setUser(currentUser);
                    const currentLeague = await getCurrentLeague();
                    if (currentLeague) {
                        setLeague(currentLeague);
                    }
                } else {
                    setIsLoggedIn(false);
                    setUser(null);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
                setIsInitialized(true);
            }
        };

        const updateWeekNum = async () => {
            try {
                const lastUpdatedDate = await AsyncStorage.getItem("lastUpdatedDate");
                const currentDate = new Date();
                const lastDate = lastUpdatedDate ? new Date(lastUpdatedDate) : null;

                if (lastDate) {
                    const diffTime = Math.abs(currentDate - lastDate);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    if (diffDays >= 7) {
                        const weeksToAdd = Math.floor(diffDays / 7);
                        setWeekNum(prevWeekNum => prevWeekNum + weeksToAdd);
                        await AsyncStorage.setItem("lastUpdatedDate", currentDate.toISOString());
                    }
                } else {
                    await AsyncStorage.setItem("lastUpdatedDate", currentDate.toISOString());
                }
            } catch (error) {
                console.log(error);
            }
        };

        updateWeekNum();
        initialize();
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
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;
