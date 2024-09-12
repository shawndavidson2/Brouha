import { View, Text, Image, Animated, Easing } from 'react-native';
import React, { useRef, useEffect } from 'react';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { icons } from '../../constants';
import { useFocusEffect } from '@react-navigation/native';
import { useState } from 'react';

const TabIcon = ({ icon, color, name, focused }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (focused) {
            // Scale and soft glow effect when tab is focused
            Animated.parallel([
                Animated.timing(scaleAnim, {
                    toValue: 1.2,
                    duration: 300,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(glowAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            // Reset animations when not focused
            Animated.parallel([
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(glowAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [focused]);

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Animated.View
                style={{
                    transform: [{ scale: scaleAnim }],
                    shadowColor: focused ? '#DBB978' : 'transparent',
                    shadowOpacity: focused ? 1.0 : 0,
                    shadowRadius: focused ? 15 : 0,
                    shadowOffset: { width: 0, height: 0 },
                }}
            >
                <Image
                    source={icon}
                    resizeMode="contain"
                    style={{ width: 30, height: 30, tintColor: color }}
                />
            </Animated.View>
            <Text
                style={{
                    color,
                    fontSize: 12,
                    marginTop: 5,
                    fontWeight: focused ? 'bold' : 'normal',
                }}
            >
                {name}
            </Text>
        </View>
    );
};

const TabsLayout = () => {
    const [isLeagueTabFocused, setIsLeagueTabFocused] = useState(false);
    const [isNotLeagueTabFocused, setIsNotLeagueTabFocused] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            setIsLeagueTabFocused(true);
            return () => setIsLeagueTabFocused(false);
        }, [])
    );

    return (
        <View style={{ flex: 1, backgroundColor: "#343434" }}>
            {isLeagueTabFocused && <StatusBar style="dark" />}
            {isNotLeagueTabFocused && <StatusBar style="light" />}

            <Tabs
                screenOptions={{
                    tabBarShowLabel: false,
                    tabBarActiveTintColor: "#DBB978",
                    tabBarInactiveTintColor: "#FEFCF9",
                    tabBarStyle: {
                        backgroundColor: "#202020",
                        height: 104,
                        borderRadius: 10,
                        paddingVertical: 0,
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
