import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as XLSX from 'xlsx';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons'; // Import AntDesign icons
import { createPick, deletePick } from '../lib/appwrite';

const GameDetail = () => {
    const { sheetName1, sheetName2 } = useLocalSearchParams();
    const [sheetName, setSheetName] = useState(sheetName1);
    const [details, setDetails] = useState([]);
    const [selectedPicks, setSelectedPicks] = useState({});

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
                setSheetName(workbook.Sheets[sheetName1] ? sheetName1 : sheetName2);
                const worksheet = workbook.Sheets[sheetName];
                if (worksheet) {
                    const json = XLSX.utils.sheet_to_json(worksheet);
                    setDetails(json);
                } else {
                    console.error('Sheet not found:', sheetName);
                }
            };

            reader.readAsArrayBuffer(blob);
        } catch (error) {
            console.error('Error fetching game details:', error);
        }
    };

    const calculateFontSize = (text, width) => {
        const maxFontSize = 22;
        const minFontSize = 15;
        const scale = width / (text.length * 10);
        return Math.max(Math.min(maxFontSize, scale), minFontSize);
    };

    const handleAddToPL = async (index, pick, pts) => {
        console.log(`Pick: ${pick}, Pts: ${pts}`);
        const isSelected = selectedPicks[index];

        if (isSelected) {
            try {
                await deletePick(selectedPicks[index]);
                setSelectedPicks(prevState => {
                    const newState = { ...prevState };
                    delete newState[index];
                    return newState;
                });
            } catch (error) {
                console.error('Error deleting pick:', error);
            }
        } else {
            try {
                const newPick = await createPick(pick, pts, 'pending');
                setSelectedPicks(prevState => ({
                    ...prevState,
                    [index]: newPick.$id // Ensure this uses the new pick's ID
                }));
            } catch (error) {
                console.error('Error creating pick:', error);
            }
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
                <TouchableOpacity style={styles.backButton}>
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>{`${sheetName}`}</Text>
                <Text style={styles.sectionTitle}>Game:</Text>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerTextPick}>Pick</Text>
                    <Text style={styles.headerTextPts}>Pts</Text>
                </View>
                {details.length ? (
                    details.map((detail, index) => (
                        index > 0 && (
                            <View key={index} style={styles.detailContainer}>
                                <Text style={[styles.detailText, styles.pickColumn, { fontSize: calculateFontSize(detail[sheetName], 150) }]}>
                                    {detail[sheetName]}
                                </Text>
                                <Text style={[styles.detailText, styles.ptsColumn, { fontSize: calculateFontSize(String(detail['__EMPTY']), 100) }]}>
                                    {Math.round(detail['__EMPTY'])}
                                </Text>
                                <TouchableOpacity
                                    style={styles.addButton}
                                    onPress={() => handleAddToPL(index, detail[sheetName], Math.round(detail['__EMPTY']))}
                                >
                                    <View style={styles.buttonContent}>
                                        {selectedPicks[index] ? (
                                            <AntDesign name="checkcircle" size={24} color="green" />
                                        ) : (
                                            <Text style={styles.addButtonText}>Add to PL</Text>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )
                    ))
                ) : (
                    <Text>Loading...</Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFEBEE',
    },
    container: {
        flex: 1,
        padding: 20,
    },
    backButton: {
        marginBottom: 10,
    },
    backButtonText: {
        fontSize: 18,
    },
    title: {
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    headerTextPick: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'left',
    },
    headerTextPts: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'right',
        marginRight: 140
    },
    detailContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    detailText: {
        textAlign: 'center',
        flex: 1,
    },
    pickColumn: {
        flex: 3,
        textAlign: 'center',
        marginRight: 20
    },
    ptsColumn: {
        flex: 1,
        textAlign: 'center',
        marginRight: 20
    },
    addButton: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        borderWidth: 3,
        marginLeft: 10,
    },
    buttonContent: {
        width: 70, // Fixed width to avoid layout shift
        alignItems: 'center',
    },
    addButtonText: {
        fontSize: 14,
    },
});

export default GameDetail;
