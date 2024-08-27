import { View, Text, Image } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { icons } from '../../constants'

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
    )
}

const TabsLayout = () => {
    return (
        <View style={{ flex: 1, backgroundColor: "#343434" }}>
            <Tabs
                screenOptions={{
                    tabBarShowLabel: false,
                    tabBarActiveTintColor: "#DBB978",
                    tabBarInactiveTintColor: "#FEFCF9",
                    tabBarStyle: {
                        backgroundColor: "#202020",
                        height: 110,
                        borderRadius: 10,
                    }
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
                        )

                    }}
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
                        )

                    }}
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
                        )

                    }}
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
                        )

                    }}
                />
            </Tabs >
        </View>
    )
}

export default TabsLayout