import { z } from "zod";
import GameCard from "./GameCard";
import { gameSchema } from "@/utils/types";
import wrapPromise from "@/components/wrapPromise";
import { useEffect, useRef, useState } from "react";
import {
  generateQueryUrl,
  PageRequiredGameQuery,
} from "@/components/Admin/ThemesTags/GamesSection";

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
  setNumPages: React.Dispatch<React.SetStateAction<number>>;
  numPages: number;
  filters: PageRequiredGameQuery;
}

export default function GameCardView({
  setNumPages,
  numPages,
  filters,
}: Props) {
  const [gameResultsResource, setGameResultsResource] = useState({
    read: () => {
      return null;
    },
  });

  const numPagesRef = useRef<number>(numPages);

  useEffect(() => {
    setGameResultsResource(filterGames(filters));
  }, [filters]);

  const data = gameResultsResource.read() as {
    games: z.infer<typeof gameDataSchema>[];
    numPages: number;
    page: number;
  } | null;

  useEffect(() => {
    if (data && data.numPages !== numPagesRef.current) {
      setNumPages(data.numPages);
      numPagesRef.current = data.numPages;
    }
  }, [data]);

  return (
    <>
      {data ? (
        <div className="ml-6 flex w-full flex-row flex-wrap">
          {data.games?.length > 0 ? (
            data.games.map((game: z.infer<typeof gameDataSchema>) => (
              <div key={game.name} className="mb-6 ml-6">
                <GameCard game={game} />
              </div>
            ))
          ) : (
            <div className="flex w-full flex-row justify-center">
              <p className="mt-30 w-96 text-center font-sans text-2.5xl font-medium text-blue-primary">
                Oops! No games match your criteria
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex h-96 w-full items-center justify-center">
          <div className="h-14 w-14 animate-ping rounded-full bg-orange-primary"></div>
        </div>
      )}
    </>
  );
}
