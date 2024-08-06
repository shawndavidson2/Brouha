import { Client } from 'node-appwrite';
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

export default async ({ req, res, log, error }) => {
  if (req.body["status"] === 'won') {
    for (const userId of req.body["users"]) {
      const user = await getUserAttributes(userId);
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

      // Update user attributes in database
      const updatedUser = await updateUserAttributes(userId, userAttributes);
      if (updatedUser) {
        log(`User ${user.username}: Added ${points} points. weekPoints is now: ${userWeekPoints} ... ${rankCategory}`);
      } else {
        log(`User ${user.username}: Not updated for some reason.`);
      }

      // Fetch and update league information
      try {
        const league = await getLeagueById(user.league.$id);
        const leagueMembers = league.users.map(member => member.username === user.username ? user : member);
        const sortedMembers = leagueMembers.sort((a, b) => b.weekPoints - a.weekPoints);
        const contributors = sortedMembers.slice(0, 5);

        log("contributors: " + contributors.map(member => member.username).join(", "));

        if (contributors.some(member => member.username === user.username)) {
          const leagueTotalPoints = league["cumulative-total-points"] + points;
          const leagueWeekPoints = league["weekly-total-points"] + points;

          const leagueAttributes = {
            "weekly-total-points": leagueWeekPoints,
            "cumulative-total-points": leagueTotalPoints,
          };

          // Update league attributes in database
          const updatedLeague = await updateLeagueAttributes(league, leagueAttributes);
          if (updatedLeague) {
            log(`League ${league.name}: Added ${points} points. weekPoints is now: ${leagueWeekPoints}`);
          } else {
            log(`League ${league.name}: Not updated for some reason`);
          }
        }
      } catch (error) {
        console.error("Failed to update league attributes:", error);
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
