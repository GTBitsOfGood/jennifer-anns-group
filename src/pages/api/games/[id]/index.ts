import { getGameById } from "@/server/db/actions/GameAction";

export default async function handler(req: any, res: any) {
    const gameId = req.query.id;
    if (req.method == "GET") {
        try {
          const game = await getGameById(gameId);
          if (game == null) {
            return res.status(404).send({
                success: false,
                message: `Could not find game with id: ${gameId}`,
            })
          }
          return res.status(200).send({
            success: true,
            message: "Game retrieved successfully",
            data: game,
          });
        } catch (error: any) {
          return res.status(500).send({
            success: false,
            message: error.message
          });
        }
      }
      return res.status(405).send({
        success: false,
        message: `Request method ${req.method} is not allowed`,
      });
}