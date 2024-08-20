import { Client } from 'node-appwrite';

//const req = { "bodyRaw": "{\"$id\":\"66c4bb05d31fc5e2d2a8\",\"bucketId\":\"667edd29003dd0cf6445\",\"$createdAt\":\"2024-08-20T16:49:14.433+00:00\",\"$updatedAt\":\"2024-08-20T16:49:14.433+00:00\",\"$permissions\":[],\"name\":\"Matchup Data WK1.xlsx\",\"signature\":\"04b7352b4c23334bdf0eebb9feff4b51\",\"mimeType\":\"application\\/vnd.openxmlformats-officedocument.spreadsheetml.sheet\",\"sizeOriginal\":25522,\"chunksTotal\":1,\"chunksUploaded\":1}", "body": { "$id": "66c4bb05d31fc5e2d2a8", "bucketId": "667edd29003dd0cf6445", "$createdAt": "2024-08-20T16:49:14.433+00:00", "$updatedAt": "2024-08-20T16:49:14.433+00:00", "$permissions": [], "name": "Matchup Data WK1.xlsx", "signature": "04b7352b4c23334bdf0eebb9feff4b51", "mimeType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "sizeOriginal": 25522, "chunksTotal": 1, "chunksUploaded": 1 }, "headers": { "host": "66c4c90a8c89d:3000", "user-agent": "Appwrite/1.5.10", "content-type": "application/json", "x-appwrite-trigger": "event", "x-appwrite-event": "buckets.667edd29003dd0cf6445.files.66c4bb05d31fc5e2d2a8.create", "connection": "keep-alive", "content-length": "386" }, "method": "POST", "host": "66c4c90a8c89d", "scheme": "http", "query": {}, "queryString": "", "port": 3000, "url": "http://66c4c90a8c89d:3000/", "path": "/" }


// This is your Appwrite function
// It's executed each time we get a request
export default async ({ req, res, log, error }) => {
  const fileId = req.body.$id
  const fileName = req.body.name
  const bucketId = req.body.bucketId

  const fileUrl = 'https://cloud.appwrite.io/v1/storage/buckets/' + bucketId + '/files/' + fileId + '/view?project=667edab40004ed4257b4&mode=admin';
  const response = await fetch(fileUrl);
  const blob = await response.blob();
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });

    // Example of accessing the first sheet
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    if (worksheet) {
      const json = XLSX.utils.sheet_to_json(worksheet);
      log('Sheet Data:', json);
      // You can now use the data, e.g., set it in state if you're using React
      // setDetails(json);
    } else {
      error("Worksheet not found!");
    }
  };

  reader.readAsArrayBuffer(blob);
  return res.json({
    motto: 'Build like a team of hundreds_',
    learn: 'https://appwrite.io/docs',
    connect: 'https://appwrite.io/discord',
    getInspired: 'https://builtwith.appwrite.io',
  });
};

export const test = async () => {
  const fileId = req.body.$id
  const fileName = req.body.name
  const bucketId = req.body.bucketId

  const fileUrl = 'https://cloud.appwrite.io/v1/storage/buckets/' + bucketId + '/files/' + fileId + '/view?project=667edab40004ed4257b4&mode=admin';
  const response = await fetch(fileUrl);
  const blob = await response.blob();
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });

    // Example of accessing the first sheet
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    if (worksheet) {
      const json = XLSX.utils.sheet_to_json(worksheet);
      log('Sheet Data:', json);
      // You can now use the data, e.g., set it in state if you're using React
      // setDetails(json);
    } else {
      error("Worksheet not found!");
    }
  };

  reader.readAsArrayBuffer(blob);
};

//test();