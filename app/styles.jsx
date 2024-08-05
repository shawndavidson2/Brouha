
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
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    leaderboardItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    rank: {
        width: 40,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    name: {
        flex: 1,
        textAlign: 'left',
    },
    points: {
        width: 80,
        textAlign: 'right',
        fontWeight: 'bold',
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
    },
    gameText: {
        fontSize: 14,
        color: '#555',
    },
    pointsText: {
        fontSize: 16,
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
    },
    totalPointsText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    earnedPointsText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'green',
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
    },
    headerTextPts: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
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
                // <Text style={styles.title}>{`${sheetName}`}</Text>
                // <Text style={styles.sectionTitle}>Game:</Text>
                // <View style={styles.headerContainer}>
                //     <Text style={styles.headerTextPick}>Pick</Text>
                //     <Text style={styles.headerTextPts}>Pts</Text>