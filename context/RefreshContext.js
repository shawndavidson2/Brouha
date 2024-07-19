import React, { createContext, useContext, useState } from 'react';

const RefreshContext = createContext();

export const RefreshProvider = ({ children }) => {
    const [refreshKey, setRefreshKey] = useState(0);
    const [refreshing, setRefreshing] = useState(false);

    const triggerRefresh = async (refreshFunc) => {
        setRefreshing(true);
        if (refreshFunc) {
            await refreshFunc();
        }
        setRefreshing(false);
        setRefreshKey(prevKey => prevKey + 1);
    };

    return (
        <RefreshContext.Provider value={{ refreshing, refreshKey, triggerRefresh }}>
            {children}
        </RefreshContext.Provider>
    );
};

export const useRefresh = () => useContext(RefreshContext);
