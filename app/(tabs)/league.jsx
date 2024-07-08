import { View, Text, TouchableOpacity, Image, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { icons } from '../../constants';
import LeagueParticipants from '../../components/league_components/LeagueParticipants';
import LeagueStats from '../../components/league_components/LeagueStats';
import LeagueTitleAndProfile from '../../components/league_components/LeagueTitleAndProfile';
import JoinLeagueButton from '../../components/league_components/JoinLeagueButton';
import { getCurrentUser, appwriteConfig, databases } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';

const League = () => {
    const [loading, setLoading] = useState(true);

    const { user, league, setLeague, weekNum } = useGlobalContext();

    const joinLeague = () => {
        router.push("../join-league");
    };

    useEffect(() => {
    }, [user, league]);

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        //await refetch();
        setRefreshing(false);
    };


    if (league) {
        return (
            <SafeAreaView className="bg-red-100 h-full">
                <FlatList
                    ListHeaderComponent={() => (
                        <>
                            <LeagueTitleAndProfile currentUser={user} leagueTitle={league.name} weekNum={weekNum} />
                            <LeagueStats rank={league.rank} weekPoints={league["weekly-total-points"]} totalPoints={league["cumulative-total-points"]} weekNum={weekNum} />
                            <LeagueParticipants leagueMembers={league.users} />
                        </>

                    )}

                />

                <JoinLeagueButton joinLeague={joinLeague} />
            </SafeAreaView>
        );
    } else {
        return (
            <SafeAreaView className="bg-red-100 h-full">
                <FlatList
                    ListHeaderComponent={() => (
                        <>
                            <LeagueTitleAndProfile currentUser={user} leagueTitle={"NO LEAGUE YET"} weekNum={weekNum} />
                        </>
                    )}
                />
                <JoinLeagueButton joinLeague={joinLeague} />
            </SafeAreaView>
        );
    }
};

export default League;
