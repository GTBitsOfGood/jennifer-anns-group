import { NextApiRequest, NextApiResponse } from "next";
import { tagSchema } from "@/utils/types";
import { ITag } from "@/server/db/models/TagModel";
import { createTag } from "@/server/db/actions/TagAction";
import { ObjectId } from "mongodb";
import { ZodError } from "zod";
import { customErrorHandler } from "@/utils/exceptions";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "POST":
        let result;
        //First ensure that req.body is of the proper type, via zod.
        //This gives us runtime verification
        const safeBody: ITag = tagSchema.parse(JSON.parse(req.body));
        //Convert objectId's represented as strings into normal ObjectIds
        result = await createTag(safeBody);

        return res.status(201).send({
          data: { _id: result },
        });
    }
    return res.status(405).send({
      error: `Request method ${req.method} is not allowed`,
    });
  } catch (error) {
    return customErrorHandler(res, error);
  }
}
