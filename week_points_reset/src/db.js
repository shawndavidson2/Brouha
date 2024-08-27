// Using the Appwrite Node.js SDK
import { Client, Databases, Query } from 'node-appwrite';

// Configuration settings
const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    projectId: '667edab40004ed4257b4',
    databaseId: '667edc260009e0dfc309',
    userCollectionId: '667edc41000a189a99b7',
    leagueCollectionId: '667f063b0031bb581c29',
    weeklyLineupCollectionId: '66849fe200344a0e6da9',
    gameCollectionId: '66ad3e97000d65a8be9b',
    pickCollectionId: '6684a04a000e85542756',
    lockCollectionId: '66c91b6e003d1bd13aa5', // Added lock collection ID
    storageId: '667edd29003dd0cf6445'
};

// Initialize your Appwrite SDK
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint) // Set your project endpoint
    .setProject(appwriteConfig.projectId); // Your project ID

const databases = new Databases(client);

export const resetWeek = async (weekNum) => {
    try {
        // Reset weekPoints for each user
        const users = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.userCollectionId);
        for (const user of users.documents) {
            console.log(user.username)
            await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.userCollectionId, user.$id, {
                weekPoints: 0
            });

            await checkOrCreateWeeklyLineup(weekNum, user.$id)
        }

        // Reset weekly-total-points for each league
        const leagues = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.leagueCollectionId);
        for (const league of leagues.documents) {
            await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.leagueCollectionId, league.$id, {
                'weekly-total-points': 0
            });
        }

        console.log("Week points for users and leagues have been reset.");
    } catch (error) {
        console.error("Error resetting week points:", error);
        throw error;
    }
};

export const checkOrCreateWeeklyLineup = async (weekNumber, userId = null) => {
    try {
        let userIdentifier = userId;

        // If no userId is provided, fetch the current user's ID
        if (!userId) {
            const currentUser = await getCurrentUser();
            if (!currentUser) { return; }
            userIdentifier = currentUser.$id;
        }

        // Check if the user already has a lineup for the specified week
        const existingLineup = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.weeklyLineupCollectionId,
            [
                Query.equal('user', userIdentifier),
                Query.equal('weekNumber', weekNumber)
            ]
        );

        // If a lineup exists, return it
        if (existingLineup.documents.length > 0) {
            return existingLineup.documents[0];
        }

        // If no lineup exists, create a new one
        const newLineup = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.weeklyLineupCollectionId,
            ID.unique(),
            {
                picks: [], // Initialize with an empty array of picks
                user: userIdentifier,
                totalPotentialPoints: 0,
                weekNumber: weekNumber
            }
        );

        // Update the user's "weekly-lineup" field with the new lineup ID
        await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            userIdentifier,
            {
                "weekly-lineup": [...(existingLineup.documents.length > 0 ? existingLineup.documents[0]["weekly-lineup"] : []), newLineup.$id]
            }
        );

        return newLineup;
    } catch (error) {
        console.log("Error in checkOrCreateWeeklyLineup:", error);
        return;
    }
};