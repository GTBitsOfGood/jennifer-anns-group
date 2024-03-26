import { IGame } from "@/server/db/models/GameModel";
import { useQuery } from "@tanstack/react-query";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { DataTable } from "./Table/data-table";
import { columns } from "./Table/columns";
import { useState } from "react";
import { GameQuery, GetGamesOutput } from "@/pages/api/games";
import { ExtendId } from "@/utils/types";
import { GetSelectedGamesOutput } from "@/server/db/actions/GameAction";
import { Spinner } from "@chakra-ui/react";

function generateQueryUrl(filters: GameQuery) {
  let gamesUrl = "/api/games";
  const searchParams: string[] = [];
  Object.keys(filters).forEach((k) => {
    const val = filters[k as keyof GameQuery];
    if (Array.isArray(val)) {
      val.forEach((filterVal) => {
        searchParams.push(`${k}=${filterVal}`);
      });
    } else {
      searchParams.push(`${k}=${val}`);
    }
  });
  return `${gamesUrl}?${searchParams.join("&")}`;
}

function GamesSection() {
  const [filters, setFilters] = useState<GameQuery>({
    page: 1,
  });

  const { status: gamesStatus, data } = useQuery({
    queryKey: ["allGames", filters],
    queryFn: () =>
      fetch(generateQueryUrl(filters)).then((res) =>
        res.json(),
      ) as Promise<GetGamesOutput>,
  });

  const games = data?.games;
  const count = data?.count;

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-row content-start gap-2">
        <Input placeholder="Filter by name" />
        <Button variant="outline2">Filter</Button>
      </div>
      <div className="w-full">
        {games ? <DataTable columns={columns} data={games} /> : <Spinner />}
      </div>
    </div>
  );
}

export default GamesSection;
