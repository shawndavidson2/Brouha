
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
        justifyContent: 'center',
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
});