import { z } from "zod";
import { deleteUsersGDPR } from "@/server/db/actions/UserAction";
import { NextApiRequest, NextApiResponse } from "next";
import { HTTP_STATUS_CODE } from "@/utils/consts";
import { InvalidAPIException } from "@/utils/exceptions/external";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "DELETE":
      return deleteUsersGDPRHandler(req, res);
    default:
      return res.status(HTTP_STATUS_CODE.METHOD_NOT_ALLOWED).json({
        error: `Request method ${req.method} is not allowed`,
      });
  }
}

async function deleteUsersGDPRHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const api_key = req.headers["x-api-key"];
    //Verify API_KEY
    if (api_key != process.env.GDPR_DELETE_API_KEY) {
      throw new InvalidAPIException();
    }
    const deleteInfo = await deleteUsersGDPR();
    res.status(HTTP_STATUS_CODE.OK).send(deleteInfo);
  } catch (e: any) {
    if (e instanceof InvalidAPIException) {
      return res.status(e.code).json({ error: e.message });
    }
    return res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
      .json({ error: e.message });
  }
}
