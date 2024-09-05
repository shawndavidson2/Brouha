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
    weekCollectionId: '66b0de5400218e0d26c8',
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
                accountId: newAccount.$id,
                rankCategory: "Freshman",
                totalPoints: 0,
                weekPoints: 0,
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
                'weekly-total-points': 0,
                'cumulative-total-points': 0,
                'previous-week-points': 0,
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

export const isLeagueNameUnique = async (leagueName) => {
    try {
        const existingLeagues = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.leagueCollectionId,
            [
                Query.equal('name', leagueName.trim())
            ]
        );

        return existingLeagues.total === 0;
    } catch (error) {
        console.error("Error checking league name uniqueness:", error);
        throw new Error('Unable to check league name uniqueness.');
    }
};


// Search for leagues by name that start with the input string
export const searchLeagues = async (leagueName) => {
    try {
        const leagues = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.leagueCollectionId,
            [Query.search('name', `^${leagueName}`)]
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
        if (!currentUser.league) {
            console.log('User is not part of any league');
            return
        }


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

export const getAllUsersForLeaderboard = async () => {
    try {
        let allUsers = [];
        let lastUserId = null; // Used for cursor-based pagination
        const limit = 1000;

        while (true) {
            const response = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.userCollectionId,
                lastUserId ? [Query.cursorAfter(lastUserId), Query.limit(limit)] : [Query.limit(limit)]
            );

            allUsers = allUsers.concat(response.documents);

            if (response.documents.length < limit) {
                break; // No more documents to fetch
            }

            lastUserId = response.documents[response.documents.length - 1].$id; // Update for next iteration
        }

        return allUsers.map(user => ({
            name: user.username,
            totalPoints: user.totalPoints,
            username: user.username,
            $id: user.$id
        }));
    } catch (error) {
        console.error("Error fetching user details:", error);
        throw new Error(error);
    }
};


export const getAllLeaguesForLeaderboard = async () => {
    try {
        let allLeagues = [];
        let lastLeagueId = null; // Used for cursor-based pagination
        const limit = 1000; // Increase this if the backend supports higher limits

        // Fetch leagues using pagination
        while (true) {
            const response = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.leagueCollectionId,
                lastLeagueId ? [Query.cursorAfter(lastLeagueId), Query.limit(limit)] : [Query.limit(limit)]
            );

            // Map and collect only needed fields directly in the loop
            const mappedLeagues = response.documents.map(league => ({
                name: league.name,
                'cumulative-total-points': league['cumulative-total-points'],
                rank: league.rank,
                $id: league.$id,
                numUsers: league.users.length
            }));

            allLeagues = allLeagues.concat(mappedLeagues);

            // Break if no more documents to fetch
            if (response.documents.length < limit) {
                break;
            }

            lastLeagueId = response.documents[response.documents.length - 1].$id; // Update cursor for next iteration
        }

        return allLeagues;
    } catch (error) {
        console.error("Error fetching league details:", error);
        throw new Error(error);
    }
};




export const updateUserAttributes = async (attributes) => {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            console.log('User not found');
            return;
        }

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


export const getUserWeeklyLineup = async (weekNumber, userId = null) => {
    try {
        let userIdentifier = userId; // Start by assuming the userId is directly provided

        // If no userId is provided, fetch the current user's ID
        if (!userId) {
            const currentUser = await getCurrentUser();
            if (!currentUser) throw new Error('User not found');
            userIdentifier = currentUser.$id;
        }

        // Fetch all documents from the weekly lineup collection that match the user ID and week number
        const weeklyLineup = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.weeklyLineupCollectionId,
            [
                Query.equal('user', userIdentifier),
                Query.equal('weekNumber', weekNumber)
            ]
        );

        // Check if any documents are found
        if (weeklyLineup.documents.length === 0) throw new Error("No weekly lineup found for the given user and week.");

        // Assuming there is only one lineup per week per user
        return weeklyLineup.documents[0];
    } catch (error) {
        console.error("Error retrieving weekly lineup:", error);
        throw error; // Rethrow the error after logging
    }
};

export const updatePick = async (pickTitle, potentialPoints, userId, weekNum) => {
    try {
        // Query the database for the pick with the specified title and potential points
        const result = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.pickCollectionId,
            [
                Query.equal('pick-title', pickTitle),
                Query.equal('week', weekNum),
                Query.equal('potential-points', potentialPoints)
            ]
        );

        if (result.documents.length === 0) {
            console.log('No pick found with the specified title and potential points.');
            return null; // No pick found
        }

        const pick = result.documents[0];
        const existingUsers = pick.users || [];


        // Check if the user ID is already in the array to avoid duplicates
        if (!existingUsers.includes(userId)) {
            existingUsers.push(userId);

            console.log(existingUsers)

            // Update the document with the new users array
            const updatedPick = await databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.pickCollectionId,
                pick.$id,
                { users: existingUsers }
            );

            return updatedPick;
        } else {
            console.log('User ID already exists in the users array.');
            return pick; // Return the pick as is since the user ID is already included
        }
    } catch (error) {
        console.error('Failed to update pick:', error);
        throw error;
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

// Function to get multiple picks given an array of pick IDs
export const getPicksByIds = async (pickIds) => {
    try {
        if (!pickIds.length) {
            console.log("No pick IDs provided.");
            return [];
        }

        // Fetch all picks in parallel using Promise.all
        const picks = await Promise.all(
            pickIds.map(async (pickId) => {
                try {
                    return await databases.getDocument(
                        appwriteConfig.databaseId,
                        appwriteConfig.pickCollectionId,
                        pickId
                    );
                } catch (error) {
                    console.error(`Failed to fetch pick with ID ${pickId}:`, error);
                    return null; // Return null or handle the error in some way
                }
            })
        );

        // Filter out any failed requests (i.e., null values)
        return picks.filter(pick => pick !== null);
    } catch (error) {
        console.error('Failed to retrieve picks:', error);
        throw error;
    }
};


export const getAllWeeklyLineups = async (userId = null) => {
    try {
        let currentUserId = userId;
        if (!currentUserId) {
            const currentUser = await getCurrentUser();
            currentUserId = currentUser.$id
        }
        const weeklyLineups = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.weeklyLineupCollectionId,
            [Query.equal('user', currentUserId)] // Filter by user.id
        );

        return weeklyLineups.documents;
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
};

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

export const createPick = async (pickTitle, potentialPoints, statusLetter, game, date, time, week) => {
    try {
        const status = statusLetter === "W" ? "won" : statusLetter === "L" ? "lost" : "pending"
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
                time: time,
                week: week
            }
        );

        return newPick;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
};

export const removePickFromWeeklyLineup = async (pickId, userId, weekNumber, pts) => {
    try {
        // Retrieve the existing pick document
        const pick = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.pickCollectionId,
            pickId
        );


        if (!pick) {
            console.log('Pick not found.');
            return null; // Pick not found
        }

        const existingUsers = pick.users || [];
        const updatedUsers = existingUsers.filter(user => user !== userId);

        // Update the pick document with the new users array
        const updatedPick = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.pickCollectionId,
            pick.$id,
            { users: updatedUsers }
        );

        // Find the weekly lineup by week number and user ID
        const lineups = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.weeklyLineupCollectionId,
            [
                Query.equal('weekNumber', weekNumber),
                Query.equal('user', userId)
            ]
        );

        if (lineups.documents.length > 0) {
            const weeklyLineup = lineups.documents[0];

            //const currentTotalPotentialPoints = weeklyLineup.totalPotentialPoints || 0;
            //const newTotalPotentialPoints = currentTotalPotentialPoints - pts;
            const updatedPicks = weeklyLineup.picks.filter(pick => pick !== pickId);

            // Update the weekly lineup document to remove the pick
            await databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.weeklyLineupCollectionId,
                weeklyLineup.$id,
                {
                    picks: updatedPicks,
                    //totalPotentialPoints: newTotalPotentialPoints // Update total potential points
                }
            );
        }

        return updatedPick;
    } catch (error) {
        console.error('Failed to remove pick from weekly lineup:', error);
        throw error;
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

export const updateWeeklyLineup = async (userId, weekNumber, picks, pts) => {
    try {
        // const currentUser = await getCurrentUser();
        // if (!currentUser) throw new Error('User not found');

        const weeklyLineup = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.weeklyLineupCollectionId,
            [
                Query.equal('user', userId),
                Query.equal('weekNumber', weekNumber)
            ]
        );

        if (weeklyLineup.documents.length === 0) return null;

        // Calculate new totalPotentialPoints by adding pts to the existing value
        //const currentTotalPotentialPoints = weeklyLineup.documents[0].totalPotentialPoints || 0;
        //const newTotalPotentialPoints = currentTotalPotentialPoints + pts;

        const id = weeklyLineup.documents[0].$id;

        // Update the document with the new picks and new total potential points
        const updatedLineup = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.weeklyLineupCollectionId,
            id,
            {
                picks: picks,
                //totalPotentialPoints: 0 // Update total potential points
            }
        );

        if (!updatedLineup) console.error("Lineup wasn't updated!!")

        return updatedLineup;

    } catch (error) {
        console.error('Failed to update weekly lineup:', error);
        throw error;
    }
};

export const createGame = async (gameTitle, gameWeek) => {
    try {
        // Check if a game with the same title and week already exists
        const existingGames = await databases.listDocuments(
            appwriteConfig.databaseId,
            '66ad3e97000d65a8be9b', // Collection ID for games
            [
                Query.equal('title', gameTitle),
                Query.equal('week', gameWeek)
            ]
        );

        // If a game exists with the same title and week, return false
        if (existingGames.documents.length > 0) {
            return false;
        }

        // If no game exists, create a new one
        const newGame = await databases.createDocument(
            appwriteConfig.databaseId,
            '66ad3e97000d65a8be9b', // Collection ID for games
            ID.unique(), // Generate a unique ID for the new game document
            {
                title: gameTitle, // Game data with title
                week: gameWeek   // Game data with week
            }
        );

        console.log('New game created:', newGame);
        return true;
    } catch (error) {
        console.error('Failed to create or check game:', error);
        throw new Error(error);
    }
};

// Function to check and update week number
export const checkAndUpdateWeekNum = async (weekNum) => {
    try {
        // Assuming there is only one document in the weekCollection
        const result = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.weekCollectionId);

        if (result.documents.length > 0) {
            const currentWeekDocument = result.documents[0];
            if (currentWeekDocument.weekNum === weekNum) {
                return false; // Week number is the same, no update needed
            } else {
                // Update the week number
                await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.weekCollectionId, currentWeekDocument.$id, {
                    weekNum: weekNum
                });
                return true; // Week number updated
            }
        } else {
            throw new Error("No week number document found.");
        }
    } catch (error) {
        console.error("Error accessing the week number document:", error);
        throw error;
    }
};

export const getAllFilenamesFromStorage = async () => {
    try {
        const filesList = await storage.listFiles(appwriteConfig.storageId);

        //const filenames = filesList.files.map(file => file.name);

        return filesList;
    } catch (error) {
        console.error("Error retrieving filenames:", error);
        throw new Error(error);
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
