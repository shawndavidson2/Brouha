import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { icons } from '../../constants';
import { router } from 'expo-router';

const LeagueTitleAndProfile = ({ currentUser, leagueTitle, weekNum }) => {
    const profile = () => {
        router.push({ pathname: "../../profile" });
    };

    return (
        <View style={{ width: '100%', paddingVertical: 20 }}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center', // Align items in the center vertically
                justifyContent: 'space-between', // Ensure even spacing between items
            }}>
                <View
                    style={{
                        flex: 1, // Take up the remaining space after the profile button
                    }}
                >
                    <Text
                        style={{
                            fontSize: 30,
                            fontWeight: 'bold',
                            flexShrink: 1, // Allow text to shrink to fit within available space
                            color: '#8b2326',
                        }}
                        numberOfLines={1} // Truncate text if it's too long
                    >
                        {leagueTitle}
                    </Text>
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: 'medium',
                            marginTop: 2,
                        }}
                    >
                        Week {weekNum}
                    </Text>
                </View>
                <TouchableOpacity onPress={profile}
                    style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: 10, // Add some spacing between the title and profile button
                    }}
                >
                    <Image
                        source={icons.profile}
                        resizeMode="contain"
                        style={{
                            width: 40,
                            height: 40,
                            tintColor: '#8b2326'
                        }}
                    />
                    <Text
                        style={{
                            color: '#8b2326',
                            fontSize: 16,
                            fontWeight: 'bold'
                        }}
                    >Profile</Text>
                </TouchableOpacity>
            </View>
        </View>

    );
};

export default LeagueTitleAndProfile;
