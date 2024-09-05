import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { useGlobalContext } from '../../context/GlobalProvider';
import { useRouter } from 'expo-router';

const LeagueParticipants = () => {
    const { league, user } = useGlobalContext();

    const router = useRouter();

    if (!user || !league) {
        return null; // Handle the case where user or league is not available
    }

    const leagueMembers = league.users.map(member =>
        member.username === user.username ? user : member
    );

    // Sort league members by weekPoints in descending order
    const sortedMembers = [...leagueMembers].sort((a, b) => b.weekPoints - a.weekPoints);

    // Split the sorted members into contributors and participants
    const contributors = sortedMembers.slice(0, 5);
    const participants = sortedMembers.slice(5);

    const handleUserPress = (leagueUser) => {
        router.push({
            pathname: '../profile',
            params: { leagueUser: JSON.stringify(leagueUser) },  // Convert to a string
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.sectionHeader}>League Contributors</Text>
            <Text style={styles.sectionSubHeader}>Top 5 scores add up to total</Text>
            <View style={styles.participantsContainer}>
                {contributors.map((contributor, index) => (
                    <TouchableOpacity
                        key={contributor.$id}
                        style={[
                            styles.participantRow,
                            contributor.username === user.username && styles.currentUser,
                        ]}
                        onPress={() => handleUserPress(contributor)} // Handle click event
                    >
                        <Text style={styles.rank}>{index + 1}.</Text>
                        <Text style={styles.memberText}>{contributor.username}</Text>
                        <Text style={styles.pointsText}>{contributor.weekPoints ?? 'Loading...'}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {participants.length > 0 && (
                <>
                    <Text style={styles.sectionHeader}>League Participants</Text>
                    <View style={styles.participantsContainer}>
                        {participants.map((participant, index) => (
                            <TouchableOpacity
                                key={participant.$id}
                                style={[
                                    styles.participantRow,
                                    participant.username === user.username && styles.currentUser,
                                ]}
                                onPress={() => handleUserPress(participant)} // Handle click event
                            >
                                <Text style={styles.rank}>{index + 1 + contributors.length}.</Text>
                                <Text style={styles.memberText}>{participant.username}</Text>
                                <Text style={styles.pointsText}>{participant.weekPoints ?? 'Loading...'}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 10,
        marginHorizontal: 20,
    },
    sectionHeader: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#333',
        textDecorationLine: 'underline',
        fontFamily: 'RobotoSlab-bold'
    },
    sectionSubHeader: {
        fontSize: 14,
        marginBottom: 5,
        color: '#656769',
        fontFamily: 'RobotoSlab-Regular'
    },
    participantsContainer: {},
    participantRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 7,
    },
    currentUser: {
        backgroundColor: '#DBB978', // Gold highlight for the current user
        borderColor: 'gray',       // Black border
        borderWidth: 3,             // Bold border
        paddingHorizontal: 26
    },
    rank: {
        fontSize: 20,
        marginRight: 8,
        fontFamily: 'RobotoSlab-Regular'
    },
    memberText: {
        fontSize: 20,
        flex: 1,
        color: '#333',
        fontFamily: 'RobotoSlab-Regular'
    },
    pointsText: {
        fontSize: 20,
        fontWeight: 'medium',
        textAlign: 'center',
        fontFamily: 'RobotoSlab-SemiBold'
    },
});

export default LeagueParticipants;
