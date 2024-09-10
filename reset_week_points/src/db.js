// Using the Appwrite Node.js SDK
import { Client, Databases, Query, ID } from 'node-appwrite';

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

export const getAllUsers = async () => {
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

        return allUsers;
    } catch (e) {
        console.error("Error fetching user details: " + e);
        throw new Error(e);
    }
};


export const getAllLeagues = async () => {
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
            const mappedLeagues = response.documents;

            allLeagues = allLeagues.concat(mappedLeagues);

            // Break if no more documents to fetch
            if (response.documents.length < limit) {
                break;
            }

            lastLeagueId = response.documents[response.documents.length - 1].$id; // Update cursor for next iteration
        }

        return allLeagues;
    } catch (error) {
        console.error("Error fetching league details: " + error);
        throw new Error(error);
    }
};

export const resetWeek = async (weekNum, error) => {
    let usersArray = [], leaguesArray = []
    try {
        // Reset weekPoints for each user
        const users = await getAllUsers();
        for (const user of users) {
            //log(user.username + " reseting from " + user.weekPoints)
            await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.userCollectionId, user.$id, {
                weekPoints: 0
            });

            usersArray.push(user.username + ": " + user.weekPoints)

            await checkOrCreateWeeklyLineup(weekNum, error, user.$id)
        }

        // Reset weekly-total-points for each league
        const leagues = await getAllLeagues();
        for (const league of leagues) {
            //log(league.name + " reseting from " + league["weekly-total-points"])
            const leagueTotalPoints = league["cumulative-total-points"]
            await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.leagueCollectionId, league.$id, {
                'previous-week-points': leagueTotalPoints,
                'weekly-total-points': 0,
            });

            leaguesArray.push(league.name + ": " + league['weekly-total-points'])
        }

        return [usersArray, leaguesArray]

        //log("Week points for users and leagues have been reset.");
    } catch (e) {
        console.error("Error resetting week points: " + e);
        throw new Error(e);
    }
};

export const checkOrCreateWeeklyLineup = async (weekNumber, error, userId = null) => {
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
    } catch (e) {
        console.error("Error in checkOrCreateWeeklyLineup: " + e);
        throw new Error(e);
    }
};

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