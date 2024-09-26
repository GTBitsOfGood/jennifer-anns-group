import { z } from "zod";
import GameCard from "./GameCard";
import { gameSchema } from "@/utils/types";
import {
  PageRequiredGameQuery,
  generateQueryUrl,
} from "@/components/ThemesTags/GamesSection";
import wrapPromise from "@/components/wrapPromise";
import { useEffect, useState } from "react";

const idSchema = z.string().length(24);
export const gameDataSchema = gameSchema.extend({
  _id: idSchema,
});

const filterGames = (filters: PageRequiredGameQuery) => {
  const promise = fetch(generateQueryUrl(filters)).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to fetch game");
    }
    return res.json();
  });
  return wrapPromise(promise);
};

let gameResultsResource: ReturnType<typeof wrapPromise> = {
  read: () => {
    return null;
  },
};

interface Props {
  filters: PageRequiredGameQuery;
}

export default function GameCardView({ filters }: Props) {
  useEffect(() => {
    gameResultsResource = filterGames(filters);
  }, [filters]);

  // const [results, setResults] = useState<z.infer<typeof gameDataSchema>[]>([]);
  const data = gameResultsResource.read();

  return (
    <div className="ml-6 flex w-full flex-row flex-wrap">
      {data &&
        (data.games?.length > 0 ? (
          data.games.map((game) => {
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
        ))}
    </div>
  );
}
