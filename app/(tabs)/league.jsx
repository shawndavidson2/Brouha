import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { icons } from '../../constants';

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
                    <View style={{ width: '100%', paddingVertical: 20, alignItems: 'center' }}>
                        <View style={{ position: 'absolute', top: 10, right: 40, alignItems: 'center' }}>
                            <TouchableOpacity onPress={profile}>
                                <Image
                                    source={icons.profile}
                                    resizeMode="contain"
                                    style={{ width: 40, height: 40 }}
                                />
                                <Text className="mt-2">Profile</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>League Title</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 50 }}>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>League Rank</Text>
                                <Text style={{ fontSize: 26, marginTop: 5 }}>5</Text>
                            </View>
                            <View style={{ borderLeftWidth: 1, borderLeftColor: 'black', height: '100%', marginHorizontal: 10 }} />
                            <View style={{ alignItems: 'center' }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Week 4 Points</Text>
                                <Text style={{ fontSize: 26, marginTop: 5 }}>12,460</Text>
                            </View>
                            <View style={{ borderLeftWidth: 1, borderLeftColor: 'black', height: '100%', marginHorizontal: 10 }} />
                            <View style={{ alignItems: 'center' }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Total Points</Text>
                                <Text style={{ fontSize: 26, marginTop: 5 }}>48,250</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%', marginTop: 30 }}>
                            <View>
                                <Text>League Contributors</Text>
                                {sortedContributors.map((contributor, index) => (
                                    <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                        <Text style={{ fontSize: 16 }}>{index + 1}. {contributor.username}</Text>
                                    </View>
                                ))}
                                <Text className="mt-10">League Participants</Text>
                                {sortedParticipants.map((participant, index) => (
                                    <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                        <Text style={{ fontSize: 16 }}>{index + 1}. {participant.username}</Text>
                                    </View>
                                ))}
                            </View>
                            <View>
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Points</Text>
                                {sortedContributors.map((contributor, index) => (
                                    <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                        <Text style={{ fontSize: 16 }}>{contributor.points}</Text>
                                    </View>
                                ))}
                                <View className="mt-14">
                                    {sortedParticipants.map((participant, index) => (
                                        <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                            <Text style={{ fontSize: 16 }}>{participant.points}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </View>
                    </View>
                )}
            />

            <View style={{ position: 'absolute', bottom: 20, right: 20, alignItems: 'center' }}>
                <TouchableOpacity onPress={joinLeague}>
                    <Image
                        className="w-[40] h-[40] flex items-center ml-5 mb-3"
                        source={icons.plus}
                        resizeMode="contain"
                    />
                    <Text>Join a League</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

export default League;
