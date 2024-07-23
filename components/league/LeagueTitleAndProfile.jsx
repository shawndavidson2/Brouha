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
             }}>
                <View
                    style={{
                        flexDirection: 'column',
                        // alignItems: 'center',
                        // justifyContent: 'space-around',
                    }}
                >
                    <Text style={{ fontSize: 30, fontWeight: 'bold' }}>{leagueTitle}</Text>
                    <Text className="mt-2" style={{ fontSize: 18, fontWeight: 'medium' }}>Week {weekNum}</Text>
                </View>
                <TouchableOpacity onPress={profile}
                    style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        paddingLeft: 120,
                        justifyContent: 'space-around',
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
