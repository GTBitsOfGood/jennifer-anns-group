import { z } from "zod";
import GameCard from "./GameCard";
import { gameSchema } from "@/utils/types";

const idSchema = z.string().length(24);
export const gameDataSchema = gameSchema.extend({
  _id: idSchema,
});

interface Props {
  results: z.infer<typeof gameDataSchema>[];
}

export default function GameCardView({ results }: Props) {
  return (
    <div className="ml-6 flex w-full flex-row flex-wrap">
      {results?.length > 0 ? (
        results.map((game) => {
          return (
            <div key={game.name} className="mb-6 ml-6">
              <GameCard game={game} />
            </div>
          );
        })
      ) : (
        <div className="flex w-full flex-row justify-center">
          <p className="mb-[50vh] mt-40 w-[360px]	text-center font-sans text-[34px] font-medium text-blue-primary">
            Oops! No games match this search
          </p>
        </div>
      )}
    </div>
  );
}
