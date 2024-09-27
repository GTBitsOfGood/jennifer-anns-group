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
    return res.json();
  });
  return wrapPromise(promise);
};

interface Props {
  filters: PageRequiredGameQuery;
}

export default function GameCardView({ filters }: Props) {
  const [gameResultsResource, setGameResultsResource] = useState({
    read: () => {
      return null;
    },
  });

  useEffect(() => {
    setGameResultsResource(filterGames(filters));
  }, [filters]);

  const data = gameResultsResource.read() as {
    games: z.infer<typeof gameDataSchema>[];
  } | null;
  return (
    <div className="ml-6 flex w-full flex-row flex-wrap">
      {data &&
        (data.games?.length > 0 ? (
          data.games.map((game: z.infer<typeof gameDataSchema>) => {
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
