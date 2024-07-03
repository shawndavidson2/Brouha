import { View, Text, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { icons } from '../../constants';
import LeagueParticipants from '../../components/league_components/LeagueParticipants';
import LeagueStats from '../../components/league_components/LeagueStats';
import LeagueTitleAndProfile from '../../components/league_components/LeagueTitleAndProfile';
import JoinLeagueButton from '../../components/league_components/JoinLeagueButton';
import { getCurrentUser, appwriteConfig, databases } from '../../lib/appwrite';

const League = () => {
    const [league, setLeague] = useState();
    const [currentUser, setCurrentUser] = useState();
    const [leagueMembers, setLeagueMembers] = useState([]);
    const [sortedParticipants, setSortedParticipants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserLeague = async () => {
            try {
                const currentUser = await getCurrentUser();
                setCurrentUser(currentUser);
                if (currentUser.league) {
                    setLeague(currentUser.league);
                    setLeagueMembers(currentUser.league.users)
                }
            } catch (error) {
                console.error(error);
                setLeagueTitle('Error fetching league');
            } finally {
                setLoading(false);
            }
        };

        fetchUserLeague();
    }, []);

    const joinLeague = () => {
        router.push("../join-league");
    };

    if (loading) {
        return (
            <SafeAreaView className="bg-red-100 h-full justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        );
    }

    if (league) {
        return (
            <SafeAreaView className="bg-red-100 h-full">
                <FlatList
                    ListHeaderComponent={() => (
                        <>
                            <LeagueTitleAndProfile currentUser={currentUser} leagueTitle={league.name} />
                            <LeagueStats rank={league.rank} weekPoints={league["weekly-total-points"]} totalPoints={league["cumulative-total-points"]} />
                            <LeagueParticipants sortedContributors={leagueMembers} sortedParticipants={sortedParticipants} />
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
                            <LeagueTitleAndProfile currentUser={currentUser} leagueTitle={"NO LEAGUE YET"} />
                        </>
                    )}
                />
                <JoinLeagueButton joinLeague={joinLeague} />
            </SafeAreaView>
        );
    }
};

export default League;
