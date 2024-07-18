import { View, Text, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { getTotalPointsEarned } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';

const LeagueParticipants = () => {

    const { league, user } = useGlobalContext();


    const leagueMembers = league.users.map(member =>
        member.username === user.username ? user : member);

    // Sort league members by weekPoints in descending order
    const sortedMembers = [...leagueMembers].sort((a, b) => b.weekPoints - a.weekPoints);

    // Split the sorted members into contributors and participants
    const contributors = sortedMembers.slice(0, 5);
    const participants = sortedMembers.slice(5);

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.header}>League Contributors</Text>
                <Text style={styles.header}>Points</Text>
            </View>
            <View style={styles.section}>
                {contributors.map((contributor, index) => (
                    <View key={contributor.$id} style={styles.row}>
                        <Text style={styles.memberText}>{index + 1}. {contributor.username}</Text>
                        <Text style={styles.pointsText}>{contributor.weekPoints ?? 'Loading...'}</Text>
                    </View>
                ))}
            </View>
            {participants.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.header}>League Participants</Text>
                    {participants.map((participant, index) => (
                        <View key={participant.$id} style={styles.row}>
                            <Text style={styles.memberText}>{index + 1 + contributors.length}. {participant.username}</Text>
                            <Text style={styles.pointsText}>{participant.weekPoints ?? 'Loading...'}</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        width: '90%',
        marginTop: 30,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    section: {
        marginBottom: 20,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    memberText: {
        marginLeft: 20,
        fontSize: 20,
    },
    pointsText: {
        fontSize: 20,
        textAlign: 'center',
    },
});

export default LeagueParticipants;
