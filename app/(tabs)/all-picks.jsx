import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GameCard from '../../components/all-picks/GameCard'; // Adjust the path as needed
import { SafeAreaView } from 'react-native-safe-area-context';
import { Client, Storage } from 'react-native-appwrite';
import * as XLSX from 'xlsx';
import { getAllFilenamesFromStorage } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';
import { StatusBar } from 'expo-status-bar';

const client = new Client();
client.setEndpoint('https://cloud.appwrite.io/v1').setProject('667edab40004ed4257b4');

const storage = new Storage(client);

const parseDateTime = (date, time) => {
    try {
        const [month, day, year] = date.trim().split('/');
        let [hour, minute] = time.trim().split(':');
        const period = time.trim().slice(-2); // AM or PM

        hour = parseInt(hour, 10);
        minute = parseInt(minute.slice(0, 2), 10);

        if (period === 'PM' && hour < 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;

        return new Date(year, month - 1, day, hour, minute);
    } catch (error) {
        console.error('Error parsing date and time:', date, time, error);
        return null;
    }
};

const excelDateToJSDate = (serial) => {
    const utc_days = Math.floor(serial - 25569 + 1);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);

    const fractional_day = serial - Math.floor(serial) + 0.0000001;
    let total_seconds = Math.floor(86400 * fractional_day);

    const seconds = total_seconds % 60;
    total_seconds -= seconds;

    const hours = Math.floor(total_seconds / (60 * 60));
    const minutes = Math.floor(total_seconds / 60) % 60;

    const date = new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);

    const formattedDate = date.toLocaleString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });

    return formattedDate;
};

export const isFutureGameTime = (date, time) => {
    if (!date || !time) {
        console.error('Invalid date or time:', row['Game-Date']);
        return false;
    }

    const gameDateTime = parseDateTime(date, time);
    const currentTime = new Date();

    return gameDateTime && gameDateTime > currentTime;

};

const AllPicks = () => {
    const { weekNum } = useGlobalContext();
    const [data, setData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [fileUrl, setFileUrl] = useState('');

    const fetchFileUrl = async () => {
        try {
            const fileNames = await getAllFilenamesFromStorage();
            const file = fileNames.files.find(file => file.name === `Matchup Data WK${weekNum}.xlsx`);

            if (!file || !file.$id) {
                throw new Error('File ID not found');
            }

            const id = file.$id;

            const url = `https://cloud.appwrite.io/v1/storage/buckets/667edd29003dd0cf6445/files/${id}/view?project=667edab40004ed4257b4&mode=admin&timestamp=${new Date().getTime()}`;
            setFileUrl(url);
            return url;
        } catch (error) {
            console.error('Error fetching file URL:', error);
        }
    };

    const fetchFile = async (url) => {
        try {
            console.log("START", url)
            if (!url) return; // Ensure fileUrl is set
            const response = await fetch(url);
            const blob = await response.blob();

            const reader = new FileReader();
            reader.onload = async (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                let json = XLSX.utils.sheet_to_json(worksheet);

                json = json.map(row => {
                    Object.keys(row).forEach(key => {
                        if (typeof row[key] === 'number' && row[key] > 40000 && row[key] < 50000) {
                            row[key] = excelDateToJSDate(row[key]);
                        }
                    });
                    return row;
                });

                await AsyncStorage.setItem('excelData', JSON.stringify(json));
                setData(json);
            };

            reader.readAsArrayBuffer(blob);
            console.log("END")
        } catch (error) {
            console.error('Error fetching file:', error);
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        fetchFileUrl().then((res) => { fetchFile(res) });
        setRefreshing(false);
    }, []);

    useEffect(() => {
        fetchFileUrl().then(fetchFile);
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
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.picksContainer}>
                <ScrollView
                    style={styles.container}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    {
                        data.length > 0 ? (
                            // Filter and check if any games are left after filtering
                            data
                                .filter((row) => {
                                    const [date, time] = row['Game-Date'].split(' ');

                                    return isFutureGameTime(date, time);
                                })
                                .length > 0 ? (
                                data
                                    .filter((row) => {
                                        const [date, time] = row['Game-Date'].split(' ');
                                        return isFutureGameTime(date, time);
                                    })
                                    .map((row, index) => (
                                        <GameCard
                                            key={index}
                                            date={row['Game-Date'].split(' ')[0]}
                                            time={row['Game-Date'].split(' ')[1]}
                                            homeTeam={row['Matchup'].split('vs')[1]}
                                            awayTeam={row['Matchup'].split('vs')[0]}
                                            spread={row['HomeTeam (Spread)']}
                                            overUnder={row['Matchup Over']}
                                            fileUrl={fileUrl}
                                        />
                                    ))
                            ) : (
                                // If all games are filtered out, show this message
                                <Text style={styles.noDataText}>
                                    Exciting games are on the way!
                                    {"\n\n"}
                                    Stay tuned for upcoming matchups and check back soon to make your picks!
                                </Text>
                            )
                        ) : (
                            // If there's no data at all, show this message
                            <Text style={styles.noDataText}>
                                Exciting games are on the way!
                                {"\n\n"}
                                Stay tuned for upcoming matchups and check back soon to make your picks!
                            </Text>
                        )
                    }
                </ScrollView>
            </View>
            <StatusBar style="light" />
        </SafeAreaView>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#343434',
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#343434',
    },
    picksContainer: {
        padding: 0,
        paddingHorizontal: 10,
        flex: 1,
    },
    noDataText: {
        color: '#DBB978',
        fontSize: 23,
        textAlign: 'center',
        marginTop: 190,
        lineHeight: 30,
        fontFamily: 'RobotoSlab-Bold'
    }
});

export default AllPicks;
