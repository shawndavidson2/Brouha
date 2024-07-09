import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GameCard from '../../components/AllPicks_components/GameCard'; // Assuming GameCard is in the same directory
import { SafeAreaView } from 'react-native-safe-area-context';

const AllPicks = () => {
    const [data, setData] = useState([]);

    const loadCachedData = async () => {
        try {
            const cachedData = await AsyncStorage.getItem('excelData');
            if (cachedData) {
                setData(JSON.parse(cachedData));
            }
        } catch (error) {
            console.error('Error loading cached data:', error);
        }
    };

    useEffect(() => {
        loadCachedData();
    }, []);

    return (
        <SafeAreaView className="bg-red-100 h-full">
            <ScrollView style={styles.container}>
                {data.length ? (
                    data.map((row, index) => (
                        <GameCard
                            key={index}
                            date={row["Game-Date"].split(',')[0]} // Adjust based on actual data structure
                            time={row['Game-Date'].split(',')[1]} // Adjust based on actual data structure
                            homeTeam={row['Matchup'].split('vs')[0]} // Adjust based on actual data structure
                            awayTeam={row['Matchup'].split('vs')[1]} // Adjust based on actual data structure
                            spread={row['HomeTeam (Spread)']} // Adjust based on actual data structure
                            overUnder={row['Matchup Over']} // Adjust based on actual data structure
                        />
                    ))
                ) : (
                    <Text>Loading...</Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
    },
});

export default AllPicks;
