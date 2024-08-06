//import { Client } from 'node-appwrite';
import { updateUserAttributes, updateLeagueAttributes, getLeagueById, getUserAttributes } from './db.js';

const getRankCategory = (totalPoints) => {
    if (totalPoints >= 75000) return 'Legend';
    if (totalPoints >= 60000) return 'HOF';
    if (totalPoints >= 40000) return 'All-Pro';
    if (totalPoints >= 30000) return 'Pro';
    if (totalPoints >= 20000) return 'Varsity';
    if (totalPoints >= 10000) return 'JV';
    return 'Freshman';
};

const req = { "bodyRaw": "{\"pick-title\":\"Lamar Jackson TD\",\"potential-points\":1250,\"status\":\"won\",\"game\":\"KC vs BAL\",\"time\":\" 8:20\\u202fPM\",\"date\":\"9\\/5\\/2024\",\"week\":3,\"users\":[\"669f0cd30017bcbd4723\"],\"$id\":\"66b257f1002e277d05cf\",\"$tenant\":\"159542\",\"$createdAt\":\"2024-08-06T17:05:55.138+00:00\",\"$updatedAt\":\"2024-08-06T17:27:07.486+00:00\",\"$permissions\":[\"read(\\\"user:669f0ccf0019b2358f11\\\")\",\"update(\\\"user:669f0ccf0019b2358f11\\\")\",\"delete(\\\"user:669f0ccf0019b2358f11\\\")\"],\"$databaseId\":\"667edc260009e0dfc309\",\"$collectionId\":\"6684a04a000e85542756\"}", "body": { "pick-title": "Lamar Jackson TD", "potential-points": 1250, "status": "won", "game": "KC vs BAL", "time": " 8:20 PM", "date": "9/5/2024", "week": 3, "users": ["669f0cd30017bcbd4723"], "$id": "66b257f1002e277d05cf", "$tenant": "159542", "$createdAt": "2024-08-06T17:05:55.138+00:00", "$updatedAt": "2024-08-06T17:27:07.486+00:00", "$permissions": ["read(\"user:669f0ccf0019b2358f11\")", "update(\"user:669f0ccf0019b2358f11\")", "delete(\"user:669f0ccf0019b2358f11\")"], "$databaseId": "667edc260009e0dfc309", "$collectionId": "6684a04a000e85542756" }, "headers": { "host": "66b25cebb2198:3000", "user-agent": "Appwrite/1.5.8", "content-type": "application/json", "x-appwrite-trigger": "event", "x-appwrite-event": "databases.667edc260009e0dfc309.collections.6684a04a000e85542756.documents.66b257f1002e277d05cf.update", "x-appwrite-user-id": "667cb51316bc45d0af32", "connection": "keep-alive", "content-length": "525" }, "method": "POST", "host": "66b25cebb2198", "scheme": "http", "query": {}, "queryString": "", "port": 3000, "url": "http://66b25cebb2198:3000/", "path": "/" }

export const test = async (req) => {
    // Assuming `req.body` is defined and passed as an argument for context
    if (req.body["status"] === 'won') {
        for (const userId of req.body["users"]) {
            const user = await getUserAttributes(userId);
            const points = req.body["potential-points"];

            // Update user: totalPoints, weekPoints, rankCategory
            const userTotalPoints = user.totalPoints + points;
            const userWeekPoints = user.weekPoints + points;
            const rankCategory = getRankCategory(userTotalPoints);
            console.log(`User ${user.username}: ${userTotalPoints} ${userWeekPoints} ${rankCategory}`);

            const userAttributes = {
                totalPoints: userTotalPoints,
                weekPoints: userWeekPoints,
                rankCategory: rankCategory,
            };

            // Update user attributes in database
            await updateUserAttributes(userId, userAttributes);

            // Fetch and update league information
            try {
                const league = await getLeagueById(user.league.$id);
                const leagueMembers = league.users.map(member => member.username === user.username ? user : member);
                const sortedMembers = leagueMembers.sort((a, b) => b.weekPoints - a.weekPoints);
                const contributors = sortedMembers.slice(0, 5);

                console.log("contributors: " + contributors.map(member => member.username).join(", "));

                if (contributors.some(member => member.username === user.username)) {
                    const leagueTotalPoints = league["cumulative-total-points"] + points;
                    const leagueWeekPoints = league["weekly-total-points"] + points;
                    console.log(`League ${league.name}: ${leagueTotalPoints} ${leagueWeekPoints}`);

                    const leagueAttributes = {
                        "weekly-total-points": leagueWeekPoints,
                        "cumulative-total-points": leagueTotalPoints,
                    };

                    // Update league attributes in database
                    await updateLeagueAttributes(league, leagueAttributes);
                }
            } catch (error) {
                console.error("Failed to update league attributes:", error);
            }
        }
    }
};

test(req);
