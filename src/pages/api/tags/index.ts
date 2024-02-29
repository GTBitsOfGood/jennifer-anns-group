import { NextApiRequest, NextApiResponse } from "next";
import { tagSchema } from "@/utils/types";
import { ITag } from "@/server/db/models/TagModel";
import { createTag, getTagsByType } from "@/server/db/actions/TagAction";
import { customErrorHandler } from "@/utils/exceptions";
import { HTTP_STATUS_CODE } from "@/utils/consts";
import { z } from "zod";

export type CreateTagInput = ITag;
export type DeleteTagInput = {
  _id: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // try {
  switch (req.method) {
    case "GET":
      getTagsByTypeHandler(req, res);
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
  // } catch (error) {
  //   return customErrorHandler(res, error);
  // }
}

async function getTagsByTypeHandler(req: NextApiRequest, res: NextApiResponse) {
  const tagsByType = await getTagsByType();
  return res.status(HTTP_STATUS_CODE.OK).send(tagsByType);
}
