import { NextApiRequest, NextApiResponse } from "next";
import { themeSchema } from "@/utils/types";
import { ITheme } from "@/server/db/models/ThemeModel";
import { createTheme, getThemes } from "@/server/db/actions/ThemeAction";
import {
  ThemeException,
  ThemeInvalidInputException,
  customErrorHandler,
} from "@/utils/exceptions";
import { z } from "zod";
import { HTTP_STATUS_CODE } from "@/utils/consts";

const createThemeSchema = themeSchema.extend({
  games: z.array(z.string().length(24)),
});

export type CreateThemeInput = z.infer<typeof createThemeSchema>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // try {
  switch (req.method) {
    case "GET":
      return getThemeHandler(req, res);
    case "POST":
      return postThemeHandler(req, res);
  }
  return res.status(405).send({
    error: `Request method ${req.method} is not allowed`,
  });
  // } catch (error) {
  //   return customErrorHandler(res, error);
  // }
}

async function getThemeHandler(req: NextApiRequest, res: NextApiResponse) {
  const themes = await getThemes();
  return res.status(HTTP_STATUS_CODE.OK).send(themes);
}

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
      return res.status(e.code);
    }
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
}
