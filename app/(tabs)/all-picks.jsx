import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GameCard from '../../components/all-picks/GameCard'; // Adjust the path as needed
import { SafeAreaView } from 'react-native-safe-area-context';
import { Client, Storage } from 'react-native-appwrite';
import * as XLSX from 'xlsx';

const client = new Client();
client.setEndpoint('https://cloud.appwrite.io/v1').setProject('667edab40004ed4257b4');

const storage = new Storage(client);

const excelDateToJSDate = (serial) => {
    const utc_days = Math.floor(serial - 25569 + 1); // Add 1 to correct the date offset
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);

    const fractional_day = serial - Math.floor(serial) + 0.0000001;
    let total_seconds = Math.floor(86400 * fractional_day);

    const seconds = total_seconds % 60;
    total_seconds -= seconds;

    const hours = Math.floor(total_seconds / (60 * 60));
    const minutes = Math.floor(total_seconds / 60) % 60;

    const date = new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);

    // Format the date to "M/D/YYYY h:mm:ss AM/PM"
    const formattedDate = date.toLocaleString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        //second: 'numeric',
        hour12: true
    });

    return formattedDate;
};

const AllPicks = () => {
    const [data, setData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchFile = async () => {
        try {
            const fileUrl = 'https://cloud.appwrite.io/v1/storage/buckets/667edd29003dd0cf6445/files/66997754d6c51b09cbb4/view?project=667edab40004ed4257b4&mode=admin';
            const response = await fetch(fileUrl);
            const blob = await response.blob();

            const reader = new FileReader();
            reader.onload = async (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                let json = XLSX.utils.sheet_to_json(worksheet);

                // Convert Excel date serial numbers to formatted JS Dates
                json = json.map(row => {
                    Object.keys(row).forEach(key => {
                        if (typeof row[key] === 'number' && row[key] > 40000 && row[key] < 50000) {
                            row[key] = excelDateToJSDate(row[key]);
                        }
                    });
                    return row;
                });

                await AsyncStorage.setItem('excelData', JSON.stringify(json));
                setData(json); // Set the data state with the new data
            };

            reader.readAsArrayBuffer(blob);
        } catch (error) {
            console.error('Error fetching file:', error);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchFile().then(() => setRefreshing(false));
    }, []);

    useEffect(() => {
        loadCachedData();
    }, []);

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

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.container}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {data.length ? (
                    data.map((row, index) => (
                        <GameCard
                            key={index}
                            date={row['Game-Date'].split(',')[0]} // Adjust based on actual data structure
                            time={row['Game-Date'].split(',')[1]} // Adjust based on actual data structure
                            homeTeam={row['Matchup'].split('vs')[1]} // Adjust based on actual data structure
                            awayTeam={row['Matchup'].split('vs')[0]} // Adjust based on actual data structure
                            spread={row['HomeTeam (Spread)']} // Adjust based on actual data structure
                            overUnder={row['Matchup Over']} // Adjust based on actual data structure
                        />
                    ))
                ) : (
                    <View >
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
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
    safeArea: {
        flex: 1,
        backgroundColor: '#343434',
    },
});

export default AllPicks;
