import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { useGlobalContext } from '../../context/GlobalProvider';

const LeagueParticipants = () => {
    const { league, user } = useGlobalContext();

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

    return (
        <View style={styles.container}>
            <Text style={styles.sectionHeader}>League Contributors</Text>
            <View style={styles.participantsContainer}>
                {contributors.map((contributor, index) => (
                    <View key={contributor.$id} style={[styles.participantRow, index === 0 && styles.firstPlace]}>
                        <Text style={styles.rank}>{index + 1}</Text>
                        <Text style={styles.memberText}>{contributor.username}</Text>
                        <Text style={styles.pointsText}>{contributor.weekPoints ?? 'Loading...'}</Text>
                    </View>
                ))}
            </View>

            {participants.length > 0 && (
                <>
                    <Text style={styles.sectionHeader}>League Participants</Text>
                    <View style={styles.participantsContainer}>
                        {participants.map((participant, index) => (
                            <View key={participant.$id} style={styles.participantRow}>
                                <Text style={styles.rank}>{index + 1 + contributors.length}</Text>
                                <Text style={styles.memberText}>{participant.username}</Text>
                                <Text style={styles.pointsText}>{participant.weekPoints ?? 'Loading...'}</Text>
                            </View>
                        ))}
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fefcf9',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    sectionHeader: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#8b2326',
        marginBottom: 10,
    },
    participantsContainer: {
        marginBottom: 20,
    },
    participantRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    firstPlace: {
        backgroundColor: '#DBB978',
        borderRadius: 5,
        paddingVertical: 12,
    },
    rank: {
        width: 30,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        color: '#343434',
    },
    memberText: {
        flex: 1,
        fontSize: 18,
        color: '#343434',
        marginLeft: 10,
    },
    pointsText: {
        width: 80,
        textAlign: 'right',
        fontWeight: 'bold',
        fontSize: 18,
        color: '#343434',
    },
});

export default LeagueParticipants;
