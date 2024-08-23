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

// Function to acquire a lock
export const acquireLock = async (lockId) => {
    try {
        const lock = await databases.createDocument(appwriteConfig.databaseId, appwriteConfig.lockCollectionId, lockId, {
            acquiredAt: new Date().toISOString(),
        });
        return lock;
    } catch (error) {
        if (error.code === 409) { // 409 Conflict means the lock already exists
            throw new Error('Lock already acquired');
        } else {
            console.error('Failed to acquire lock:', error);
            throw new Error('Failed to acquire lock: ' + error.message);
        }
    }
};

// Function to release a lock
export const releaseLock = async (lockId) => {
    try {
        await databases.deleteDocument(appwriteConfig.databaseId, appwriteConfig.lockCollectionId, lockId);
    } catch (error) {
        console.error('Failed to release lock:', error);
        throw new Error('Failed to release lock: ' + error.message);
    }
};

// Function to retrieve league by ID
export const getLeagueById = async (leagueId) => {
    try {
        const league = await databases.getDocument(appwriteConfig.databaseId, appwriteConfig.leagueCollectionId, leagueId);
        return league;
    } catch (error) {
        console.error("Failed to retrieve league:", error);
        throw new Error("Failed to retrieve league: " + error.message);
    }
};

// Function to update user attributes in the user collection
export const updateUserAttributes = async (userId, attributes) => {
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
        throw new Error(error);
    }
};

// Function to update league attributes in the league collection
export const updateLeagueAttributes = async (league, attributes) => {
    try {
        const currentLeague = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.leagueCollectionId,
            league.$id
        );

        if (!currentLeague) throw new Error('League not found');

        const updatedLeague = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.leagueCollectionId,
            currentLeague.$id,
            attributes
        );

        return true;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
};

// Function to get a user's username, totalPoints, and weekPoints
export const getUserAttributes = async (userId) => {
    try {
        // Query the database for the user with the specified user ID
        const result = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('$id', userId)]
        );

        if (result.documents.length === 0) {
            throw new Error('User not found');
        }

        const user = result.documents[0];
        const { username, totalPoints, weekPoints, league } = user;

        return { username, totalPoints, weekPoints, league };
    } catch (error) {
        console.error("Failed to retrieve user attributes:", error);
        throw new Error("Failed to retrieve user attributes: " + error.message);
    }
};
