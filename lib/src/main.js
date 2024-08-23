import { Client, Databases } from 'node-appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite endpoint
  .setProject('667edab40004ed4257b4')         // Your Appwrite project ID

const databases = new Databases(client);

const acquireLock = async (lockId) => {
  try {
    const lock = await databases.createDocument('66c91b6e003d1bd13aa5', 'locks', lockId, {
      acquiredAt: new Date().toISOString(),
    });
    return lock;
  } catch (err) {
    if (err.code === 409) { // 409 Conflict means the lock already exists
      throw new Error('Lock already acquired');
    } else {
      throw err;
    }
  }
};

const releaseLock = async (lockId) => {
  try {
    await databases.deleteDocument('YOUR_DATABASE_ID', 'locks', lockId);
  } catch (err) {
    console.error('Failed to release lock:', err);
  }
};

const getRankCategory = (totalPoints) => {
  if (totalPoints >= 75000) return 'Legend';
  if (totalPoints >= 60000) return 'HOF';
  if (totalPoints >= 40000) return 'All-Pro';
  if (totalPoints >= 30000) return 'Pro';
  if (totalPoints >= 20000) return 'Varsity';
  if (totalPoints >= 10000) return 'JV';
  return 'Freshman';
};

export default async ({ req, res, log, error }) => {
  if (req.body["status"] === 'won') {
    for (const userId of req.body["users"]) {
      const lockId = `user_${userId}_lock`;

      try {
        // Attempt to acquire a lock
        await acquireLock(lockId);
        log(`Lock acquired for user ${userId}`);

        // Fetch user data
        const user = await databases.getDocument('YOUR_DATABASE_ID', 'users', userId);
        const points = req.body["potential-points"];

        // Update user: totalPoints, weekPoints, rankCategory
        const userTotalPoints = user.totalPoints + points;
        const userWeekPoints = user.weekPoints + points;
        const rankCategory = getRankCategory(userTotalPoints);

        const userAttributes = {
          totalPoints: userTotalPoints,
          weekPoints: userWeekPoints,
          rankCategory: rankCategory,
        };

        // Update user attributes in the database
        const updatedUser = await databases.updateDocument('YOUR_DATABASE_ID', 'users', userId, userAttributes);
        if (updatedUser) {
          log(`User ${user.username}: Added ${points} points. weekPoints is now: ${userWeekPoints} ... ${rankCategory}`);
        } else {
          log(`User ${user.username}: Not updated for some reason.`);
        }

        // Fetch and update league information
        const league = await databases.getDocument('YOUR_DATABASE_ID', 'leagues', user.league.$id);
        const leagueMembers = league.users.map(member => member.username === user.username ? user : member);
        const sortedMembers = leagueMembers.sort((a, b) => b.weekPoints - a.weekPoints);
        const contributors = sortedMembers.slice(0, 5);

        log("Contributors: " + contributors.map(member => member.username).join(", "));

        if (contributors.some(member => member.username === user.username)) {
          const leagueTotalPoints = league["cumulative-total-points"] + points;
          const leagueWeekPoints = league["weekly-total-points"] + points;

          const leagueAttributes = {
            "weekly-total-points": leagueWeekPoints,
            "cumulative-total-points": leagueTotalPoints,
          };

          // Update league attributes in the database
          const updatedLeague = await databases.updateDocument('YOUR_DATABASE_ID', 'leagues', league.$id, leagueAttributes);
          if (updatedLeague) {
            log(`League ${league.name}: Added ${points} points. weekPoints is now: ${leagueWeekPoints}`);
          } else {
            log(`League ${league.name}: Not updated for some reason`);
          }
        }
      } catch (err) {
        error(`Failed to update user or league: ${err.message}`);
      } finally {
        // Always release the lock
        await releaseLock(lockId);
        log(`Lock released for user ${userId}`);
      }
    }
  }
  return res.json({
    motto: 'Build like a team of hundreds_',
    learn: 'https://appwrite.io/docs',
    connect: 'https://appwrite.io/discord',
    getInspired: 'https://builtwith.appwrite.io',
  });
};
