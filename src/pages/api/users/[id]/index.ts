import {
  editUser,
  getUser,
  editPassword,
  resetPassword,
  deleteUser,
} from "../../../../server/db/actions/UserAction";
import { NextApiRequest, NextApiResponse } from "next";
import { HTTP_STATUS_CODE } from "@/utils/consts";
import {
  UserDoesNotExistException,
  UserException,
  UserInvalidInputException,
} from "@/utils/exceptions/user";
import AdminModel from "@/server/db/models/AdminModel";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "GET":
      return getUserHandler(req, res);
    case "PUT":
      return editUserHandler(req, res);
    case "DELETE":
      return deleteUserHandler(req, res);
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
    user.notes = user.notes.filter((note) => !note.markedToDelete);
    res.status(HTTP_STATUS_CODE.OK).send(user);
  } catch (e: any) {
    if (e instanceof UserException) {
      return res.status(e.code).send({ error: e.message });
    }
    return res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
      .send({ error: e.message });
  }
}

async function editUserHandler(req: NextApiRequest, res: NextApiResponse) {
  const type = req.query.type;

  if (type === "info") {
    return editProfileHandler(req, res);
  } else if (type === "password") {
    return editPasswordHandler(req, res);
  } else if (type === "resetpassword") {
    return resetPasswordHandler(req, res);
  } else {
    return res.status(HTTP_STATUS_CODE.BAD_REQUEST).send({
      error: `Request type PUT: ${type} is not allowed`,
    });
  }
}

async function editProfileHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await editUser(req.body);
    return res.status(HTTP_STATUS_CODE.OK).send({ result });
  } catch (e: any) {
    if (e instanceof UserException) {
      return res.status(e.code).send({ error: e.message });
    }
    return res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
      .send({ error: e.message });
  }
}

async function editPasswordHandler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id;
  try {
    const result = await editPassword(req.body, String(id));
    return res.status(HTTP_STATUS_CODE.OK).send({ result });
  } catch (e: any) {
    if (e instanceof UserException) {
      return res.status(e.code).send({ error: e.message });
    }
    return res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
      .send({ error: e.message });
  }
}

async function resetPasswordHandler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id;

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || session.user._id !== id) {
      return res
        .status(HTTP_STATUS_CODE.UNAUTHORIZED)
        .send({ error: "User has not been validated." });
    }
    const { newPassword } = req.body;
    if (!newPassword) {
      return res
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .send({ error: "New password is required" });
    }
    await resetPassword(newPassword, String(id));
    return res
      .status(HTTP_STATUS_CODE.CREATED)
      .send({ message: "Password reset successfully" });
  } catch (e: any) {
    return res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
      .send({ error: e.message });
  }
}

async function deleteUserHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userId = req.query.id;
    if (!userId || Array.isArray(userId)) {
      throw new UserInvalidInputException();
    }
    const deletedUser = await deleteUser(userId);

    const correspondingAdmin = await AdminModel.findOne({
      email: deletedUser.email,
    });
    if (correspondingAdmin) {
      await AdminModel.findOneAndDelete({ email: deletedUser.email });
    }

    return res.status(HTTP_STATUS_CODE.OK).send(deletedUser);
  } catch (e: any) {
    return res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
      .send({ error: e.message });
  }
}
