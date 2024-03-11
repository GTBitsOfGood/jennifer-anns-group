import { createAdmin, getAdminByEmail } from "@/server/db/actions/AdminAction";
import { HTTP_STATUS_CODE } from "@/utils/consts";
import {
  AdminException,
  AdminInvalidInputException,
} from "@/utils/exceptions/admin";
import { adminSchema } from "@/utils/types";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "POST":
      return postAdminHandler(req, res);
    case "GET":
      return getAdminHandler(req, res);
    default:
      return res.status(HTTP_STATUS_CODE.METHOD_NOT_ALLOWED).json({
        error: `Request method ${req.method} is not allowed`,
      });
  }
}

async function postAdminHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const parsedData = adminSchema.safeParse(req.body);
    if (!parsedData.success) {
      throw new AdminInvalidInputException();
    }
    const newAdmin = await createAdmin(parsedData.data);
    return res.status(HTTP_STATUS_CODE.CREATED).send({
      _id: newAdmin._id,
    });
  } catch (e: any) {
    if (e instanceof AdminException) {
      return res.status(e.code).send(e.message);
    }
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send(e.message);
  }
}

async function getAdminHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const email = req.query.email;
    if (!email || Array.isArray(email)) {
      throw new AdminInvalidInputException();
    }
    const newAdmin = await getAdminByEmail(email);
    return res.status(HTTP_STATUS_CODE.OK).send(newAdmin);
  } catch (e: any) {
    if (e instanceof AdminException) {
      return res.status(e.code).send(e.message);
    }
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send(e.message);
  }
}
