import { NextApiRequest, NextApiResponse } from "next";
import { getUserNames } from "../../../../server/db/actions/UserAction";
import { HTTP_STATUS_CODE } from "@/utils/consts";
import { UserDoesNotExistException } from "@/utils/exceptions/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    return getUserNamesHandler(req, res);
  }

  return res.status(HTTP_STATUS_CODE.METHOD_NOT_ALLOWED).send({
    error: `Request method ${req.method} is not allowed`,
  });
}

async function getUserNamesHandler(req: NextApiRequest, res: NextApiResponse) {
  const { userIds } = req.body;

  if (!Array.isArray(userIds)) {
    return res
      .status(HTTP_STATUS_CODE.BAD_REQUEST)
      .send({ error: "Invalid input, userIds should be an array." });
  }

  try {
    const names = await getUserNames(userIds);
    console.log("names", names);
    res.status(HTTP_STATUS_CODE.OK).send({ names });
  } catch (e: any) {
    if (e instanceof UserDoesNotExistException) {
      return res.status(e.code).send({ error: e.message });
    }
    return res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
      .send({ error: e.message });
  }
}
