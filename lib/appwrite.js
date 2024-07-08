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

// Register user
export async function createUser(email, password, username) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        );

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username);

        await signIn(email, password);

        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                username: username,
                email: email,
                avatar: avatarUrl,
                accountId: newAccount.$id,
                rankCategory: "Freshman",
                totalPoints: 0,
                weekPoints: 0,
                leagueRank: 9999,
                totalRank: 9999
            }
        );

        return newUser;
    } catch (error) {
        throw new Error(error);
    }
}

// Sign In
export const signIn = async (email, password) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);

        return session;
    } catch (error) {
        throw new Error(error);
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();

        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if (!currentUser) throw Error;

        return currentUser.documents[0];

    } catch (error) {
        console.log(error);
    }
}

// Sign Out
export async function signOut() {
    try {
        const session = await account.deleteSession("current");

        return session;
    } catch (error) {
        throw new Error(error);
    }
}

// Create and join league
export const createAndJoinLeague = async (leagueName) => {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) throw new Error('User not found');

        // Create a new league
        const newLeague = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.leagueCollectionId,
            ID.unique(),
            {
                name: leagueName,
                rank: 9999,
                'weekly-total-points': 0,
                'cumulative-total-points': 0,
                users: [currentUser.$id] // Initialize the league with the current user
            }
        );

        // Update the user's league field
        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            currentUser.$id,
            {
                league: newLeague.$id
            }
        );

        return { newLeague, updatedUser };
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
};


// Search for leagues by name
export const searchLeagues = async (leagueName) => {
    try {
        const leagues = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.leagueCollectionId,
            [Query.equal('name', leagueName)]
        );

        return leagues.documents;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

// Join an existing league
export const joinLeague = async (leagueId) => {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) throw new Error('User not found');

        // Validate league ID
        if (leagueId.length > 36 || !/^[a-zA-Z0-9_]+$/.test(leagueId) || leagueId.startsWith('_')) {
            throw new Error('Invalid league ID');
        }

        // Update the user's league field
        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            currentUser.$id,
            {
                league: leagueId
            }
        );

        // Add the user to the league's users array
        const league = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.leagueCollectionId,
            leagueId
        );

        const updatedLeague = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.leagueCollectionId,
            leagueId,
            {
                users: [...league.users, currentUser.$id]
            }
        );

        return { updatedUser, updatedLeague };
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
};



export const getCurrentLeague = async () => {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) throw new Error('User not found');
        if (!currentUser.league) throw new Error('User is not part of any league');


        const currentLeague = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.leagueCollectionId,
            currentUser.league.$id
        );

        if (!currentLeague) throw new Error('League not found');

        return currentLeague;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Function to get all users
export const getAllUsers = async () => {
    try {
        const users = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId
        );

        return users.documents;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

// Function to get all leagues
export const getAllLeagues = async () => {
    try {
        const leagues = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.leagueCollectionId
        );

        return leagues.documents;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

export const updateUserAttributes = async (attributes) => {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) throw new Error('User not found');

        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            currentUser.$id,
            attributes
        );

        return updatedUser;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
};


export const updateLeagueAttributes = async (attributes) => {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) throw new Error('User not found');
        if (!currentUser.league) throw new Error('User is not part of any league');

        const currentLeague = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.leagueCollectionId,
            currentUser.league.$id
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


