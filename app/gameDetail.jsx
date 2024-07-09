import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as XLSX from 'xlsx';

const GameDetail = () => {
    const { sheetName1, sheetName2 } = useLocalSearchParams();
    const [details, setDetails] = useState([]);

    useEffect(() => {
        fetchGameDetails();
    }, []);

    const fetchGameDetails = async () => {
        try {
            const fileUrl = 'https://cloud.appwrite.io/v1/storage/buckets/667edd29003dd0cf6445/files/668c9594001b31ff0cf4/view?project=667edab40004ed4257b4&mode=admin';
            const response = await fetch(fileUrl);
            const blob = await response.blob();

            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const worksheet = workbook.Sheets[sheetName1] ? workbook.Sheets[sheetName1] : workbook.Sheets[sheetName2];
                if (worksheet) {
                    const json = XLSX.utils.sheet_to_json(worksheet);
                    setDetails(json);
                } else {
                    console.error('Sheet not found:', sheetName1, sheetName2);
                }
            };

            reader.readAsArrayBuffer(blob);
        } catch (error) {
            console.error('Error fetching game details:', error);
        }
    };

    return (
        <ScrollView style={styles.container}>
            {details.length ? (
                details.map((detail, index) => (
                    <View key={index} style={styles.detailContainer}>
                        {Object.keys(detail).map((key, idx) => (
                            <Text key={idx} style={styles.detailText}>{`${key}: ${detail[key]}`}</Text>
                        ))}
                    </View>
                ))
            ) : (
                <Text>Loading...</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    detailContainer: {
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    detailText: {
        fontSize: 14,
    },
});

export default GameDetail;
