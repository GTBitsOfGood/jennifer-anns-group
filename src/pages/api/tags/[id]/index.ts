import { NextApiResponse, NextApiRequest } from "next";
import { deleteTag } from "@/server/db/actions/TagAction";
import { ObjectId } from "mongodb";
import {
  GenericUserErrorException,
  customErrorHandler,
} from "@/utils/exceptions";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "DELETE":
        //No need to ensure correct id, checking in action
        const potential_id = req.query.id;
        if (!potential_id || Array.isArray(potential_id)) {
          throw new GenericUserErrorException("ObjectId is invalid");
        }
        const id: string = potential_id;
        if (ObjectId.isValid(id)) {
          await deleteTag(new ObjectId(id));
        } else {
          throw new GenericUserErrorException("ObjectId is invalid");
        }

        return res.status(200).send({
          message: "Object successfully deleted",
        });
    }
    return res.status(405).send({
      error: `Method ${req.method} not allowed at this endpoint`,
    });
  } catch (error) {
    return customErrorHandler(res, error);
  }
}
