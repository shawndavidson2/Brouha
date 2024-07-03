import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { icons } from '../../constants';
import LeagueParticipants from '../../components/league_components/LeagueParticipants';
import LeagueStats from '../../components/league_components/LeagueStats';
import LeagueTitleAndProfile from '../../components/league_components/LeagueTitleAndProfile';
import JoinLeagueButton from '../../components/league_components/JoinLeagueButton';

const League = () => {
    const profile = async () => {
        router.push("../profile");
    };
    const joinLeague = async () => {
        router.push("../join-league");
    };

    const contributors = [
        { username: 'User1', points: 500 },
        { username: 'User2', points: 300 },
        { username: 'User3', points: 700 }
    ];

    const participants = [
        { username: 'Participant1', points: 600 },
        { username: 'Participant2', points: 200 },
        { username: 'Participant3', points: 800 }
    ];

    const sortedContributors = contributors.sort((a, b) => b.points - a.points);
    const sortedParticipants = participants.sort((a, b) => b.points - a.points);

    return (
        <SafeAreaView className="bg-red-100 h-full">
            <FlatList
                ListHeaderComponent={() => (
                    <>
                        <LeagueTitleAndProfile profile={profile} leagueTitle={"League Title"} />
                        <LeagueStats />
                        <LeagueParticipants sortedContributors={sortedContributors} sortedParticipants={sortedParticipants} />
                    </>
                )}
            />

            <JoinLeagueButton joinLeague={joinLeague} />
        </SafeAreaView>
    );
}

export default League;
