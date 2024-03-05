import { createNote, getNotes } from "@/server/db/actions/NoteAction";
import { getUser } from "@/server/db/actions/UserAction";
import { HTTP_STATUS_CODE } from "@/utils/consts";
import { UserDoesNotExistException } from "@/utils/exceptions/user";
import { noteSchema } from "@/utils/types";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const id = req.query.id as string;

  switch (req.method) {
    case "GET":
      try {
        const gameId = req.query.gameId as string | undefined;
        const notes = await getNotes(id, gameId);

        return res.status(200).send({
          data: notes,
        });
      } catch (e) {
        if (e instanceof UserDoesNotExistException) {
          res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
            error: (e as Error).message,
          });
          return;
        }
        res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
          error: (e as Error).message,
        });
      }
      break;
    case "POST":
      try {
        const user = await getUser(id);

        const parsedData = noteSchema.safeParse(JSON.parse(req.body));
        if (!parsedData.success) {
          return res.status(422).send({
            error: parsedData.error.format(),
          });
        }
        const result = await createNote(parsedData.data, user);
        return res.status(201).send({
          data: { id: result },
        });
      } catch (e: unknown) {
        if (e instanceof UserDoesNotExistException) {
          res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
            error: (e as Error).message,
          });
          return;
        }
        res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
          error: (e as Error).message,
        });
        return;
      }
    default:
      res.status(HTTP_STATUS_CODE.METHOD_NOT_ALLOWED).json({
        error: `Request method ${req.method} is not allowed`,
      });
  }
}
