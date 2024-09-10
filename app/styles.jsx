
import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
    leaderboard: {
        flex: 1,
        marginBottom: 24,
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#fefcf9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        fontFamily: 'RobotoSlab-Regular'
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        fontFamily: 'RobotoSlab-Regular'
    },
    leaderboardItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        fontFamily: 'RobotoSlab-Regular'
    },
    current: {
        backgroundColor: '#DBB978',
        borderRadius: 7,
        fontFamily: 'RobotoSlab-Regular'
    },
    rank: {
        width: 40,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#8b2326',
        fontFamily: 'RobotoSlab-SemiBold'
    },
    name: {
        flex: 1,
        textAlign: 'left',
        fontFamily: 'RobotoSlab-Regular'
    },
    points: {
        width: 80,
        textAlign: 'right',
        fontWeight: 'bold',
        marginRight: 10,
        color: '#8b2326',
        fontFamily: 'RobotoSlab-SemiBold'
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#000',
    },
    tabText: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'RobotoSlab-Regular'
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
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#8b2326',
        fontFamily: 'RobotoSlab-Bold',
    },
    weekNavigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    subHeader: {
        fontSize: 18,
        textAlign: 'center',
        fontFamily: 'RobotoSlab-Regular'
    },
    scrollView: {
        flex: 1,
    },
    pickItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    pickDetails: {
        flex: 1,
    },
    pickText: {
        fontSize: 16,
        fontFamily: 'RobotoSlab-Regular'
    },
    gameText: {
        fontSize: 14,
        color: '#555',
        fontFamily: 'RobotoSlab-Regular'
    },
    pointsText: {
        fontSize: 16,
        fontFamily: 'RobotoSlab-Regular'
    },
    statusIcon: {
        marginLeft: 10,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    totalText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#8b2326',
        fontFamily: 'RobotoSlab-SemiBold'
    },
    totalPointsText: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'RobotoSlab-Regular'
    },
    earnedPointsText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'green',
        fontFamily: 'RobotoSlab-Regular'
    },
    deleteButton: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        width: 75,
        height: '100%',
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontFamily: 'RobotoSlab-Regular'
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#343434',
    },
    loadingScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#343434',
        fontFamily: 'RobotoSlab-Regular'
    },
    loadingScreenWhite: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFF',
        fontFamily: 'RobotoSlab-Regular'
    },
    input: {
        height: 40,
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        margin: 10,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
        fontFamily: 'RobotoSlab-Regular',
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
    description: {
        fontSize: 14,
        color: 'gray',
        textAlign: 'center',
        marginBottom: 20
    },
    leaderboardTitle: {
        textAlign: 'center',
        fontSize: 29,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#8b2326',
        fontFamily: 'RobotoSlab-SemiBold'
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        fontFamily: 'RobotoSlab-Regular'
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
    button: {
        backgroundColor: '#8b2326', // Adjusted color
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'RobotoSlab-Regular',
    },
    leagueItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginVertical: 5,
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
        borderColor: '#ddd',
        borderWidth: 1,
    },
    selectedLeague: {
        backgroundColor: '#DBB978',
    },
    unselectedLeague: {
        backgroundColor: '#fff',
    },
    leagueName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    leaguePoints: {
        fontSize: 16,
        color: '#666',
    },

});
// <Text style={styles.title}>{`${sheetName}`}</Text>
// <Text style={styles.sectionTitle}>Game:</Text>
// <View style={styles.headerContainer}>
//     <Text style={styles.headerTextPick}>Pick</Text>
//     <Text style={styles.headerTextPts}>Pts</Text>