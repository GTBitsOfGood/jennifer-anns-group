import { z } from "zod";
import GameCard from "./GameCard";
import { gameSchema } from "@/utils/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { PageRequiredGameQuery } from "../ThemesTags/GamesSection";

const idSchema = z.string().length(24);
export const gameDataSchema = gameSchema.extend({
  _id: idSchema,
});

interface Props {
  filtersApplied: boolean;
  setFiltersApplied: Dispatch<SetStateAction<boolean>>;
  gameBuilds: string[];
  gameContent: string[];
  accessibility: string[];
  tags: string[];
  name: string;
  selectedTheme: string;
  currPage: number;
  setNumPages: Dispatch<SetStateAction<number>>;
  filters: PageRequiredGameQuery;
  setFilters: Dispatch<SetStateAction<PageRequiredGameQuery>>;
}

export default function GameCardView({
  filtersApplied,
  setFiltersApplied,
  gameBuilds,
  gameContent,
  accessibility,
  tags,
  name,
  selectedTheme,
  currPage,
  setNumPages,
  filters,
  setFilters,
}: Props) {
  const [games, setGames] = useState<z.infer<typeof gameDataSchema>[]>([]);
  const gameBuildsMap: Record<string, string> = {
    Amazon: "amazon",
    Android: "android",
    "App Store": "appstore",
    Linux: "linux",
    Mac: "mac",
    WebGL: "webgl",
    Windows: "windows",
  };
  const gameContentMap: Record<string, string> = {
    "Parenting guide": "parentingGuide",
    "Lesson plan": "lessonPlan",
    "Video trailer": "videoTrailer",
    "Answer key": "answerKey",
  };

  useEffect(() => {
    getGames();
  }, []);

  useEffect(() => {
    if (filtersApplied) {
      setFilters({ ...filters, page: 1 });
      getGames();
      setFiltersApplied(false);
    }
  }, [filtersApplied]);

  useEffect(() => {
    getGames();
  }, [currPage]);

  async function getGames() {
    const params = new URLSearchParams();
    params.append("page", currPage.toString());

    if (gameBuilds.length > 0) {
      gameBuilds.forEach((gb) => {
        params.append("gameBuilds", gameBuildsMap[gb]);
      });
    }

    if (gameContent.length > 0) {
      gameContent.forEach((gc) => {
        params.append("gameContent", gameContentMap[gc]);
      });
    }

    if (accessibility.length > 0) {
      accessibility.forEach((acc) => {
        params.append("accessibility", acc);
      });
    }

    if (tags.length > 0) {
      tags.forEach((tag) => {
        params.append("tags", tag);
      });
    }

    if (name.length >= 3) {
      params.append("name", name);
    }

    if (selectedTheme !== "All Games") {
      params.append("theme", selectedTheme);
    }

    const queryString = params.toString();

    try {
      const response = await fetch(`/api/games/?${queryString}`);
      const data = await response.json();
      setGames(data.games);
      setNumPages(data.numPages);
    } catch (e: any) {
      console.log(e.message);
    }
  }

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
          <p className="mb-[50vh] mt-40 w-[360px]	text-center font-sans text-[34px] font-medium text-blue-primary">
            Oops! No games match this search
          </p>
        </div>
      )}
    </div>
  );
}
