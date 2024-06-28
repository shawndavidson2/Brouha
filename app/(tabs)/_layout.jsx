import { View, Text, Image } from 'react-native'
import React from 'react'
import { Tabs, Redirect } from 'expo-router'
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
            <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`}> {name}</Text>
        </View>
    )
}

const TabsLayout = () => {
    return (
        <>
            <Tabs
                screenOptions={{
                    tabBarShowLabel: false,
                    tabBarActiveTintColor: "#FFA001",
                    tabBarInactiveTintColor: "#CDCDE0",
                    tabBarStyle: {
                        //backgroundColor: "#161622",
                        borderTopWidth: 1,
                        borderTopColor: "#232533",
                        height: 84
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
                                icon={icons.home}
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
                                icon={icons.home}
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
                                icon={icons.home}
                                color={color}
                                name="Leaderboards"
                                focused={focused}
                            />
                        )

                    }}
                />
            </Tabs >
        </>
    )
}

export default TabsLayout