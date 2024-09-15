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
import { StatusBar } from 'expo-status-bar';
import { parseDateTime, isFutureGameTime } from '../components/all-picks/gameDateUtils';
import styles from './styles';
import { ActivityIndicator } from 'react-native';

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
    const [timeRemaining, setTimeRemaining] = useState('');

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

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         const gameDateTime = parseDateTime(date, time);
    //         const now = new Date();
    //         const diff = gameDateTime - now;

    //         if (diff <= 0) {
    //             setTimeRemaining('Game Started');
    //             clearInterval(interval);
    //         } else {
    //             const hours = Math.floor(diff / (1000 * 60 * 60));
    //             const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    //             const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    //             setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
    //         }
    //     }, 1000);

    //     return () => clearInterval(interval);
    // }, [date, time]);

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

            const storedPicks = await AsyncStorage.getItem(`selectedPicks_${user.$id}_${sheetName}_${date}`);
            if (storedPicks) {
                setSelectedPicks(JSON.parse(storedPicks));
            }
        } catch (error) {
            console.error('Error loading selected picks from storage:', error);
        }
    };

    const saveSelectedPicks = async (picks) => {
        try {
            await AsyncStorage.setItem(`selectedPicks_${user.$id}_${sheetName}_${date}`, JSON.stringify(picks));
        } catch (error) {
            console.error('Error saving selected picks to storage:', error);
        }
    };

    const calculateFontSize = (detail, text, width) => {

        if (width === 100) {
            const num = Math.round(text)
            if (num > 9999) return 13.5
            else return 15
        }
        else if (width === 150) {
            if (text.length > 15) return 13.5
            else return 15
        }
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
        if (picks.length >= 5) {
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
            if (isFutureGameTime(pick.date, pick.time)) {
                deletePickFromPL(pick, pick.$id, sheetName, date, false)
                lineupCache[weekNum] = picks.filter(pickA => pickA.$id !== pick.$id)
                setDeletion(!deletion)
                setRefreshPicks(true);
                //router.back();
                //router.replace("./gameDetail")
            }
        } catch (error) {
            console.error('Error deleting pick:', error, pick);
        }
    };

    return (
        <SafeAreaView style={styless.safeArea}>
            <View style={styless.container}>
                <TouchableOpacity style={styless.backButton}>
                    <Text onPress={goBack} style={styless.backButtonText}>Back</Text>
                </TouchableOpacity>
                <Text style={styless.header}>{`${sheetName}`}</Text>
                {/* <Text style={styles.timer}>{`${timeRemaining}`}</Text> */}
                <View style={{ flexDirection: 'row' }}>
                    <View style={styless.headerContainer}>
                        <Text style={styless.headerTextPick}>Pick</Text>
                        <Text style={styless.headerTextPts}>Pts</Text>
                    </View>
                    <View style={styless.headerPick} />
                </View>
                <ScrollView
                    bounces={false}
                >
                    {details.length ? (
                        details.map((detail, index) => (
                            index > 1 && (
                                <View key={index} style={styless.detailContainer}>
                                    <Text style={[styless.detailText, styless.pickColumn, { fontSize: calculateFontSize(detail, detail[title], 150) }]}>
                                        {detail[title]}
                                    </Text>
                                    <Text style={[styless.detailText, styless.ptsColumn, { fontSize: calculateFontSize(detail, String(detail[points]), 100) }]}>
                                        {Math.round(detail[points])}
                                    </Text>
                                    <TouchableOpacity
                                        style={styless.addButton}
                                        onPress={() => handleAddToPL(index, detail[title], Math.round(detail[points]), detail[status])}
                                        disabled={loading || loadingScreen} // Disable button based on global loading state
                                    >
                                        <View style={styless.buttonContent}>
                                            {selectedPicks[index] ? (
                                                <AntDesign name="checkcircle" size={24} color="green" />
                                            ) : (
                                                <Text style={styless.addButtonText}>Add to PL</Text>
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )
                        ))
                    ) : (
                        <Loading color={true} />
                    )}
                </ScrollView>
            </View>
            {loadingScreen && (
                <View style={styless.overlay}>
                    <ActivityIndicator size="large" color="#8b2326" />
                </View>
            )}
            <StatusBar style="light" />
        </SafeAreaView>
    );
};

export default GameDetail;

const styless = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#343434',
    },
    container: {
        flex: 1,
        padding: 10,
        margin: 20,
        backgroundColor: '#fefcf9',
        borderRadius: 10,
        borderTopColor: '#8b2326',
        borderTopWidth: 20,
    },
    backButton: {
        marginBottom: 10,
        fontFamily: 'RobotoSlab-Regular'
    },
    backButtonText: {
        fontSize: 18,
        marginBottom: 10,
        fontFamily: 'RobotoSlab-Regular',
        color: 'black', // Adjust color to match design
        textAlign: 'left'
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#8b2326',
        fontFamily: 'RobotoSlab-Bold',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '58%',
        backgroundColor: '#8b2326',
        padding: 10,
        paddingHorizontal: 30,
        borderTopStartRadius: 10,
        borderTopEndRadius: 10,
        marginTop: 30,
        marginLeft: 10,
        justifyContent: 'space-between'
    },
    headerTextPick: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'RobotoSlab-Regular'
    },
    headerTextPts: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'RobotoSlab-Regular'
    },
    headerPick: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '32%',
        backgroundColor: '#DBB978',
        padding: 10,
        paddingHorizontal: 30,
        borderTopStartRadius: 10,
        borderTopEndRadius: 10,
        marginTop: 30,
        marginLeft: 10,
        justifyContent: 'space-between'
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
        fontSize: 16,
        textAlign: 'center',
        flex: 1,
        fontFamily: 'RobotoSlab-Regular'
    },
    pickColumn: {
        flex: 3,
        textAlign: 'center',
        marginRight: 20
    },
    ptsColumn: {
        flex: 1,
        textAlign: 'center',
        marginRight: 20,
        fontFamily: 'RobotoSlab-Regular'
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
        fontFamily: 'RobotoSlab-Regular'
    },
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 10,
    },
});
