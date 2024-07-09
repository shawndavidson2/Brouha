import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { icons } from '../../constants';
import { router } from 'expo-router';

const LeagueTitleAndProfile = ({ currentUser, leagueTitle, weekNum }) => {
    const profile = () => {
        router.push({ pathname: "../../profile" });
    };

    return (
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
            <Text style={{ fontSize: 30, fontWeight: 'bold' }}>{leagueTitle}</Text>
            <Text className="mt-2" style={{ fontSize: 18, fontWeight: 'medium' }}>Week {weekNum}</Text>
        </View>
    );
};

export default LeagueTitleAndProfile;
