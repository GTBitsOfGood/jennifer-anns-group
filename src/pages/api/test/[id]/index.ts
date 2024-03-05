import { NextApiRequest, NextApiResponse } from "next";
import { editGame, uploadFile } from "@/server/db/actions/GameAction";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log(req.query.id);
    const fileData = req.body;
    if (!fileData) {
      res.status(400).json({ error: "Empty file input." });
    }
    const uploadStream = await uploadFile(fileData);
    //if game not editing properly throw error and delete existing file
    const editingGame = await editGame({
      id: String(req.query.id),
      data: { lesson: uploadStream.id },
    });
    console.log(editingGame);
    res.status(200).json({ success: true, fileId: uploadStream.id });
  } catch (error) {
    res.status(500).json({ error: "Failed to connect to database" });
  }
}
