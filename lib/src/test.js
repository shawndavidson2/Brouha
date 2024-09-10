// Import necessary modules from the node-appwrite SDK
import { Client, Account, Databases, ID, Query } from 'node-appwrite';

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
            return;
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

// Function to calculate the weekly points for all users and build a league-user map
const calculateWeeklyPointsForAllUsers = async () => {
    try {
        // Initialize a map with league IDs as keys and user arrays as values
        const leagueUserMap = new Map();
        const leaguePointsMap = new Map();

        // Get all users from the database
        const allUsers = await getAllUsers();

        for (const user of allUsers) {
            try {
                // Get user's weekly lineup for Week 1
                const weeklyLineup = await getUserWeeklyLineup(1, user.$id);

                if (!weeklyLineup || !weeklyLineup.picks || weeklyLineup.picks.length === 0) {
                    //console.log(`User ${user.username} has no picks for Week 1.`);
                    continue;
                }

                // Get the picks by their IDs
                const picks = await getPicksByIds(weeklyLineup.picks);

                if (!picks || picks.length === 0) {
                    console.log(`User ${user.username} has no valid picks for Week 1.`);
                    continue;
                }

                // Calculate the total points for won picks
                let totalPoints = 0;
                picks.forEach(pick => {
                    if (pick.status === 'won') {
                        totalPoints += pick['potential-points'] || 0; // Add the points for won picks
                    }
                });

                // Print the user and their points, check against Appwrite data
                if (totalPoints !== user.weekPoints) {
                    console.log(`SOMETHING IS WRONG: User: ${user.username}, Week 1 Points: ${totalPoints}, On Appwrite: ${user.weekPoints}`);
                }

                // Check if the user is assigned to a league
                const leagueId = user.league.name; // Assuming `league` is a field in user document
                if (!leagueId) {
                    console.log(`User ${user.username} is not part of any league.`);
                    continue;
                }

                // Add the user's points to the user's document
                user.weekPoints = totalPoints;

                // Add the user to the corresponding league in the map
                if (!leagueUserMap.has(leagueId)) {
                    leagueUserMap.set(leagueId, []);
                    leaguePointsMap.set(leagueId, user.league['weekly-total-points'])
                }

                // Push the user into the league's array of users
                leagueUserMap.get(leagueId).push(user);

            } catch (err) {
                console.error(`Error processing user ${user.username}:`, err);
            }
        }

        // Return the league-user map
        return { leagueUserMap, leaguePointsMap };
    } catch (error) {
        console.error('Error calculating weekly points for users:', error);
    }
};

// Function to calculate the top 5 users' total week points in each league
const calculateTop5UsersPerLeague = (leagueUserMap, leaguePointsMap) => {
    try {
        // Iterate over the league-user map
        for (const [leagueId, users] of leagueUserMap.entries()) {
            // Sort users by their weekPoints in descending order
            const sortedUsers = users.sort((a, b) => (b.weekPoints || 0) - (a.weekPoints || 0));

            // Get the top 5 users
            const top5Users = sortedUsers.slice(0, 5);

            // Calculate the sum of their weekPoints
            const totalWeekPoints = top5Users.reduce((sum, user) => sum + (user.weekPoints || 0), 0);

            // Print the result
            if (totalWeekPoints !== leaguePointsMap.get(leagueId)) {
                console.log(`SOMETHING WRONG: League: ${leagueId},(Top 5 Users): ${totalWeekPoints}, ON APPWRITE: ${leaguePointsMap.get(leagueId)}`);
            }
        }
    } catch (error) {
        console.error("Error calculating top 5 users per league:", error);
    }
};

// Main function to orchestrate the process
const main = async () => {
    try {
        // Step 1: Calculate weekly points for all users and build the league-user map
        const { leagueUserMap, leaguePointsMap } = await calculateWeeklyPointsForAllUsers();

        // Step 2: Use the map to calculate the top 5 users' total week points per league
        calculateTop5UsersPerLeague(leagueUserMap, leaguePointsMap);
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
