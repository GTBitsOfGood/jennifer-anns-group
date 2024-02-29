import { NextApiRequest, NextApiResponse } from "next";
import { themeSchema } from "@/utils/types";
import {
  createTheme,
  deleteTheme,
  getThemes,
} from "@/server/db/actions/ThemeAction";
import { z } from "zod";
import { HTTP_STATUS_CODE } from "@/utils/consts";
import {
  ThemeException,
  ThemeInvalidInputException,
} from "@/utils/exceptions/theme";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return getThemeHandler(req, res);
    case "POST":
      return postThemeHandler(req, res);
    case "DELETE":
      return deleteThemeHandler(req, res);
    default:
      return res.status(HTTP_STATUS_CODE.METHOD_NOT_ALLOWED).send({
        error: `Request method ${req.method} is not allowed`,
      });
  }
}

async function getThemeHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const themes = await getThemes();
    return res.status(HTTP_STATUS_CODE.OK).send(themes);
  } catch (e) {
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
}

const createThemeSchema = themeSchema.extend({
  games: z.array(z.string().length(24)),
});

export type CreateThemeInput = z.infer<typeof createThemeSchema>;

async function postThemeHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const parsedBody = createThemeSchema.safeParse(JSON.parse(req.body));
    if (!parsedBody.success) {
      throw new ThemeInvalidInputException();
    }
    const newTheme = await createTheme(parsedBody.data);
    return res.status(HTTP_STATUS_CODE.OK).send({
      ...newTheme,
      _id: newTheme._id.toString(),
    });
  } catch (e) {
    if (e instanceof ThemeException) {
      return res.status(e.code).send(e.message);
    }
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
}

const deleteThemeSchema = z.object({
  _id: z.string().length(24),
});

export type DeleteThemeInput = z.infer<typeof deleteThemeSchema>;

async function deleteThemeHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const parsedBody = deleteThemeSchema.safeParse(JSON.parse(req.body));
    if (!parsedBody.success) {
      throw new ThemeInvalidInputException();
    }
    const deletedTheme = await deleteTheme(parsedBody.data._id);
    return res.status(HTTP_STATUS_CODE.OK).send(deletedTheme);
  } catch (e) {
    if (e instanceof ThemeException) {
      return res.status(e.code).send("");
    }
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
}
