import {
    Account,
    Avatars,
    Client,
    Databases,
    ID,
    Query,
    Storage,
} from "react-native-appwrite";

export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.brouha.Brouha',
    projectId: '667edab40004ed4257b4',
    databaseId: '667edc260009e0dfc309',
    userCollectionId: '667edc41000a189a99b7',
    leagueCollectionId: '667f063b0031bb581c29',
    weeklyLineupCollectionId: '66849fe200344a0e6da9',
    gameCollectionId: '66ad3e97000d65a8be9b',
    pickCollectionId: '6684a04a000e85542756',
    storageId: '667edd29003dd0cf6445'
}
// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Function to get an array of picks given a weekly lineup ID
export const getPicksByWeeklyLineup = async (weeklyLineupId) => {
    try {
        // First, get the weekly lineup document by its ID
        const weeklyLineup = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.weeklyLineupCollectionId,
            weeklyLineupId
        );

        if (!weeklyLineup || !weeklyLineup.picks) {
            console.error("Weekly lineup not found or it contains no picks.");
            return [];
        }

        // Retrieve each pick using the pick IDs stored in the weekly lineup
        const picks = [];
        for (const pickId of weeklyLineup.picks) {
            const pick = await databases.getDocument(
                appwriteConfig.databaseId,
                appwriteConfig.pickCollectionId,
                pickId
            );
            picks.push(pick);
        }

        return picks;
    } catch (error) {
        console.error("Error retrieving picks by weekly lineup:", error);
        throw error; // Rethrow the error after logging
    }
};
