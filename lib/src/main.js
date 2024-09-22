import { acquireLockWithRetry, releaseLock, getUserAttributes, updateUserAttributes, getLeagueById, updateLeagueAttributes } from './db.js';

// Helper function for delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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
  log(req.body["pick-title"] + "   " + req.body["status"])

  const { status, previousStatus } = req.body;

  if (status === 'won' || (status === 'lost')) {

    // Determine if points should be added or subtracted
    let plusMinus = "LOST";
    if (status === 'lost' && previousStatus === 'won') {
      plusMinus = "minus";
    } else if (status === 'won') {
      plusMinus = "plus"
    }

    for (const userId of req.body["users"]) {
      const userLockId = userId;

      try {
        // Attempt to acquire a lock for the user
        await acquireLockWithRetry(userLockId);
        log(`Lock acquired for user ${userId}`);

        // Fetch user data
        const user = await getUserAttributes(userId);
        const points = req.body["potential-points"];

        // Update user: totalPoints, weekPoints, rankCategory
        let userTotalPoints = user.totalPoints;
        let userWeekPoints = user.weekPoints;
        let userBestWeekPoints = user.bestWeek;
        let userNumPicksWon = user.numPicksWon;
        let userNumPicksLost = user.numPicksLost;

        if (plusMinus === "plus") {
          userTotalPoints += points;
          userWeekPoints += points;
          userNumPicksWon += 1;
        } else if (plusMinus === "minus") {
          userTotalPoints -= points;
          userWeekPoints -= points;
          userNumPicksWon -= 1;
          userNumPicksLost += 1;
        } else if (plusMinus === "LOST") {
          userNumPicksLost += 1;
        }

        const rankCategory = getRankCategory(userTotalPoints);

        if (userWeekPoints > userBestWeekPoints) {
          userBestWeekPoints = userWeekPoints;
        }

        const userAttributes = {
          totalPoints: userTotalPoints,
          weekPoints: userWeekPoints,
          rankCategory: rankCategory,
          bestWeek: userBestWeekPoints,
          numPicksWon: userNumPicksWon,
          numPicksLost: userNumPicksLost,
        };

        //Update local user for league
        user.totalPoints = userTotalPoints;
        user.weekPoints = userWeekPoints;
        user.rankCategory = rankCategory;

        // Update user attributes in the database
        const updatedUser = await updateUserAttributes(userId, userAttributes);
        if (plusMinus === "LOST") {
          console.log(`User ${user.username}: Pick lost, Added 1 to numPicksLost`)
          await releaseLock(userLockId);
          log(`Lock released for league ${league.name}`);
          return res.json({
            motto: 'Build like a team of hundreds_',
            learn: 'https://appwrite.io/docs',
            connect: 'https://appwrite.io/discord',
            getInspired: 'https://builtwith.appwrite.io',
          });
        }
        if (updatedUser) {
          log(`User ${user.username}: Added ${points} points. weekPoints is now: ${userWeekPoints} ... ${rankCategory}`);
        } else {
          log(`User ${user.username}: Not updated for some reason.`);
        }

        // Fetch the league data
        const league = await getLeagueById(user.league.$id);
        const leagueLockId = league.$id; // Using league ID as lock ID for the league

        // Attempt to acquire a lock for the league
        await acquireLockWithRetry(leagueLockId);
        log(`Lock acquired for league ${league.name}`);

        try {
          // Fetch and update league information
          const leagueMembers = league.users.map(member => member.username === user.username ? user : member);
          const sortedMembers = leagueMembers.sort((a, b) => b.weekPoints - a.weekPoints);
          const contributors = sortedMembers.slice(0, 5);

          log("Contributors: " + contributors.map(member => member.username + "  " + member.weekPoints).join(", "));

          if (contributors.some(member => member.username === user.username)) {
            const leagueWeekPoints = contributors.reduce((total, contributor) => {
              // Check if the contributor is the current user
              if (contributor.username === user.username) {
                return total + userWeekPoints;
              }
              // Otherwise, use the contributor's weekPoints
              return total + contributor.weekPoints;
            }, 0);
            const leagueTotalPoints = league["previous-week-points"] + leagueWeekPoints

            const leagueAttributes = {
              "weekly-total-points": leagueWeekPoints,
              "cumulative-total-points": leagueTotalPoints,
            };

            // Update local league
            league["weekly-total-points"] = leagueWeekPoints;
            league["cumulative-total-points"] = leagueTotalPoints;

            // Update league attributes in the database
            const updatedLeague = await updateLeagueAttributes(league, leagueAttributes);
            if (updatedLeague) {
              log(`League ${league.name}: Added ${points} points. weekPoints is now: ${leagueWeekPoints}`);
            } else {
              log(`League ${league.name}: Not updated for some reason`);
            }
          } else {
            log("No league points added: User is not part of the top 5 contributors of " + league.name);
          }
        } finally {
          // Always release the league lock
          await releaseLock(leagueLockId);
          log(`Lock released for league ${league.name}`);
        }
      } catch (err) {
        error(`Failed to update user or league: ${err.message}`);
      } finally {
        // Always release the user lock
        await releaseLock(userLockId);
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
