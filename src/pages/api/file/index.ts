import { HTTP_STATUS_CODE } from "@/utils/consts";
import { NextApiRequest, NextApiResponse } from "next";
import { BucketType, getDirectUploadUrl } from "@/utils/file";

/**
 * This endpoint assumes that all incoming requests hit the `application-files` bucket.
 * Anything involving WebGL builds shall use `/api/games/[id]/builds` instead.
 *
 * @param req
 * @param res
 * @returns
 */
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

async function getFileHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = await getDirectUploadUrl(BucketType.ApplicationFiles);
    return res.status(HTTP_STATUS_CODE.OK).send(token);
  } catch (e) {
    return res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
      .send("Internal server error");
  }
}
