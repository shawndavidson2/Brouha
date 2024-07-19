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


export const updateLeagueAttributes = async (league = null, attributes) => {
    try {
        let id = 0;
        if (!league) {
            const currentUser = await getCurrentUser();
            if (!currentUser) throw new Error('User not found');
            if (!currentUser.league) throw new Error('User is not part of any league');

            id = currentUser.league.$id;
        } else {
            id = league.$id;
        }

        const currentLeague = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.leagueCollectionId,
            id
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

export const createWeeklyLineup = async (picks, totalPotentialPoints, totalPointsEarned, weekNumber) => {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) throw new Error('User not found');

        const newWeeklyLineup = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.weeklyLineupCollectionId,
            ID.unique(),
            {
                picks: picks, // Assuming picks is an array of pick IDs or objects
                user: currentUser.$id,
                totalPotentialPoints: totalPotentialPoints,
                totalPointsEarned: totalPointsEarned,
                weekNumber: weekNumber
            }
        );

        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            currentUser.$id,
            {
                "weekly-lineup": [...currentUser["weekly-lineup"], newWeeklyLineup.$id]
            }
        );

        return { newWeeklyLineup, updatedUser };
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
};


export const getUserWeeklyLineup = async (weekNumber) => {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) throw new Error('User not found');

        const weeklyLineup = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.weeklyLineupCollectionId,
            [
                Query.equal('user', currentUser.$id),
                Query.equal('weekNumber', weekNumber)
            ]
        );

        if (weeklyLineup.documents.length === 0) throw Error()

        return weeklyLineup.documents[0]; // Assuming there is only one lineup per week per user
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
};

export const updatePickAttributes = async (pickId, attributes) => {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) throw new Error('User not found');
        if (!currentUser.league) throw new Error('User is not part of any league');

        const currentPick = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.pickCollectionId,
            pickId
        );

        const updatedPick = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.pickCollectionId,
            currentPick.$id,
            attributes
        );

        return updatedPick;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
};

export const getAllWeeklyLineups = async () => {
    try {
        const weeklyLineups = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.weeklyLineupCollectionId
        );

        return weeklyLineups.documents;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

export const getTotalPointsEarned = async (userId, weekNumber) => {
    try {
        const response = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.weeklyLineupCollectionId,
            [
                Query.equal('user', userId),
                Query.equal('weekNumber', weekNumber)
            ]
        );

        if (response.documents.length > 0) {
            return response.documents[0].totalPointsEarned || 0;
        } else {
            return 0;
        }
    } catch (error) {
        console.error('Failed to retrieve total points earned:', error);
        return 0;
    }
};

export const createPick = async (pickTitle, potentialPoints, status, game, date, time) => {
    try {
        const newPick = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.pickCollectionId,
            ID.unique(),
            {
                "pick-title": pickTitle,
                "potential-points": potentialPoints,
                status: status,
                game: game,
                date: date,
                time: time
            }
        );

        return newPick;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
};

export const deletePick = async (pickId) => {
    try {
        await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.pickCollectionId,
            pickId
        );

        return { success: true };
    } catch (error) {
        console.error('Error deleting pick:', error);
        throw new Error(error);
    }
};

export const updateWeeklyLineup = async (weekNumber, picks) => {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) throw new Error('User not found');

        const weeklyLineup = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.weeklyLineupCollectionId,
            [
                Query.equal('user', currentUser.$id),
                Query.equal('weekNumber', weekNumber)
            ]
        );

        if (weeklyLineup.documents.length === 0) return null;

        const updatedLineup = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.weeklyLineupCollectionId,
            weeklyLineup.documents[0].$id,
            { picks }  // Correctly pass the picks object to be updated
        );

        //currentUser["weekly-lineup"].push(updatedLineup)

        return { currentUser, updatedLineup };

    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
};



