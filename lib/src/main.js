import { Client } from 'node-appwrite';
//import { getUserWeeklyLineup } from '../appwrite';
//import { useGlobalContext } from '../../context/GlobalProvider';

// This is your Appwrite function
// It's executed each time we get a request
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
  log(req.body)
  req.body["users"].map((user) => {
    log(user)
    log("User id: ", user.$id)
    log("weekly lineup: ")
    let weeklyLineup = null;
    user["weekly-lineup"].map((lineup) => {
      if (lineup.weekNumber === req.body["week"]) weeklyLineup = lineup;
    })
    log(weeklyLineup);
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
