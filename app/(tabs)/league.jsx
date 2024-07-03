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
    const [leagueTitle, setLeagueTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [sortedContributors, setSortedContributors] = useState([]);
    const [sortedParticipants, setSortedParticipants] = useState([]);

    useEffect(() => {
        const fetchUserLeague = async () => {
            try {
                const currentUser = await getCurrentUser();
                console.log(currentUser.league.name)
                setLeagueTitle(currentUser.league.name);
            } catch (error) {
                console.error(error);
                setLeagueTitle('Error fetching league');
            } finally {
                setLoading(false);
            }
        };

        fetchUserLeague();
    }, []);

    const profile = () => {
        router.push("../profile");
    };

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

    return (
        <SafeAreaView className="bg-red-100 h-full">
            <FlatList
                ListHeaderComponent={() => (
                    <>
                        <LeagueTitleAndProfile profile={profile} leagueTitle={leagueTitle} />
                        <LeagueStats />
                        <LeagueParticipants sortedContributors={sortedContributors} sortedParticipants={sortedParticipants} />
                    </>
                )}
            />

            <JoinLeagueButton joinLeague={joinLeague} />
        </SafeAreaView>
    );
};

export default League;
