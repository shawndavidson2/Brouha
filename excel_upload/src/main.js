import { Client } from 'node-appwrite';
import * as XLSX from 'xlsx';
import { getPicksByWeek, retryUpdatePickStatus, getWeekNum, acquireLockWithRetry, releaseLock } from './db.js';

// Helper function for delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to get the file URL
const getFileUrl = (bucketId, fileId) => {
  return `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${fileId}/view?project=667edab40004ed4257b4&mode=admin`;
};

// Function to fetch the file data
const fetchFileData = async (fileUrl, error) => {
  const response = await fetch(fileUrl);
  if (!response.ok) {
    error(`Failed to fetch file: ${response.status} ${response.statusText}`);
  }
  return response.arrayBuffer();
};

// Function to process Excel sheets
const processExcelSheet = async (workbook, picks, log, error) => {

  // Go through each sheetname with "vs" in it

  for (const sheetName of workbook.SheetNames) {
    if (sheetName.toLowerCase().includes("vs")) {
      const worksheet = workbook.Sheets[sheetName];
      if (!worksheet) {
        error(`No data found in the sheet "${sheetName}"`);
        continue;
      }

      const json = XLSX.utils.sheet_to_json(worksheet);
      log(sheetName);

      // Go through each pick on the current sheet

      for (const jsonPick of json) {
        // If the current pick is W or L, and its correspondant in the DB is still pending, update that pick in DB
        const jsonPickStatus = jsonPick[sheetName] === "L" ? "lost" : jsonPick[sheetName] === "W" ? "won" : "pending";
        if (jsonPick[sheetName] === "W" || jsonPick[sheetName] === "L") {
          const matchedPick = picks.find(pick => pick["pick-title"] === jsonPick["__EMPTY"] && pick["game"] === sheetName);
          if (matchedPick && jsonPickStatus !== matchedPick["status"]) {
            log("Changed pick: " + matchedPick["pick-title"] + " from " + matchedPick["status"] + " to " + jsonPick[sheetName]);

            // Delay (3 seconds) and retry to prevent rate limit

            await delay(6000);
            await retryUpdatePickStatus(jsonPick[sheetName], matchedPick.$id, matchedPick["status"]);
          }
        }
      }
    }
  }
};

// Function to validate the week number from the file name
const isValidWeek = (fileName, weekNum, log) => {
  const excelWeekNum = parseInt(fileName.match(/\d+/)[0], 10);
  if (excelWeekNum !== weekNum) {
    log("Updated file: " + fileName + " is not current week: " + weekNum);
    return false;
  }
  return true;
};

// Main Appwrite function
export default async ({ req, res, log, error }) => {
  const { $id: fileId, name: fileName, bucketId } = req.body;
  const week = await getWeekNum();
  const weekNum = week["weekNum"];
  const lockId = "Week" + weekNum;
  try {
    await acquireLockWithRetry(lockId);
    log(`Lock acquired for ${lockId}`);

    if (!isValidWeek(fileName, weekNum, log)) return;

    const picks = await getPicksByWeek(weekNum);
    const fileUrl = getFileUrl(bucketId, fileId);
    const arrayBuffer = await fetchFileData(fileUrl, error);

    const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
    await processExcelSheet(workbook, picks, log, error);

  } catch (e) {
    error('Error fetching game details:', e);
  } finally {
    await releaseLock(lockId);
    log(`Lock released for ${lockId}`);
  }

  return res.json({
    motto: 'Build like a team of hundreds_',
    learn: 'https://appwrite.io/docs',
    connect: 'https://appwrite.io/discord',
    getInspired: 'https://builtwith.appwrite.io',
  });
};
