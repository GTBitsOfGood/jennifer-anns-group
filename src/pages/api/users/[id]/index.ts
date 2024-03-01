import {
  editUser,
  getUser,
  editPassword,
} from "../../../../server/db/actions/UserAction";
import { NextApiRequest, NextApiResponse } from "next";
import { HTTP_STATUS_CODE } from "@/utils/consts";
import {
  UserDoesNotExistException,
  UserException,
} from "@/utils/exceptions/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "GET":
      return getUserHandler(req, res);
    case "PUT":
      return editUserHandler(req, res);
    default:
      return res.status(HTTP_STATUS_CODE.METHOD_NOT_ALLOWED).send({
        error: `Request method ${req.method} is not allowed`,
      });
  }
}

async function getUserHandler(req: NextApiRequest, res: NextApiResponse) {
  const id = String(req.query.id);
  try {
    const user = await getUser(id);
    if (!user) throw new UserDoesNotExistException();
    res.status(HTTP_STATUS_CODE.OK).send(user);
  } catch (e) {
    if (e instanceof UserException) {
      return res.status(e.code).send(e.message);
    }
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
}

async function editUserHandler(req: NextApiRequest, res: NextApiResponse) {
  const type = req.query.type;

  if (type === "info") {
    editProfileHandler(req, res);
  } else if (type === "password") {
    editPasswordHandler(req, res);
  }
}

async function editProfileHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await editUser(req.body);
    return res.status(HTTP_STATUS_CODE.OK).send({ result });
  } catch (e) {
    if (e instanceof UserException) {
      return res.status(e.code).send(e.message);
    }
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
}

async function editPasswordHandler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id;
  try {
    const result = await editPassword(req.body, String(id));
    return res.status(HTTP_STATUS_CODE.OK).send({ result });
  } catch (e) {
    if (e instanceof UserException) {
      return res.status(e.code).send(e.message);
    }
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
}
