import { Client } from 'node-appwrite';
import { resetWeek } from './db.js'

// This is your Appwrite function
// It's executed each time we get a request
export default async ({ req, res, log, error }) => {
  const weekNum = req.body.weekNum;

  log("Updated to weekNum:", weekNum)
  const [usersArray, leaguesArray] = await resetWeek(weekNum)
  log(usersArray, leaguesArray)

  // `res.json()` is a handy helper for sending JSON
  return res.json({
    motto: 'Build like a team of hundreds_',
    learn: 'https://appwrite.io/docs',
    connect: 'https://appwrite.io/discord',
    getInspired: 'https://builtwith.appwrite.io',
  });
};
