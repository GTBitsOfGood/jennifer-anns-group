import { NextApiRequest, NextApiResponse } from "next";
import { tagSchema } from "@/utils/types";
import { ITag } from "@/server/db/models/TagModel";
import {
  createTag,
  deleteTag,
  getTagsByType,
} from "@/server/db/actions/TagAction";
import { HTTP_STATUS_CODE } from "@/utils/consts";
import { z } from "zod";
import { TagException, TagInvalidInputException } from "@/utils/exceptions/tag";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return getTagsByTypeHandler(req, res);
    case "POST":
      return postTagHandler(req, res);
    case "DELETE":
      return deleteTagHandler(req, res);
    default:
      return res.status(HTTP_STATUS_CODE.METHOD_NOT_ALLOWED).send({
        error: `Request method ${req.method} is not allowed`,
      });
  }
}

async function getTagsByTypeHandler(req: NextApiRequest, res: NextApiResponse) {
  const tagsByType = await getTagsByType();
  return res.status(HTTP_STATUS_CODE.OK).send(tagsByType);
}

const createTagSchema = tagSchema.extend({
  games: z.array(z.string().length(24)),
});

export type CreateTagInput = z.infer<typeof createTagSchema>;

async function postTagHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const parsedBody = createTagSchema.safeParse(JSON.parse(req.body));
    if (!parsedBody.success) {
      throw new TagInvalidInputException();
    }
    const tag = await createTag(parsedBody.data);

    return res.status(HTTP_STATUS_CODE.CREATED).send({
      ...tag,
      _id: tag._id.toString(),
    });
  } catch (e) {
    if (e instanceof TagException) {
      return res.status(e.code).send(e.message);
    }
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send("");
  }
}

const deleteTagSchema = z.object({
  _id: z.string().length(24),
});

export type DeleteTagInput = z.infer<typeof deleteTagSchema>;
async function deleteTagHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const parsedBody = deleteTagSchema.safeParse(JSON.parse(req.body));
    if (!parsedBody.success) {
      throw new TagInvalidInputException();
    }
    const deletedTag = await deleteTag(parsedBody.data._id);
    return res.status(HTTP_STATUS_CODE.OK).send(deletedTag);
  } catch (e) {
    if (e instanceof TagException) {
      return res.status(e.code).send(e.message);
    }
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send("");
  }
}
