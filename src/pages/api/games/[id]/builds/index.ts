import { getGameById } from "@/server/db/actions/GameAction";
import connectB2 from "@/server/db/b2";
import { NextApiResponse } from "next";

// needed for formidable to work
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: any, res: NextApiResponse) {
  const gameId = req.query.id;
  const game = await getGameById(req.query.id);
  if (game == null) {
    return res.status(404).send({
      success: false,
      message: `Could not find game with id: ${gameId}`,
    });
  }

  switch (req.method) {
    case "POST":
      const b2 = await connectB2();

      const bucketId = process.env.B2_BUCKET_ID;
      const response = await b2.getUploadUrl({ bucketId });
      const uploadUrl = response.data.uploadUrl;
      const uploadAuthToken = response.data.authorizationToken;

      return res.status(200).send({
        success: true,
        message: "URL and auth token generated successfully",
        data: { uploadUrl, uploadAuthToken },
      });
  }

  return res.status(405).send({
    success: false,
    message: `Request method ${req.method} is not allowed`,
  });
}
