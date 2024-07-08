import { View, Text } from 'react-native';
import React from 'react';
import { updateUserAttributes, updateLeagueAttributes } from '../lib/appwrite';


// Function to determine rank category based on total points
const getRankCategory = (totalPoints) => {
    if (totalPoints >= 75000) return 'Legend';
    if (totalPoints >= 60000) return 'HOF';
    if (totalPoints >= 40000) return 'All-Pro';
    if (totalPoints >= 30000) return 'Pro';
    if (totalPoints >= 20000) return 'Varsity';
    if (totalPoints >= 10000) return 'JV';
    return 'Freshman';
};


const UpdatePoints = async (points, user, setUser, league, setLeague) => {
    console.log("Hello!");
    const totalPoints = user.totalPoints + points;
    const weekPoints = user.weekPoints + points;
    const userAttributes = {
        totalPoints: totalPoints,
        weekPoints: weekPoints,
        rankCategory: getRankCategory(totalPoints)
        //leagueRank: calculataeLeagueRank(user, weekPoints, league),
        //totalRank: 1, // Example value, adjust as needed

    };
    const updatedUser = await updateUserAttributes(userAttributes);
    setUser(updatedUser);

    const leagueAttributes = {
        "weekly-total-points": league["weekly-total-points"] + points,
        "cumulative-total-points": league["cumulative-total-points"] + points
    };
    const updatedLeague = await updateLeagueAttributes(leagueAttributes);
    setLeague(updatedLeague);
    console.log("Hello2!");
}

export default UpdatePoints;
