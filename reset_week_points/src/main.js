import { resetWeek, checkAndUpdateWeekNum } from './db.js'

const calculateCurrentWeekNum = async () => {
  // Hardcoded start date for Week 1 (September 3, 2024 at midnight)
  const startWeek1 = new Date('2024-09-04T20:00:00-04:00');  // 8 PM EDT
  const currentDate = new Date();
  const millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
  const weeksSinceStart = Math.floor((currentDate - startWeek1) / millisecondsPerWeek);
  let currentWeekNum = 1 + weeksSinceStart;
  if (currentWeekNum < 1) currentWeekNum = 1;

  return parseInt(currentWeekNum, 10);
};

// This is your Appwrite function
// It's executed each time we get a request
export default async ({ req, res, log, error }) => {
  try {
    //const weekNum = req.body.weekNum;
    const weekNum = await calculateCurrentWeekNum();
    log('Current Week Number:', weekNum);
    const needsWeekClearing = await checkAndUpdateWeekNum(weekNum);

    if (needsWeekClearing) {
      log("Updated to weekNum: " + weekNum)
      const [usersArray, leaguesArray] = await resetWeek(weekNum, error)
      log("Users: " + usersArray)
      log("Leagues: " + leaguesArray)
    } else {
      log("Week Clearing NOT needed!")
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


// const test = async () => {
//   try {
//     const weekNum = await calculateCurrentWeekNum();
//     console.log('Current Week Number:', weekNum);
//   } catch (e) {
//     console.error(e);
//   }

//   // `res.json()` is a handy helper for sending JSON

// };

// test();