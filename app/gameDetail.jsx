import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as XLSX from 'xlsx';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createPick, deletePick, getUserWeeklyLineup, createWeeklyLineup, updatePick } from '../lib/appwrite';
import { useGlobalContext } from '../context/GlobalProvider';
import { updateWeeklyLineup, createGame } from '../lib/appwrite';
import { useLineupCache } from '../context/lineupContext';
import { useRouter } from 'expo-router';
import Loading from '../components/Loading';
import { useRefresh } from '../context/RefreshContext';
import usePickLineup from '../components/pick-lineup/usePickLineup'

const GameDetail = () => {
    const { sheetName1, sheetName2, date, time, fileUrl } = useLocalSearchParams();
    const { weekNum, user, setUser, refreshPicks, setRefreshPicks } = useGlobalContext();
    const [sheetName, setSheetName] = useState(sheetName1);
    const [details, setDetails] = useState([]);
    const [selectedPicks, setSelectedPicks] = useState({});
    const [loading, setLoading] = useState(false); // Global loading state
    const [loadingScreen, setLoadingScreen] = useState(false); // Global loading state
    const [deletion, setDeletion] = useState(false);
    const { triggerRefresh } = useRefresh();

    const lineupCache = useLineupCache();
    const picks = lineupCache[weekNum] || [];
    const pickIds = picks.map(pick => pick.$id);

    const router = useRouter();

    const status = sheetName
    const title = "__EMPTY"
    const points = "__EMPTY_1"

    const {
        deletePickFromPL
    } = usePickLineup(weekNum);

    useEffect(() => {
        fetchGameDetails();
    }, [deletion]);

    useEffect(() => {
        const processDetails = async () => {
            setLoading(true);
            const picksArr = []
            if (details.length > 0) {
                const createStatus = await createGame(sheetName, weekNum); // Adjust parameters as needed

                if (createStatus) {
                    details.map((detail, index) => {

                        if (index > 1) {
                            createPick(detail[title], Math.round(detail[points]), detail[status], sheetName, date, time, weekNum).then(res => {
                                picksArr.push(res)
                            })
                        }
                    })
                }

            }
            await loadSelectedPicks();
            setLoading(false);
        };

        processDetails();
    }, [details]); // This useEffect runs whenever `details` changes

    const goBack = () => {
        if (!loading) router.back();
    };

    const fetchGameDetails = async () => {
        try {
            //const fileUrl = 'https://cloud.appwrite.io/v1/storage/buckets/667edd29003dd0cf6445/files/66997754d6c51b09cbb4/view?project=667edab40004ed4257b4&mode=admin';
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
                    Alert.alert("Game not added in yet!")
                    router.back()
                }
            };

            reader.readAsArrayBuffer(blob);
        } catch (error) {
            console.error('Error fetching game details:', error);
        }
    };

    const loadSelectedPicks = async () => {
        try {
            const storedPicks = await AsyncStorage.getItem(`selectedPicks_${user.$id}_${sheetName}`);
            if (storedPicks) {
                setSelectedPicks(JSON.parse(storedPicks));
            }
        } catch (error) {
            console.error('Error loading selected picks from storage:', error);
        }
    };

    const saveSelectedPicks = async (picks) => {
        try {
            await AsyncStorage.setItem(`selectedPicks_${user.$id}_${sheetName}`, JSON.stringify(picks));
        } catch (error) {
            console.error('Error saving selected picks to storage:', error);
        }
    };

    const calculateFontSize = (detail, text, width) => {
        // const maxFontSize = 22;
        // const minFontSize = 15;
        // const scale = width / (text.length * 10);
        // return Math.max(Math.min(maxFontSize, scale), minFontSize);
        return 15;
    };

    const handleAddToPL = async (index, pick, pts) => {

        if (!user.league) {
            Alert.alert("Please join or create a league to make a pick!");
        } else {
            setLoading(true); // Set global loading state

            const isSelected = selectedPicks[index];

            if (!isSelected) await addNewPick(index, pick, pts);
            else await deleteExistingPick(pick);

            setLoading(false); // Reset global loading state
            setRefreshPicks(true);
        }
    };

    const addNewPick = async (index, pick, pts, statusLetter) => {
        if (picks.length >= 4) {
            Alert.alert("You are already at your maximum number of picks for the week!");
        } else {
            try {
                setLoadingScreen(true);
                const newPick = await updatePick(pick, pts, user.$id, weekNum);
                picks.push(newPick);
                pickIds.push(newPick.$id)
                setSelectedPicks(prevState => {
                    const newState = { ...prevState, [index]: newPick.$id };
                    saveSelectedPicks(newState);
                    return newState;
                });

                setLoadingScreen(false);

                let weeklyLineup, updatedUser;
                weeklyLineup = await updateWeeklyLineup(user.$id, weekNum, pickIds, pts);
                if (!weeklyLineup) {
                    weeklyLineup, updatedUser = await createWeeklyLineup(user, pickIds, weekNum);
                    triggerRefresh();
                }

                // setUser(updatedUser);
            } catch (error) {
                console.error('Error creating pick:', error);
            }
        }
    };

    const deleteExistingPick = async (pickTitle) => {
        try {
            const pick = picks.find(pickA => pickTitle == pickA['pick-title']);
            deletePickFromPL(pick, pick.$id, sheetName, false)
            lineupCache[weekNum] = picks.filter(pickA => pickA.$id !== pick.$id)
            setDeletion(!deletion)
            //router.back();
            //router.replace("./gameDetail")
        } catch (error) {
            console.error('Error deleting pick:', error, pick);
        }
    };

    if (loadingScreen) {
        return <Loading />
    } else {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <TouchableOpacity style={styles.backButton}>
                        <Text onPress={goBack} style={styles.backButtonText}>Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.header}>{`${sheetName}`}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={styles.headerContainer}>
                            <Text style={styles.headerTextPick}>Pick</Text>
                            <Text style={styles.headerTextPts}>Pts</Text>
                        </View>
                        <View style={styles.headerPick} />
                    </View>
                    <ScrollView
                        bounces={false}
                    >
                        {details.length ? (
                            details.map((detail, index) => (
                                index > 1 && (
                                    <View key={index} style={styles.detailContainer}>
                                        <Text style={[styles.detailText, styles.pickColumn, { fontSize: calculateFontSize(detail, detail[title], 150) }]}>
                                            {detail[title]}
                                        </Text>
                                        <Text style={[styles.detailText, styles.ptsColumn, { fontSize: calculateFontSize(detail, String(detail[points]), 100) }]}>
                                            {Math.round(detail[points])}
                                        </Text>
                                        <TouchableOpacity
                                            style={styles.addButton}
                                            onPress={() => handleAddToPL(index, detail[title], Math.round(detail[points]), detail[status])}
                                            disabled={loading} // Disable button based on global loading state
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
                            <Loading />
                        )}
                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    };
}

export default GameDetail;
