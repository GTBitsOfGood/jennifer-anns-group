import {
  editUser,
  getUser,
  editPassword,
} from "../../../../server/db/actions/UserAction";
import { NextApiRequest, NextApiResponse } from "next";
import {
  HTTP_BAD_REQUEST,
  HTTP_INTERNAL_SERVER_ERROR,
  HTTP_METHOD_NOT_ALLOWED,
  HTTP_NOT_FOUND,
  HTTP_UNAUTHORIZED,
} from "@/utils/consts";
import {
  UserAlreadyExistsException,
  UserCredentialsIncorrectException,
  UserDoesNotExistException,
} from "@/utils/exceptions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "GET":
      const id = String(req.query.id);
      try {
        const user = await getUser(id);
        res.status(200).send({
          data: user,
        });
        return;
      } catch (e: unknown) {
        if (e instanceof UserDoesNotExistException) {
          res.status(HTTP_NOT_FOUND).json({
            error: (e as Error).message,
          });
          return;
        }
        res.status(HTTP_INTERNAL_SERVER_ERROR).json({
          error: (e as Error).message,
        });
        return;
      }

    case "PUT":
      await editUserHandler(req, res);
      break;

    default:
      res.status(HTTP_METHOD_NOT_ALLOWED).json({
        error: `Request method ${req.method} is not allowed`,
      });
  }
  return;
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
    res.status(200).send({
      data: result,
    });
    return;
  } catch (e: any) {
    switch (e.constructor) {
      case UserAlreadyExistsException:
        res.status(HTTP_BAD_REQUEST).json({
          error: "User with email already exists",
        });
        return;
      case UserDoesNotExistException:
        res.status(HTTP_NOT_FOUND).json({
          error: (e as Error).message,
        });
        return;
      default:
        res.status(HTTP_INTERNAL_SERVER_ERROR).json({
          error: (e as Error).message,
        });
        return;
    }
  }
}

async function editPasswordHandler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id;
  try {
    const result = await editPassword(req.body, String(id));
    res.status(200).send({
      data: result,
    });
    return;
  } catch (e: any) {
    switch (e.constructor) {
      case UserDoesNotExistException:
        res.status(HTTP_NOT_FOUND).json({
          error: (e as Error).message,
        });
        return;
      case UserCredentialsIncorrectException:
        res.status(HTTP_UNAUTHORIZED).json({
          error: "Old password is incorrect",
        });
        return;
      default:
        res.status(HTTP_INTERNAL_SERVER_ERROR).json({
          error: (e as Error).message,
        });
        return;
    }
  }
}
