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

export const updateUserAttributes = async (user, attributes) => {
    try {
        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            user.$id,
            attributes
        );

        return updatedUser;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
};


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

        return updatedLeague;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
};