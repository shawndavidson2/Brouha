import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { icons } from '../../constants';

const JoinLeagueButton = ({ joinLeague }) => {
    return (
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
    );
};

export default JoinLeagueButton;
