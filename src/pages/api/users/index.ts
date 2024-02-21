import { z } from "zod";
import {
  createUser,
  editUser,
  getUser,
  editPassword,
} from "../../../server/db/actions/UserAction";
import { userSchema } from "../../../utils/types";
import { NextApiRequest, NextApiResponse } from "next";
import {
  HTTP_BAD_REQUEST,
  HTTP_CREATED,
  HTTP_INTERNAL_SERVER_ERROR,
  HTTP_METHOD_NOT_ALLOWED,
  HTTP_NOT_FOUND,
  HTTP_UNAUTHORIZED,
} from "@/utils/consts";
import {
  GenericUserErrorException,
  UserAlreadyExistsException,
  UserCredentialsIncorrectException,
  UserDoesNotExistException,
} from "@/utils/exceptions";

export const createUserSchema = userSchema
  .omit({ hashedPassword: true })
  .extend({
    password: z.string(),
  });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      await createUserHandler(req, res);
      break;

    case "GET":
      const email = String(req.query.email);
      try {
        const user = await getUser(email);
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

async function createUserHandler(req: NextApiRequest, res: NextApiResponse) {
  const parsedData = createUserSchema.safeParse(JSON.parse(req.body));
  if (!parsedData.success) {
    res.status(HTTP_BAD_REQUEST).json({
      error: parsedData.error.format(),
    });
    return;
  }

  try {
    const user = await createUser(parsedData.data);
    res.status(HTTP_CREATED).json({
      _id: user._id,
    });
    return;
  } catch (e) {
    let httpCode = HTTP_INTERNAL_SERVER_ERROR;

    if (e instanceof UserAlreadyExistsException) httpCode = HTTP_BAD_REQUEST;

    res.status(httpCode).json({
      error: (e as Error).message,
    });
    return;
  }
}

async function editUserHandler(req: NextApiRequest, res: NextApiResponse) {
  const { type } = req.query;
  if (type === "info") {
    // Editing user profile
    try {
      const result = await editUser(req.body);
      res.status(200).send({
        data: result,
      });
      return;
    } catch (e: unknown) {
      if (e instanceof GenericUserErrorException) {
        res.status(HTTP_BAD_REQUEST).json({
          error: "User with email already exists",
        });
        return;
      }
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
  } else if (type === "password") {
    // Editing user password
    try {
      const result = await editPassword(req.body);
      res.status(200).send({
        data: result,
      });
      return;
    } catch (e: unknown) {
      if (e instanceof UserDoesNotExistException) {
        res.status(HTTP_NOT_FOUND).json({
          error: (e as Error).message,
        });
        return;
      }
      if (e instanceof UserCredentialsIncorrectException) {
        res.status(HTTP_UNAUTHORIZED).json({
          error: "Old password is incorrect",
        });
        return;
      }
      res.status(HTTP_INTERNAL_SERVER_ERROR).json({
        error: (e as Error).message,
      });
      return;
    }
  }
}
