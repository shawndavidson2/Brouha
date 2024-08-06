import { Client } from 'node-appwrite';
import { updateUserAttributes, updateLeagueAttributes, getLeagueById } from './db.js';

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
  log(req)
  // if (req.body["status"] === 'won') {
  //   log("PICK: " + req.body["pick-title"] + " " + req.body["potential-points"])
  //   for (const user of req.body["users"]) {
  //     const points = req.body["potential-points"];

  //     // Update user: totalPoints, weekPoints, rankCategory
  //     const userTotalPoints = user.totalPoints + points;
  //     const userWeekPoints = user.weekPoints + points;
  //     const rankCategory = getRankCategory(userTotalPoints);
  //     log(`User ${user.username}: total points: ${userTotalPoints} weekly points: ${userWeekPoints} ${rankCategory}`);

  //     const userAttributes = {
  //       totalPoints: userTotalPoints,
  //       weekPoints: userWeekPoints,
  //       rankCategory: rankCategory,
  //     };

  //     // Update user attributes in database
  //     await updateUserAttributes(user, userAttributes);

  //     // Fetch and update league information
  //     try {
  //       const league = await getLeagueById(user.league.$id);
  //       const leagueMembers = league.users.map(member => member.username === user.username ? user : member);
  //       const sortedMembers = leagueMembers.sort((a, b) => b.weekPoints - a.weekPoints);
  //       const contributors = sortedMembers.slice(0, 5);

  //       log("contributors: " + contributors.map(member => member.username).join(", "));

  //       if (contributors.some(member => member.username === user.username)) {
  //         const leagueTotalPoints = league["cumulative-total-points"] + points;
  //         const leagueWeekPoints = league["weekly-total-points"] + points;
  //         log(`League ${league.name}: total points: ${leagueTotalPoints} week points: ${leagueWeekPoints}`);

  //         const leagueAttributes = {
  //           "weekly-total-points": leagueWeekPoints,
  //           "cumulative-total-points": leagueTotalPoints,
  //         };

  //         // Update league attributes in database
  //         await updateLeagueAttributes(league, leagueAttributes);


  //       }
  //     } catch (error) {
  //       console.error("Failed to update league attributes:", error);
  //     }
  //   }
  // }
  return res.json({
    motto: 'Build like a team of hundreds_',
    learn: 'https://appwrite.io/docs',
    connect: 'https://appwrite.io/discord',
    getInspired: 'https://builtwith.appwrite.io',
  });
};
