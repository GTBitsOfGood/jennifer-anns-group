import { deleteAdmin } from "@/server/db/actions/AdminAction";
import { HTTP_STATUS_CODE } from "@/utils/consts";
import { AdminInvalidInputException } from "@/utils/exceptions/admin";
import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "DELETE":
      return deleteAdminHandler(req, res);
    default:
      return res.status(HTTP_STATUS_CODE.METHOD_NOT_ALLOWED).json({
        error: `Request method ${req.method} is not allowed`,
      });
  }
}

async function deleteAdminHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const adminId = req.query.id;
    if (!adminId || Array.isArray(adminId)) {
      throw new AdminInvalidInputException();
    }
    const deletedAdmin = await deleteAdmin(
      new mongoose.Types.ObjectId(adminId),
    );
    return res.status(HTTP_STATUS_CODE.OK).send(deletedAdmin);
  } catch (e: any) {
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send(e.message);
  }
}
