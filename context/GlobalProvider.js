import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, getCurrentLeague } from "../lib/appwrite";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
    const [weekNum, setWeekNum] = useState(3);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [league, setLeague] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getCurrentUser()
            .then((res) => {
                if (res) {
                    setIsLoggedIn(true);
                    setUser(res);
                } else {
                    setIsLoggedIn(false);
                    setUser(null);
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setIsLoading(false);
            })
        getCurrentLeague()
            .then((res) => {
                if (res) {
                    setLeague(res);
                } else {
                    setLeague(null);
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setIsLoading(false);
            })
    }, [])

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
                weekNum
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider;