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
        const picks = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.pickCollectionId,
            [
                Query.equal('week', week)
            ]
        );

        return picks.documents;
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