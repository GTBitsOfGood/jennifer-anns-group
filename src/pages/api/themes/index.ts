import { NextApiRequest, NextApiResponse } from "next";
import { themeSchema } from "@/utils/types";
import { ITheme } from "@/server/db/models/ThemeModel";
import { createTheme } from "@/server/db/actions/ThemeAction";
import { customErrorHandler } from "@/utils/exceptions";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    switch (req.method) {
      case "POST":
        let result;
        //First ensure that req.body is of the proper type, via zod.
        //This gives us runtime verification
        const safeBody: ITheme = themeSchema.parse(JSON.parse(req.body));
        result = await createTheme(safeBody);

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
