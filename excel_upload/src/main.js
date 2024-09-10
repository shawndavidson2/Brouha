import { Client } from 'node-appwrite';
import * as XLSX from 'xlsx';
import { getPicksByWeek, retryUpdatePickStatus, getWeekNum } from './db.js';


//const req = { "bodyRaw": "{\"$id\":\"66c8dea00fb779e93858\",\"bucketId\":\"667edd29003dd0cf6445\",\"$createdAt\":\"2024-08-20T16:49:14.433+00:00\",\"$updatedAt\":\"2024-08-20T16:49:14.433+00:00\",\"$permissions\":[],\"name\":\"Matchup Data WK1.xlsx\",\"signature\":\"04b7352b4c23334bdf0eebb9feff4b51\",\"mimeType\":\"application\\/vnd.openxmlformats-officedocument.spreadsheetml.sheet\",\"sizeOriginal\":25522,\"chunksTotal\":1,\"chunksUploaded\":1}", "body": { "$id": "66c8dea00fb779e93858", "bucketId": "667edd29003dd0cf6445", "$createdAt": "2024-08-20T16:49:14.433+00:00", "$updatedAt": "2024-08-20T16:49:14.433+00:00", "$permissions": [], "name": "Matchup Data WK1.xlsx", "signature": "04b7352b4c23334bdf0eebb9feff4b51", "mimeType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "sizeOriginal": 25522, "chunksTotal": 1, "chunksUploaded": 1 }, "headers": { "host": "66c4c90a8c89d:3000", "user-agent": "Appwrite/1.5.10", "content-type": "application/json", "x-appwrite-trigger": "event", "x-appwrite-event": "buckets.667edd29003dd0cf6445.files.66c4bb05d31fc5e2d2a8.create", "connection": "keep-alive", "content-length": "386" }, "method": "POST", "host": "66c4c90a8c89d", "scheme": "http", "query": {}, "queryString": "", "port": 3000, "url": "http://66c4c90a8c89d:3000/", "path": "/" }
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// This is your Appwrite function
// It's executed each time we get a request
export default async ({ req, res, log, error }) => {
  try {
    const fileId = req.body.$id;
    const fileName = req.body.name;
    const bucketId = req.body.bucketId;

    const week = await getWeekNum();
    const weekNum = week["weekNum"]

    const excelWeekNum = parseInt(fileName.match(/\d+/)[0], 10);

    if (excelWeekNum !== weekNum) {
      log("Updated file: " + fileName + " is not current week: " + weekNum);
    } else {
      const picks = await getPicksByWeek(weekNum)


      const fileUrl = 'https://cloud.appwrite.io/v1/storage/buckets/' + bucketId + '/files/' + fileId + '/view?project=667edab40004ed4257b4&mode=admin';
      const response = await fetch(fileUrl);

      if (!response.ok) {
        error(`Failed to fetch file: ${response.status} ${response.statusText}`);
      }

      // Convert the response to an ArrayBuffer
      const arrayBuffer = await response.arrayBuffer();

      // Use XLSX to parse the ArrayBuffer
      const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });

      // Loop through each sheet name
      for (const sheetName of workbook.SheetNames) {
        // Check if the sheet name contains "vs"
        if (sheetName.toLowerCase().includes("vs")) {
          const worksheet = workbook.Sheets[sheetName];

          if (worksheet) {
            // Convert the sheet to JSON format
            const json = XLSX.utils.sheet_to_json(worksheet);
            //console.log(`Data from sheet "${sheetName}":`, json);

            log(sheetName)
            // Process or return the json as needed
            for (const jsonPick of json) {
              const jsonPickStatus = jsonPick[sheetName] === "L" ? "lost" : jsonPick[sheetName] === "W" ? "won" : "pending"
              //log(jsonPick[sheetName])
              if (jsonPick[sheetName] === "W" || jsonPick[sheetName] === "L") {
                const matchedPick = picks.find(pick => pick["pick-title"] === jsonPick["__EMPTY"]);
                if (matchedPick && jsonPickStatus !== matchedPick["status"]) {
                  //matchedPick["status"] = jsonPick[sheetName];
                  log("Changed pick: " + matchedPick["pick-title"] + " from " + matchedPick["status"] + " to " + jsonPick[sheetName])
                  // Add a 5-second delay before calling retryUpdatePickStatus
                  await delay(5000);
                  await retryUpdatePickStatus(jsonPick[sheetName], matchedPick.$id);
                }
              }
            }
          } else {
            error(`No data found in the sheet "${sheetName}"`);
          }
        }
      }
    }
  } catch (e) {
    error('Error fetching game details:', e);
  }
  return res.json({
    motto: 'Build like a team of hundreds_',
    learn: 'https://appwrite.io/docs',
    connect: 'https://appwrite.io/discord',
    getInspired: 'https://builtwith.appwrite.io',
  });
};