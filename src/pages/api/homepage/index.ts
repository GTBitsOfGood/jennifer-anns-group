import HomePageModel from "@/server/db/models/HomePageModel";
import { HTTP_STATUS_CODE } from "@/utils/consts";
import {
  HomePageDoesNotExistException,
  HomePageException,
  HomePageInvalidInputException,
} from "@/utils/exceptions/homepage";
import { editHomePageSchema } from "@/utils/types";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const homePage = await HomePageModel.findOne({ singleton: true });

    switch (req.method) {
      case "PUT":
        const parsedData = editHomePageSchema.safeParse(JSON.parse(req.body));
        if (!parsedData.success) {
          throw new HomePageInvalidInputException();
        }

        if (homePage) {
          await HomePageModel.findOneAndUpdate(
            { singleton: true },
            parsedData.data,
          );
        } else {
          await HomePageModel.create({ ...parsedData.data, singleton: true });
        }
        return res.status(HTTP_STATUS_CODE.OK).send({
          message: "Home page successfully updated!",
        });
      case "GET":
        if (!homePage) {
          throw new HomePageDoesNotExistException();
        }

        return res.status(HTTP_STATUS_CODE.OK).send(homePage);
      default:
        return res.status(HTTP_STATUS_CODE.METHOD_NOT_ALLOWED).send({
          error: `Request method ${req.method} is not allowed`,
        });
    }
  } catch (e: any) {
    if (e instanceof HomePageException) {
      return res.status(e.code).send(e.message);
    }
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send(e.message);
  }
}
