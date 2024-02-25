import { customErrorHandler } from "@/utils/exceptions";
import {
  createGame,
  getSelectedGames,
} from "../../../server/db/actions/GameAction";
import { gameSchema } from "../../../utils/types";
import { NextApiRequest, NextApiResponse } from "next";
import { z, RefinementCtx } from "zod";
//Ensure its an integer
// GameContentEnum
const GameContentEnum = {
  answerKey: "answerKey",
  parentingGuide: "parentingGuide",
  lessonPlan: "lesson",
  videoTrailer: "videoTrailer",
};

// GameBuildsEnum
const GameBuildsEnum = {
  amazon: "amazon",
  android: "android",
  appstore: "appstore",
  linux: "linux",
  mac: "mac",
  webgl: "webgl",
  windows: "windows",
};

const convertINT = (val: string, ctx: RefinementCtx) => {
  const result = parseInt(val);
  if (isNaN(result)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Not a valid integer",
    });
    return z.NEVER;
  } else {
    return result;
  }
};
const putSingleStringInArray = (val: string) => {
  return [val];
};
//Query parameters can pass in a single value but need to be an array, so moddifying it to expect that.
export const GetGameQuerySchema = z.object({
  name: z.string().min(3).max(50).optional(),
  theme: z.string().optional(),
  tags: z
    .array(z.string())
    .or(z.string().transform(putSingleStringInArray))
    .optional(),
  accessibility: z
    .array(z.string())
    .or(z.string().transform(putSingleStringInArray))
    .optional(),
  gameBuilds: z
    .array(z.nativeEnum(GameBuildsEnum))
    .or(z.nativeEnum(GameBuildsEnum).transform(putSingleStringInArray))
    .optional(),
  gameContent: z
    .array(z.nativeEnum(GameContentEnum))
    .or(z.nativeEnum(GameContentEnum).transform(putSingleStringInArray)) //In this case where only thing is passed into gameContent.
    .optional(),
  page: z.string().transform(convertINT).pipe(z.number().gte(1)),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    switch (req.method) {
      case "GET":
        //Validate req.query
        console.log(req.query);
        const query = GetGameQuerySchema.parse(req.query); //JSON.parse not necessary

        const games = await getSelectedGames(query);
        return res.status(200).send({
          data: games,
        });

      case "POST":
        //How can I ensure that the values in req.body? are strings convertable to objects.

        const parsedData = gameSchema.safeParse(JSON.parse(req.body));
        if (!parsedData.success) {
          return res.status(422).send({
            error: parsedData.error.format(),
          });
        }
        const result = await createGame(parsedData.data);
        return res.status(201).send({
          data: { id: result },
        });
    }
    return res.status(405).send({
      error: `Request method ${req.method} is not allowed`,
    });
  } catch (error) {
    return customErrorHandler(res, error);
  }
}
