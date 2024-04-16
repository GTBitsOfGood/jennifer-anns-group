import { HTTP_STATUS_CODE } from "@/utils/consts";
import {
  HomePageDoesNotExistException,
  HomePageException,
  HomePageInvalidInputException,
} from "@/utils/exceptions/homepage";
import { editHomePageSchema, homePageSchema } from "@/utils/types";
import { NextApiRequest, NextApiResponse } from "next";
import {
  createHomePage,
  editHomePage,
  getHomePage,
} from "@/server/db/actions/HomePageAction";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const homePage = await getHomePage();

    switch (req.method) {
      case "PUT":
        if (homePage) {
          const parsedData = editHomePageSchema.safeParse(JSON.parse(req.body));
          if (!parsedData.success) {
            throw new HomePageInvalidInputException();
          }

          await editHomePage(parsedData.data);
        } else {
          const parsedData = homePageSchema
            .omit({ singleton: true })
            .safeParse(JSON.parse(req.body));
          if (!parsedData.success) {
            throw new HomePageInvalidInputException();
          }

          await createHomePage(parsedData.data);
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
      return res.status(e.code).send({ error: e.message });
    }
    return res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
      .send({ error: e.message });
  }
}
