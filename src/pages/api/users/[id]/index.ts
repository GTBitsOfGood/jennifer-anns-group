import {
  editUser,
  getUser,
  editPassword,
  resetPassword,
  deleteUser,
} from "../../../../server/db/actions/UserAction";
import { NextApiRequest, NextApiResponse } from "next";
import { HTTP_STATUS_CODE } from "@/utils/consts";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { UserLabel } from "@/utils/types";
import {
  UserDoesNotExistException,
  UserException,
  UserInvalidInputException,
  GenericUserErrorException,
} from "@/utils/exceptions/user";
import AdminModel from "@/server/db/models/AdminModel";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { authenticateAdminOrSameUser } from "../../auth/[...nextauth]";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  //Endpoints only accessible by admin or same user
  const authenticated = await authenticateAdminOrSameUser(
    req,
    res,
    req.query.id as string,
  );
  if (authenticated !== true) {
    return authenticated;
  }

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

  if (req.body._id != req.query.id) {
    //Bad request, cannot change id
    return res.status(HTTP_STATUS_CODE.BAD_REQUEST).send({
      error: "Changing the id is not allowed.",
    });
  }
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
    const session = await getServerSession(req, res, authOptions);
    //The session of the user calling this API endpoint is not necessarily the same as the one using it,
    //either the admin or the sameUser.

    const user = await getUser(req.body._id);
    const emailModified = req.body.email !== user.email;
    // const changeToAdmin =
    //   req.body.label == "administrator" &&
    //   session?.user.label !== "administrator";
    // // if (changeToAdmin) {
    //   //Non-admin cannot make others admin
    //   throw new GenericUserErrorException(
    //     "Non-admin cannot change a user to admin",
    //   );
    // }
    //Ensure label is one of the four allowed value
    const userLabels = {
      Educator: "educator",
      Student: "student",
      Parent: "parent",
      Administrator: "administrator",
    };
    if (!Object.values(userLabels).includes(req.body.label as UserLabel)) {
      throw new GenericUserErrorException(
        `Label must be one of ${Object.values(userLabels)}`,
      );
    }
    if (emailModified) {
      //Email is being changed, verify cookie exists. if it does, delete it.
      if (!req.cookies.emailVerificationJwt) {
        throw new GenericUserErrorException(
          "Email Verification Process incomplete.",
        );
      }
      const { email } = emailObject.parse(
        jwt.verify(
          req.cookies.emailVerificationJwt,
          process.env.NEXTAUTH_SECRET,
        ),
      );
      if (email !== req.body.email) {
        throw new UserInvalidInputException();
      }
    }
    const result = await editUser(req.body);
    if (emailModified) {
      //Delete the cookie
      const serializedCookie = cookie.serialize(
        "emailVerificationJwt",
        "invalidValue",
        {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 0, // Expire the cookie
          path: "/",
        },
      );
      return res
        .status(HTTP_STATUS_CODE.OK)
        .setHeader("Set-Cookie", serializedCookie)
        .send({ result });
    }
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
const emailObject = z.object({
  email: z.string().email("User has not been verified for password reset"),
});

async function resetPasswordHandler(req: NextApiRequest, res: NextApiResponse) {
  //Check for cookie like for other api at /api/auth/password-reset

  try {
    const id = req.query.id;

    const { email } = emailObject.parse(
      jwt.verify(
        req.cookies.passwordResetJwt || "",
        process.env.NEXTAUTH_SECRET,
      ),
    );
    //Call and verify the email equals
    const user = await getUser(id as string);
    if (user.email !== email) {
      return res
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .send({ error: "Invalid cookie" });
    }
    const { newPassword } = req.body;
    if (!newPassword) {
      return res
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .send({ error: "New password is required" });
    }
    await resetPassword(newPassword, String(id));

    //Invalidate cookie
    const serializedCookie = cookie.serialize(
      "passwordResetJwt",
      "invalidValue",
      {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 0, // Expire the cookie
        path: "/",
      },
    );
    return res
      .status(HTTP_STATUS_CODE.CREATED)
      .setHeader("Set-Cookie", serializedCookie)
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
