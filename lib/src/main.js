import { Client } from 'node-appwrite';
//import { updateUserAttributes, updateLeagueAttributes } from './appwrite';

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
  // req.body["users"].map((user) => {
  //   const points = req.body["potential-points"]

  //   //Need to update user: totalPoints, weekPoints, rankCategory,
  //   //Need to update league : "weekly-total-points", "cumulative-total-points"
  //   const userTotalPoints = user.totalPoints + points
  //   const userWeekPoints = user.weekPoints + points
  //   const rankCategory = getRankCategory(userTotalPoints)
  //   log("User " + user.username + ": " + userTotalPoints + " " + userWeekPoints + " " + rankCategory)
  //   const userAttributes = {
  //     totalPoints: userTotalPoints,
  //     weekPoints: userWeekPoints,
  //     rankCategory: rankCategory,
  //   };
  //   user.totalPoints = userTotalPoints;
  //   user.weekPoints = userWeekPoints;

  //   //await updateUserAttributes(user, userAttributes);

  //   const league = user.league;

  //   const leagueMembers = league.users.map(member =>
  //     member.username === user.username ? user : member);

  //   const sortedMembers = [...leagueMembers].sort((a, b) => b.weekPoints - a.weekPoints);
  //   const contributors = sortedMembers.slice(0, 5);
  //   log("sortedMembers: " + sortedMembers)
  //   log("contributors: " + contributors)
  //   if (contributors.includes(user)) {
  //     const leagueTotalPoints = league["cumulative-total-points"] + points
  //     const leagueWeekPoints = league["weekly-total-points"] + points
  //     log("League " + league.name + ": " + leagueTotalPoints + " " + leagueWeekPoints)
  //     const leagueAttributes = {
  //       "weekly-total-points": leagueWeekPoints,
  //       "cumulative-total-points": leagueTotalPoints,
  //     };

  //     league["weekly-total-points"] = leagueWeekPoints
  //     league["cumulative-total-points"] = leagueTotalPoints

  //     //await updateLeagueAttributes(league, leagueAttributes);

  //   }

  // })
  // }

  // `res.json()` is a handy helper for sending JSON
  return res.json({
    motto: 'Build like a team of hundreds_',
    learn: 'https://appwrite.io/docs',
    connect: 'https://appwrite.io/discord',
    getInspired: 'https://builtwith.appwrite.io',
  });
};
