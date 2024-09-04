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
    weekCollectionId: '66b0de5400218e0d26c8',
    storageId: '667edd29003dd0cf6445'
};

// Initialize your Appwrite SDK
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint) // Set your project endpoint
    .setProject(appwriteConfig.projectId); // Your project ID

const databases = new Databases(client);

export const getPicksByWeek = async (week) => {
    try {
        let allPicks = [];
        let offset = 0;
        const limit = 10000; // Set to maximum allowed limit

        while (true) {
            const picks = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.pickCollectionId,
                [
                    Query.equal('week', week),
                    Query.limit(limit),
                    Query.offset(offset)
                ]
            );

            allPicks = allPicks.concat(picks.documents);

            if (picks.documents.length < limit) {
                break; // No more documents to fetch
            }

            offset += limit; // Move to the next batch
        }

        return allPicks;
    } catch (error) {
        console.error('Failed to retrieve picks by week:', error);
        throw error;
    }
};


export const updatePickStatus = async (statusLetter, pickId) => {
    try {
        const status = statusLetter === "W" ? "won" : "lost"
        // Update the pick's status
        const updatedPick = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.pickCollectionId,
            pickId,
            { status: status }
        );
    } catch (error) {
        console.error(`Failed to update pick status for ${pickId}:`, error);
        throw error;
    }
};

export const getWeekNum = async () => {
    try {
        const week = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.weekCollectionId
        );

        return week.documents[0];
    } catch (error) {
        console.error('Failed to retrieve picks by week:', error);
        throw error;
    }
};