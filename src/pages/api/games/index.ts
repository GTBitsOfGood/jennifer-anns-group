import { HTTP_STATUS_CODE } from "@/utils/consts";
import { z, RefinementCtx } from "zod";
import {
  createGame,
  getSelectedGames,
} from "../../../server/db/actions/GameAction";
import { AllBuilds, GameContentEnum, gameSchema } from "../../../utils/types";
import { NextApiRequest, NextApiResponse } from "next";
import {
  GameInvalidInputException,
  GameException,
} from "../../../utils/exceptions/game";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  switch (req.method) {
    case "GET":
      return getGamesHandler(req, res);
    case "POST":
      return postGameHandler(req, res);
    default:
      return res.status(HTTP_STATUS_CODE.METHOD_NOT_ALLOWED).send({
        error: `Request method ${req.method} is not allowed`,
      });
  }
}

async function getGamesHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const parsedQuery = GetGameQuerySchema.safeParse(req.query);
    if (!parsedQuery.success) {
      //Convert to current format.
      return res
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .send(parsedQuery.error.format());
    }
    const games = await getSelectedGames(parsedQuery.data);
    return res.status(HTTP_STATUS_CODE.OK).send(games);
  } catch (e: any) {
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send(e.message);
  }
}

async function postGameHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const parsedData = gameSchema.safeParse(JSON.parse(req.body));
    if (!parsedData.success) {
      throw new GameInvalidInputException();
    }
    const newGame = await createGame(parsedData.data);
    return res.status(HTTP_STATUS_CODE.CREATED).send({
      ...newGame,
      _id: newGame._id.toString(),
    });
  } catch (e: any) {
    if (e instanceof GameException) {
      return res.status(e.code).send(e.message);
    }
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send(e.message);
  }
}

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
    .array(z.nativeEnum(AllBuilds))
    .or(z.nativeEnum(AllBuilds).transform(putSingleStringInArray))
    .optional(),
  gameContent: z
    .array(z.nativeEnum(GameContentEnum))
    .or(z.nativeEnum(GameContentEnum).transform(putSingleStringInArray)) //In this case where only thing is passed into gameContent.
    .optional(),
  page: z.string().transform(convertINT).pipe(z.number().gte(1)).optional(),
});
export type GameQuery = z.infer<typeof GetGameQuerySchema>;
