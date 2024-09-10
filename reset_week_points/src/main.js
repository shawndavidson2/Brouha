import { Client } from 'node-appwrite';
import { resetWeek, checkAndUpdateWeekNum } from './db.js'

const calculateCurrentWeekNum = async () => {
  // Hardcoded start date for Week 1 (September 3, 2024 at midnight)
  const startWeek1 = new Date('2024-09-03T00:00:00');
  const currentDate = new Date();
  const millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
  const weeksSinceStart = Math.floor((currentDate - startWeek1) / millisecondsPerWeek);
  let currentWeekNum = 1 + weeksSinceStart;
  if (currentWeekNum < 1) currentWeekNum = 1;

  console.log('Current Week Number:', currentWeekNum);

  return currentWeekNum;
};

// This is your Appwrite function
// It's executed each time we get a request
export default async ({ req, res, log, error }) => {
  try {
    //const weekNum = req.body.weekNum;
    const weekNum = parseInt(await calculateCurrentWeekNum(), 10);
    const needsWeekClearing = await checkAndUpdateWeekNum(weekNum);

    if (needsWeekClearing) {
      log("Updated to weekNum: " + weekNum)
      const [usersArray, leaguesArray] = await resetWeek(weekNum, error)
      log("Users: " + usersArray)
      log("Leagues: " + leaguesArray)
    }
  } catch (e) {
    error(e);
  }

  // `res.json()` is a handy helper for sending JSON
  return res.json({
    motto: 'Build like a team of hundreds_',
    learn: 'https://appwrite.io/docs',
    connect: 'https://appwrite.io/discord',
    getInspired: 'https://builtwith.appwrite.io',
  });
};
