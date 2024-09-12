import { View, Text, Image } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar'; // Import StatusBar
import { icons } from '../../constants';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import { useState } from 'react'; // Import useState

const TabIcon = ({ icon, color, name, focused }) => {
    return (
        <View className="items-center justify-center gap-2">
            <Image
                source={icon}
                resizeMode="contain"
                tintColor={color}
                className="w-6 h-6"
            />
            <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`} style={{ color }}> {name}</Text>
        </View>
    );
};

const TabsLayout = () => {
    const [isLeagueTabFocused, setIsLeagueTabFocused] = useState(false);
    const [isNotLeagueTabFocused, setIsNotLeagueTabFocused] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            setIsLeagueTabFocused(true);
            return () => setIsLeagueTabFocused(false); // Reset when tab loses focus
        }, [])
    );

    return (
        <View style={{ flex: 1, backgroundColor: "#343434" }}>
            {/* Render StatusBar only when League tab is focused */}
            {isLeagueTabFocused && <StatusBar style="dark" />}
            {isNotLeagueTabFocused && <StatusBar style="light" />}

            <Tabs
                screenOptions={{
                    tabBarShowLabel: false,
                    tabBarActiveTintColor: "#DBB978",
                    tabBarInactiveTintColor: "#FEFCF9",
                    tabBarStyle: {
                        backgroundColor: "#202020",
                        height: 110,
                        borderRadius: 10,
                    },
                }}
            >
                <Tabs.Screen
                    name="league"
                    options={{
                        title: 'League',
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={icons.people}
                                color={color}
                                name="League"
                                focused={focused}
                            />
                        ),
                    }}
                    listeners={({ navigation }) => ({
                        focus: () => setIsLeagueTabFocused(true),
                        blur: () => setIsLeagueTabFocused(false),
                    })}
                />
                <Tabs.Screen
                    name="pick-lineup"
                    options={{
                        title: 'PickLineup',
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={icons.todo}
                                color={color}
                                name="Pick Lineup"
                                focused={focused}
                            />
                        ),
                    }}
                    listeners={({ navigation }) => ({
                        focus: () => setIsNotLeagueTabFocused(true),
                        blur: () => setIsNotLeagueTabFocused(false),
                    })}
                />
                <Tabs.Screen
                    name="all-picks"
                    options={{
                        title: 'AllPicks',
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={icons.search}
                                color={color}
                                name="All Picks"
                                focused={focused}
                            />
                        ),
                    }}
                    listeners={({ navigation }) => ({
                        focus: () => setIsNotLeagueTabFocused(true),
                        blur: () => setIsNotLeagueTabFocused(false),
                    })}
                />
                <Tabs.Screen
                    name="leaderboards"
                    options={{
                        title: 'Leaderboards',
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={icons.trophy}
                                color={color}
                                name="Leaderboards"
                                focused={focused}
                            />
                        ),
                    }}
                    listeners={({ navigation }) => ({
                        focus: () => setIsNotLeagueTabFocused(true),
                        blur: () => setIsNotLeagueTabFocused(false),
                    })}
                />
            </Tabs>
        </View>
    );
};

export default TabsLayout;
