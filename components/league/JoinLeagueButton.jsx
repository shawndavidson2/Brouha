import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { icons } from '../../constants';

const JoinLeagueButton = ({ joinLeague }) => {
    return (
        <View style={{ position: 'absolute', bottom: 20, right: 20, alignItems: 'center' }}>
            <TouchableOpacity onPress={joinLeague}
                style={{
                    width: 150,
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 10,
                    justifyContent: 'space-around',
                    gap: 30,
                }}
            >
                <Text
                    style={{ 
                        color: '#8b2326',
                        fontSize: 16,
                        fontWeight: 'bold'
                    }}
                >
                    Join a League
                </Text>
                <Image
                    className="w-[40] h-[40]"
                    source={icons.plus}
                    resizeMode="contain"
                    tintColor={'#8b2326'}
                />
            </TouchableOpacity>
        </View>
    );
};

export default JoinLeagueButton;
