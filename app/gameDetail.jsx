import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as XLSX from 'xlsx';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createPick, updatePick } from '../lib/appwrite';
import { useGlobalContext } from '../context/GlobalProvider';
import { updateWeeklyLineup, createGame, createWeeklyLineup } from '../lib/appwrite';
import { useLineupCache } from '../context/lineupContext';
import { useRouter } from 'expo-router';
import Loading from '../components/Loading';
import { useRefresh } from '../context/RefreshContext';
import usePickLineup from '../components/pick-lineup/usePickLineup';
import { StatusBar } from 'expo-status-bar';
import { isFutureGameTime, getDayAbbreviation } from '../components/all-picks/gameDateUtils';
import getImageSource from '../components/all-picks/getImageSource';
import Icon from 'react-native-vector-icons/Ionicons'; // Using Ionicons as an example


const GameDetail = () => {
    const { sheetName1, sheetName2, date, time, fileUrl } = useLocalSearchParams();
    const { weekNum, user, setUser, refreshPicks, setRefreshPicks } = useGlobalContext();
    const [sheetName, setSheetName] = useState(sheetName1);
    const [details, setDetails] = useState([]);
    const [selectedPicks, setSelectedPicks] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingScreen, setLoadingScreen] = useState(false);
    const [deletion, setDeletion] = useState(false);
    const { triggerRefresh } = useRefresh();

    const lineupCache = useLineupCache();
    const picks = lineupCache[weekNum] || [];
    const pickIds = picks.map(pick => pick.$id);

    const router = useRouter();

    const status = sheetName;
    const title = "__EMPTY";
    const points = "__EMPTY_1";

    const { deletePickFromPL } = usePickLineup(weekNum);

    useEffect(() => {
        fetchGameDetails();
    }, [deletion]);

    useEffect(() => {
        const processDetails = async () => {
            setLoading(true);
            const picksArr = [];
            if (details.length > 0) {
                const createStatus = await createGame(sheetName, weekNum);

                if (createStatus) {
                    details.map((detail, index) => {
                        if (index > 1) {
                            createPick(detail[title], Math.round(detail[points]), detail[status], sheetName, date, time, weekNum).then(res => {
                                picksArr.push(res);
                            });
                        }
                    });
                }
            }
            await loadSelectedPicks();
            setLoading(false);
        };

        processDetails();
    }, [details]);

    const goBack = () => {
        if (!loading) router.back();
    };

    const pointsInfo = () => {
        Alert.alert(
            "Understanding Point Values",
            "Point values are derived from true probabilities. A pick worth 1000 points has a 50/50 chance of occurring.",
            [
                { text: "Got it" }
            ],
            { cancelable: true }
        );
    };

    const fetchGameDetails = async () => {
        try {
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
                    Alert.alert("Game not added in yet!");
                    router.back();
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
            const num = Math.round(text);
            if (num > 9999) return 13.5;
            else return 15;
        } else if (width === 150) {
            if (text.length > 15) return 13.5;
            else return 15;
        }
        return 15;
    };

    const handleAddToPL = async (index, pick, pts) => {
        if (!user.league) {
            Alert.alert("Please join or create a league to make a pick!");
        } else {
            setLoading(true);

            const isSelected = selectedPicks[index];

            if (!isSelected) await addNewPick(index, pick, pts);
            else await deleteExistingPick(pick);

            setLoading(false);
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
                pickIds.push(newPick.$id);
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
            } catch (error) {
                console.error('Error creating pick:', error);
            }
        }
    };

    const deleteExistingPick = async (pickTitle) => {
        try {
            const pick = picks.find(pickA => pickTitle == pickA['pick-title']);
            if (isFutureGameTime(pick.date, pick.time)) {
                deletePickFromPL(pick, pick.$id, sheetName, date, false);
                lineupCache[weekNum] = picks.filter(pickA => pickA.$id !== pick.$id);
                setDeletion(!deletion);
                setRefreshPicks(true);
            }
        } catch (error) {
            console.error('Error deleting pick:', error, pick);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'top']}>
            <View style={styles.headerRow}>
                <TouchableOpacity style={styles.headerButtons}>
                    <Text onPress={goBack} style={styles.backButtonText}>{"< Back"}</Text>
                </TouchableOpacity>
                <Text style={styles.picksMade}>{"Picks Made: " + picks.length + "/5"}</Text>
            </View>
            <View style={styles.container}>
                <View style={styles.margin}>
                    <View style={styles.teamRow}>
                        <Image source={getImageSource(sheetName.split("vs")[0])} style={styles.teamImage} />
                        <View style={styles.textCenter}>
                            <Text style={styles.header}>{`${sheetName}`}</Text>
                            <Text style={styles.subHeader}>{getDayAbbreviation(date) + " " + time}</Text>
                        </View>
                        <Image source={getImageSource(sheetName.split("vs")[1])} style={styles.teamImage} />
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={styles.headerContainer}>
                            <Text style={styles.headerTextPick}>Pick</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.headerTextPts}>Points</Text>
                                <TouchableOpacity style={styles.infoCircle} onPress={() => { pointsInfo() }}>
                                    <AntDesign name="infocirlceo" size={15} color="#bdbfbd" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <ScrollView bounces={true} style={{ marginBottom: 175 }}>
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
                                            disabled={loading || loadingScreen}
                                        >
                                            <View style={styles.buttonContent}>
                                                {selectedPicks[index] ? (
                                                    <AntDesign name="checkcircleo" size={21} color="#078507" />
                                                ) : (
                                                    <AntDesign name="pluscircleo" size={21} color="#8b2326" />
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
            </View>
            {
                loadingScreen && (
                    <View style={styles.overlay}>
                        <ActivityIndicator size="large" color="#8b2326" />
                    </View>
                )
            }
            <StatusBar style="light" />
        </SafeAreaView >
    );
};

export default GameDetail;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#343434',
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    margin: {
        marginHorizontal: 30,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#343434',
        marginTop: 10,
        marginBottom: 12,
        paddingHorizontal: 20,
    },
    teamRow: {
        marginTop: 20,
        marginBottom: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerButtons: {
        marginBottom: 10,
        fontFamily: 'RobotoSlab-Regular',
    },
    backButtonText: {
        fontSize: 22,
        fontFamily: 'RobotoSlab-Regular',
        color: '#DBB978',
        textAlign: 'left',
    },
    picksMade: {
        fontSize: 18,
        marginBottom: 10,
        fontFamily: 'RobotoSlab-Regular',
        color: '#DBB978',
        textAlign: 'right',
    },
    header: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'RobotoSlab-SemiBold',
    },
    teamImage: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
        marginHorizontal: 10,
    },
    subHeader: {
        marginTop: 0,
        fontSize: 15,
        textAlign: 'center',
        fontFamily: 'RobotoSlab-Regular',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '55%',
        padding: 10,
        paddingHorizontal: 4,
        marginTop: 17,
        marginLeft: 0,
        justifyContent: 'space-between',
        marginLeft: 43,
    },
    headerTextPick: {
        fontSize: 18,
        textDecorationLine: 'underline',
        fontFamily: 'RobotoSlab-Bold'
    },
    headerTextPts: {
        fontSize: 18,
        textDecorationLine: 'underline',
        fontFamily: 'RobotoSlab-Bold'
    },
    headerText: {
        fontSize: 18,
        textDecorationLine: 'underline',
        fontFamily: 'RobotoSlab-Bold',
    },
    headerTextAction: {
        fontSize: 18,
        textDecorationLine: 'underline',
        fontFamily: 'RobotoSlab-Bold',
        textAlign: 'center',
    },
    detailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        paddingVertical: 8,
        borderBottomWidth: 2,
        borderBottomColor: '#ddd',
        borderRadius: 5,
    },
    detailText: {
        fontSize: 16,
        flex: 1,
        paddingRight: 40,
        fontFamily: 'RobotoSlab-Regular',
    },
    pickColumn: {
        flex: 3,
        textAlign: 'center',
        paddingLeft: 15,
    },
    ptsColumn: {
        flex: 1,
        marginRight: 20,
        textAlign: 'center',

    },
    addButtonColumn: {
        flex: 1,
        alignItems: 'center',
    },
    addButton: {
        flex: 1,
        paddingVertical: 9,
        paddingHorizontal: 10,
        borderRadius: 5,
        borderWidth: 2.5,
        borderColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 20,
        marginBottom: 6
    },
    buttonContent: {
        alignItems: 'center',
    },
    infoCircle: {
        paddingLeft: 6
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
