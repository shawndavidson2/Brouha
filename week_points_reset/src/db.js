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
            await createWeeklyLineup(user, [], weekNum)
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

export const createWeeklyLineup = async (user, picks, weekNumber) => {
    try {
        const newWeeklyLineup = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.weeklyLineupCollectionId,
            ID.unique(),
            {
                picks: picks, // Assuming picks is an array of pick IDs or objects
                user: user.$id,
                totalPotentialPoints: 0,
                weekNumber: weekNumber
            }
        );

        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            user.$id,
            {
                "weekly-lineup": [...user["weekly-lineup"], newWeeklyLineup.$id]
            }
        );

        return { newWeeklyLineup, updatedUser };
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
};