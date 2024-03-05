import { HTTP_STATUS_CODE } from "@/utils/consts";
import { NextApiRequest, NextApiResponse } from "next";
import connectB2 from "@/server/db/b2";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "GET":
      return getFileHandler(req, res);
    default:
      return res.status(HTTP_STATUS_CODE.METHOD_NOT_ALLOWED).send({
        error: `Request method ${req.method} is not allowed`,
      });
  }
}

export async function getDirectUploadUrl() {
  const b2 = await connectB2();

  const bucketId = process.env.B2_BUCKET_ID_APPLICATION;
  const response = await b2.getUploadUrl({ bucketId });
  const uploadUrl = response.data.uploadUrl;
  const uploadAuthToken = response.data.authorizationToken;

  return { uploadUrl, uploadAuthToken };
}

async function getFileHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = await getDirectUploadUrl();
    return res.status(HTTP_STATUS_CODE.OK).send(token);
  } catch (e) {
    return res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
      .send("Internal server error");
  }
}
