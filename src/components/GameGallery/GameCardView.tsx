import { z } from "zod";
import GameCard from "./GameCard";
import { gameDataSchema } from "@/pages/games";

interface Props {
  games: z.infer<typeof gameDataSchema>[];
}

export default function GameCardView({ games }: Props) {
  return (
    <div className="ml-6 flex w-full flex-row flex-wrap">
      {games.length > 0 ? (
        games.map((game) => {
          return (
            <div key={game.name} className="mb-6 ml-6">
              <GameCard game={game} />
            </div>
          );
        })
      ) : (
        <div className="flex w-full flex-row justify-center">
          <p className="mt-40 w-[360px]	text-center font-sans text-[34px] font-medium text-blue-primary">
            Oops! No games match this search
          </p>
        </div>
      )}
    </div>
  );
}
