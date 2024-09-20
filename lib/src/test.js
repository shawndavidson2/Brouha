// Import necessary modules from the node-appwrite SDK and Node.js
import { Client, Account, Databases, ID, Query } from 'node-appwrite';
import fs from 'fs'; // Import the File System module

// Appwrite configuration
const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.brouha.Brouha',
    projectId: '667edab40004ed4257b4',
    databaseId: '667edc260009e0dfc309',
    userCollectionId: '667edc41000a189a99b7',
    weeklyLineupCollectionId: '66849fe200344a0e6da9',
    pickCollectionId: '6684a04a000e85542756',
    leagueCollectionId: '667f063b0031bb581c29'
};

const weekNum = 3; // Adjust as needed

// Initialize the Appwrite Client
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId);

const account = new Account(client);
const databases = new Databases(client);

// Function to get all users
const getAllUsers = async () => {
    try {
        let allUsers = [];
        let lastUserId = null; // Used for cursor-based pagination
        const limit = 1000;

        while (true) {
            const response = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.userCollectionId,
                lastUserId ? [Query.cursorAfter(lastUserId), Query.limit(limit)] : [Query.limit(limit)]
            );

            allUsers = allUsers.concat(response.documents);

            if (response.documents.length < limit) {
                break; // No more documents to fetch
            }

            lastUserId = response.documents[response.documents.length - 1].$id; // Update for next iteration
        }

        return allUsers;
    } catch (error) {
        console.error("Error fetching user details:", error);
        throw new Error(error);
    }
};

// Function to get a user's weekly lineup by week number
const getUserWeeklyLineup = async (weekNumber, userId) => {
    try {
        const weeklyLineup = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.weeklyLineupCollectionId,
            [
                Query.equal('user', userId),
                Query.equal('weekNumber', weekNumber)
            ]
        );
        if (weeklyLineup.documents.length === 0) {
            return null;
        }
        return weeklyLineup.documents[0];
    } catch (error) {
        console.error("Error retrieving weekly lineup:", error);
        throw error;
    }
};

// Function to get picks by their IDs
const getPicksByIds = async (pickIds) => {
    try {
        const picks = await Promise.all(
            pickIds.map(async (pickId) => {
                try {
                    return await databases.getDocument(
                        appwriteConfig.databaseId,
                        appwriteConfig.pickCollectionId,
                        pickId
                    );
                } catch (error) {
                    console.error(`Failed to fetch pick with ID ${pickId}:`, error);
                    return null;
                }
            })
        );
        return picks.filter(pick => pick !== null);
    } catch (error) {
        console.error('Failed to retrieve picks:', error);
        throw error;
    }
};

// Main function to orchestrate the process
const main = async () => {
    try {
        // Step 1: Get all users from the database
        const allUsers = await getAllUsers();

        // Step 2: Initialize maps to hold user and league data
        const userPointsMap = new Map(); // Map userId to user data
        const leaguePointsMap = new Map(); // Map leagueId to league data

        // Initialize userPointsMap with zero values
        for (const user of allUsers) {
            userPointsMap.set(user.$id, {
                user: user, // Store the user document
                totalPoints: 0, // Total points across all weeks
                weekPoints: {} // Map weekNum to weekPoints
            });
        }

        // Prepare data structures to store output data
        const weeklyUserRankings = {}; // { weekNum: [{username, weekPoints}, ...] }
        const weeklyLeagueRankings = {}; // { weekNum: [{leagueName, weeklyTotalPoints}, ...] }

        // Loop over each week up to weekNum
        for (let week = 1; week <= weekNum; week++) {
            console.log(`Processing Week ${week}...`);

            // Process each user's picks for the current week
            for (const user of allUsers) {
                const userId = user.$id;
                const userData = userPointsMap.get(userId);

                // Initialize weekPoints[week] to 0
                userData.weekPoints[week] = 0;

                // Get user's weekly lineup for the current week
                const weeklyLineup = await getUserWeeklyLineup(week, userId);

                if (!weeklyLineup || !weeklyLineup.picks || weeklyLineup.picks.length === 0) {
                    // User has no picks for this week
                    continue;
                }

                // Get the picks by their IDs
                const picks = await getPicksByIds(weeklyLineup.picks);

                if (!picks || picks.length === 0) {
                    // User has no valid picks for this week
                    continue;
                }

                // Calculate the total points for won picks for this week
                let weekPoints = 0;
                picks.forEach(pick => {
                    if (pick.status === 'won') {
                        weekPoints += pick['potential-points'] || 0;
                    }
                });

                // Update user's points in the map
                userData.weekPoints[week] = weekPoints;
                userData.totalPoints += weekPoints;

                // Update the map with the new userData
                userPointsMap.set(userId, userData);
            }

            // Build league-user mapping for the current week
            for (const [userId, userData] of userPointsMap.entries()) {
                // Check if user has a league and if league.$id exists
                const league = userData.user.league;
                const leagueId = league && league.$id;

                if (!leagueId) {
                    // Optionally log or handle users without a league
                    continue;
                }

                // Initialize league data if it doesn't exist
                if (!leaguePointsMap.has(leagueId)) {
                    // Fetch the league document
                    const leagueDoc = await databases.getDocument(
                        appwriteConfig.databaseId,
                        appwriteConfig.leagueCollectionId,
                        leagueId
                    );

                    leaguePointsMap.set(leagueId, {
                        league: leagueDoc,
                        weeklyTotalPoints: {}, // Map weekNum to weeklyTotalPoints
                        cumulativeTotalPoints: 0,
                        users: []
                    });
                }

                // Add user to the league's user list for this week
                const leagueData = leaguePointsMap.get(leagueId);

                leagueData.users.push({
                    userId: userId,
                    weekPoints: userData.weekPoints[week] || 0,
                    username: userData.user.username
                });

                leaguePointsMap.set(leagueId, leagueData);
            }

            // Collect data for rankings
            const userRankings = []; // For this week
            const leagueRankings = []; // For this week

            // Calculate weekly and cumulative points for each league
            for (const [leagueId, leagueData] of leaguePointsMap.entries()) {
                // Ensure we only consider users who have weekPoints for this week
                const usersWithPoints = leagueData.users.filter(u => (u.weekPoints || 0) >= 0); // Include users with 0 points

                // Sort users by weekPoints in descending order
                const sortedUsers = usersWithPoints.sort((a, b) => (b.weekPoints || 0) - (a.weekPoints || 0));

                // Get the top 5 users
                const top5Users = sortedUsers.slice(0, 5);

                // Calculate the total week points for the top 5 users
                const totalWeekPoints = top5Users.reduce((sum, user) => sum + (user.weekPoints || 0), 0);

                // Update league's weekly and cumulative points
                leagueData.weeklyTotalPoints[week] = totalWeekPoints;
                leagueData.cumulativeTotalPoints += totalWeekPoints;

                // Collect league ranking data
                leagueRankings.push({
                    leagueName: leagueData.league.name,
                    weeklyTotalPoints: totalWeekPoints
                });

                // Reset users array for the next week
                leagueData.users = [];
                leaguePointsMap.set(leagueId, leagueData);
            }

            // Collect user rankings
            for (const [userId, userData] of userPointsMap.entries()) {
                const weekPoints = userData.weekPoints[week] || 0;
                userRankings.push({
                    username: userData.user.username,
                    weekPoints: weekPoints
                });
            }

            // Sort user rankings in decreasing order
            userRankings.sort((a, b) => b.weekPoints - a.weekPoints);

            // Sort league rankings in decreasing order
            leagueRankings.sort((a, b) => b.weeklyTotalPoints - a.weeklyTotalPoints);

            // Store rankings for this week
            weeklyUserRankings[week] = userRankings;
            weeklyLeagueRankings[week] = leagueRankings;

            // Validation Logic
            // Validate league data only when we reach weekNum
            if (week === weekNum) {
                for (const [leagueId, leagueData] of leaguePointsMap.entries()) {
                    const leagueWeeklyTotalPoints = leagueData.league['weekly-total-points'] || 0;
                    const leagueCumulativeTotalPoints = leagueData.league['cumulative-total-points'] || 0;
                    const calculatedWeeklyTotalPoints = leagueData.weeklyTotalPoints[week] || 0;
                    const calculatedCumulativeTotalPoints = leagueData.cumulativeTotalPoints || 0;

                    // Validate weekly-total-points against Appwrite data
                    if (leagueWeeklyTotalPoints !== calculatedWeeklyTotalPoints) {
                        console.log(`SOMETHING WRONG: League: ${leagueData.league.name}, Week ${week} Total Points: ${calculatedWeeklyTotalPoints}, On Appwrite: ${leagueWeeklyTotalPoints}`);
                    }

                    // Validate cumulative-total-points against Appwrite data
                    if (leagueCumulativeTotalPoints !== calculatedCumulativeTotalPoints) {
                        console.log(`SOMETHING WRONG: League: ${leagueData.league.name}, Cumulative Total Points: ${calculatedCumulativeTotalPoints}, On Appwrite: ${leagueCumulativeTotalPoints}`);
                    }
                }
            }
        }

        // After processing all weeks, validate users' totalPoints and weekPoints
        for (const [userId, userData] of userPointsMap.entries()) {
            const user = userData.user;

            // Validate totalPoints against Appwrite data
            const userTotalPoints = user.totalPoints || 0;
            if (userTotalPoints !== userData.totalPoints) {
                console.log(`SOMETHING IS WRONG: User: ${user.username}, Calculated Total Points: ${userData.totalPoints}, On Appwrite: ${userTotalPoints}`);
            }

            // Validate weekPoints for the last week
            const userWeekPoints = user.weekPoints || 0;
            const calculatedWeekPoints = userData.weekPoints[weekNum] || 0;

            if (userWeekPoints !== calculatedWeekPoints) {
                console.log(`SOMETHING IS WRONG: User: ${user.username}, Week ${weekNum} Points: ${calculatedWeekPoints}, On Appwrite: ${userWeekPoints}`);
            }
        }

        // After processing all weeks, write the data to a text file
        let output = '';

        for (let week = 1; week <= weekNum; week++) {
            output += `Week ${week} Rankings\n`;
            output += '========================\n\n';

            // User Rankings
            output += `User Rankings for Week ${week}:\n`;
            output += '------------------------\n';
            const userRankings = weeklyUserRankings[week];
            userRankings.forEach((user, index) => {
                output += `${index + 1}. ${user.username} - ${user.weekPoints} points\n`;
            });
            output += '\n';

            // League Rankings
            output += `League Rankings for Week ${week}:\n`;
            output += '------------------------\n';
            const leagueRankings = weeklyLeagueRankings[week];
            leagueRankings.forEach((league, index) => {
                output += `${index + 1}. ${league.leagueName} - ${league.weeklyTotalPoints} points\n`;
            });
            output += '\n\n';
        }

        // Write the output to a text file
        fs.writeFileSync('weekly_rankings.txt', output);
        console.log('Rankings have been written to weekly_rankings.txt');

        console.log("Processing completed.");

    } catch (error) {
        console.error("Error in main function:", error);
    }
};

// Call the main function
main()
    .then(() => {
        console.log("League-user mapping and calculations completed.");
    })
    .catch((error) => {
        console.error("Error occurred during the process:", error);
    });
