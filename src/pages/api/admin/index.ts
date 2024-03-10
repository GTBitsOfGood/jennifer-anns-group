import { createAdmin } from "@/server/db/actions/AdminAction";
import { HTTP_STATUS_CODE } from "@/utils/consts";
import { adminSchema } from "@/utils/types";
import { NextApiRequest, NextApiResponse } from "next";

//write script to add first two emails to database
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "POST":
      return createAdminHandler(req, res);
    default:
      return res.status(HTTP_STATUS_CODE.METHOD_NOT_ALLOWED).json({
        error: `Request method ${req.method} is not allowed`,
      });
  }
}

async function createAdminHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const parsedData = adminSchema.safeParse(req.body);
    if (!parsedData.success) {
      //change to custom error
      throw new Error();
    }
    const newAdmin = await createAdmin(parsedData.data);
    return res.status(HTTP_STATUS_CODE.CREATED).send({
      _id: newAdmin._id,
    });
  } catch (e: any) {
    //   if (e instanceof UserException) {
    //     return res.status(e.code).send(e.message);
    //   }
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send(e.message);
  }
}
