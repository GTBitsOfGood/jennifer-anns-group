import { NextApiRequest, NextApiResponse } from "next";
import { GridFSBucket, ObjectId } from "mongodb";
import connectMongoDB from "@/server/db/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const db = await connectMongoDB();
    if (!db) {
      throw new Error("Database not connected.");
    }
    const bucket = new GridFSBucket(db);
    const fileId = req.query.id as string;
    const downloadStream = bucket.openDownloadStream(new ObjectId(fileId));
    //console.log(downloadStream);
    res.setHeader("Content-Type", "application/pdf");
    downloadStream.pipe(res);
  } catch (error) {
    console.error("Error fetching PDF data:", error);
    res.status(500).json({ error: "Failed to fetch PDF data" });
  }
}
