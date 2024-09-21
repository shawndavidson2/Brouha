// Import necessary modules from the node-appwrite SDK and Node.js
import { Client, Databases, Query } from 'node-appwrite';

// Appwrite configuration
const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    projectId: '667edab40004ed4257b4',
    databaseId: '667edc260009e0dfc309',
    userCollectionId: '667edc41000a189a99b7',
    weeklyLineupCollectionId: '66849fe200344a0e6da9',
    pickCollectionId: '6684a04a000e85542756',
};

// Initialize the Appwrite Client
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId);

const databases = new Databases(client);

const updateUserAttributes = async (userId, attributes) => {
    try {
        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            userId,
            attributes
        );

        return true;
    } catch (error) {
        console.error(error);
        throw new Error(error.message || error);
    }
};

// Function to get all users
const getAllUsers = async () => {
    try {
        let allUsers = [];
        let lastUserId = null; // Used for cursor-based pagination
        const limit = 100;

        while (true) {
            const response = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.userCollectionId,
                lastUserId
                    ? [Query.cursorAfter(lastUserId), Query.limit(limit)]
                    : [Query.limit(limit)]
            );

            allUsers = allUsers.concat(response.documents);

            if (response.documents.length < limit) {
                break; // No more documents to fetch
            }

            lastUserId =
                response.documents[response.documents.length - 1].$id; // Update for next iteration
        }

        return allUsers;
    } catch (error) {
        console.error('Error fetching user details:', error);
        throw new Error(error);
    }
};

// Function to get all weekly lineups for a user
const getUserWeeklyLineups = async (userId) => {
    try {
        let allLineups = [];
        let lastLineupId = null;
        const limit = 100;

        while (true) {
            const response = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.weeklyLineupCollectionId,
                [
                    Query.equal('user', userId),
                    lastLineupId
                        ? Query.cursorAfter(lastLineupId)
                        : undefined,
                    Query.limit(limit),
                ].filter(Boolean)
            );

            allLineups = allLineups.concat(response.documents);

            if (response.documents.length < limit) {
                break;
            }

            lastLineupId =
                response.documents[response.documents.length - 1].$id;
        }

        return allLineups;
    } catch (error) {
        console.error('Error retrieving weekly lineups:', error);
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
                    console.error(
                        `Failed to fetch pick with ID ${pickId}:`,
                        error
                    );
                    return null;
                }
            })
        );
        return picks.filter((pick) => pick !== null);
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

        // Step 2: Process each user
        for (const user of allUsers) {
            const userId = user.$id;
            const username = user.username || 'Unnamed User';

            // Get all weekly lineups for the user
            const weeklyLineups = await getUserWeeklyLineups(userId);

            let bestWeek = null;
            let highestPoints = 0;
            let totalWonPicks = 0;
            let totalLostPicks = 0;

            // Process each weekly lineup
            for (const lineup of weeklyLineups) {
                const weekNumber = lineup.weekNumber;
                const pickIds = lineup.picks || [];

                if (pickIds.length === 0) {
                    continue;
                }

                // Get the picks
                const picks = await getPicksByIds(pickIds);

                // Calculate total points for this week
                let weekPoints = 0;
                for (const pick of picks) {
                    if (pick.status === 'won') {
                        weekPoints += pick['potential-points'] || 0;
                        totalWonPicks += 1;
                    } else if (pick.status === 'lost') {
                        totalLostPicks += 1;
                    }
                }

                // Update best week if this week's points are higher
                if (weekPoints > highestPoints) {
                    highestPoints = weekPoints;
                    bestWeek = weekNumber;
                }
            }

            // Print out the stats for the user
            console.log(`User: ${username}`);
            console.log(`Best Week: ${bestWeek || 'N/A'}`);
            console.log(`Highest Points in Best Week: ${highestPoints}`);
            console.log(`Total Picks Won: ${totalWonPicks}`);
            console.log(`Total Picks Lost: ${totalLostPicks}`);
            console.log('-----------------------------');

            const userAttributes = {
                bestWeek: highestPoints || 0,
                numPicksWon: totalWonPicks,
                numPicksLost: totalLostPicks,
            };

            await updateUserAttributes(userId, userAttributes);
        }

        console.log('Processing completed.');
    } catch (error) {
        console.error('Error in main function:', error);
    }
};

// Call the main function
main().catch((error) => {
    console.error('Error occurred during the process:', error);
});
