import { Client } from 'node-appwrite';
//import { getPicksByWeeklyLineup } from './appwrite';
//import { getUserWeeklyLineup } from '../appwrite';
//import { useGlobalContext } from '../../context/GlobalProvider';

// This is your Appwrite function
// It's executed each time we get a request
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
  //const { weekNum } = useGlobalContext();
  // This gives pick attributes
  //  log(`Received document update: ${JSON.stringify(req.body)}`);
  // This gives pick status
  // log(req.body["status"])
  // Why not try the Appwrite SDK?
  //
  // const client = new Client()
  //    .setEndpoint('https://cloud.appwrite.io/v1')
  //    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
  //    .setKey(process.env.APPWRITE_API_KEY);

  // You can log messages to the console
  //log(' Weird that I have to commit every time... But should trigger when any pick is updated!!');

  // If something goes wrong, log an error
  // error('Hello, Errors!');

  // The `req` object contains the request data
  // if (req.method === 'GET') {
  //   // Send a response with the res object helpers
  //   // `res.send()` dispatches a string back to the client
  //   return res.send('Hello, World!');
  // }

  // if (req.body["status"] === 'won') {
  req.body["users"].map((user) => {
    const points = req.body["potential-points"]

    //Need to update user: totalPoints, weekPoints, rankCategory,
    //Need to update league : "weekly-total-points", "cumulative-total-points"
    const userTotalPoints = user.totalPoints + points
    const userWeekPoints = user.weekPoints + points
    const rankCategory = getRankCategory(userTotalPoints)
    log("User " + user.username + ": " + userTotalPoints + " " + userWeekPoints + " " + rankCategory)

    const league = user.league;

    const leagueMembers = league.users.map(member =>
      member.username === user.username ? user : member);

    const sortedMembers = [...leagueMembers].sort((a, b) => b.weekPoints - a.weekPoints);
    const contributors = sortedMembers.slice(0, 5);
    log("sortedMembers: " + sortedMembers)
    log("contributors: " + contributors)
    if (contributors.includes(user)) {
      const leagueTotalPoints = league["cumulative-total-points"] + points
      const leagueWeekPoints = league["weekly-total-points"] + points
      log("League " + league.name + ": " + leagueTotalPoints + " " + leagueWeekPoints)
    }










    // log(user)
    // log("User id: ", user.$id)
    // log("weekly lineup: ")
    // let weeklyLineup = null;
    // user["weekly-lineup"].map((lineup) => {
    //   if (lineup.weekNumber === req.body["week"]) weeklyLineup = lineup;
    // })
    // log(weeklyLineup);
    // let picks = []
    // getPicksByWeeklyLineup(weeklyLineup.$id).then((res) => {
    //   picks = res;
    // })
    // log(picks)
  })
  // }

  // `res.json()` is a handy helper for sending JSON
  return res.json({
    motto: 'Build like a team of hundreds_',
    learn: 'https://appwrite.io/docs',
    connect: 'https://appwrite.io/discord',
    getInspired: 'https://builtwith.appwrite.io',
  });
};
