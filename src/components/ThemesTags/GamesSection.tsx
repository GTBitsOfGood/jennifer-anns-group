import { useQuery } from "@tanstack/react-query";
import { Input } from "../ui/input";
import { DataTable } from "./Table/data-table";
import { columns } from "./Table/columns";
import { useCallback, useState } from "react";
import { GameQuery, GetGamesOutput } from "@/pages/api/games";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { Spinner } from "@chakra-ui/react";
import FilterPopover from "./FilterPopover";

export type PageRequiredGameQuery = GameQuery &
  Required<Pick<GameQuery, "page">>;
type IncDecInput = { type: "inc" | "dec" };
type DirectInput = { desiredPage: number };
type PageChangeHandlerInput = IncDecInput | DirectInput;

const VISIBLE_NUM_PAGES_ONE_SIDE = 1;

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
  const [filters, setFilters] = useState<PageRequiredGameQuery>({
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
  const numPages = data?.numPages;

  const handlePageChange = useCallback(
    (input: PageChangeHandlerInput) => {
      const type = Object.hasOwn(input, "type")
        ? (input as IncDecInput).type
        : undefined;
      const desiredPage = Object.hasOwn(input, "desiredPage")
        ? (input as DirectInput).desiredPage
        : undefined;
      const currentPage = filters.page;

      const modifier = type === "inc" ? 1 : -1;
      const targetPage = desiredPage || currentPage + modifier;
      if (numPages === undefined) return;
      if (targetPage <= 0) return;
      if (targetPage > numPages) return;
      setFilters({ ...filters, page: targetPage });
    },
    [filters.page, numPages],
  );

  const pageArr = Array.from({ length: numPages! }).map((_, i) => i + 1);

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-row content-start gap-2">
        <Input
          className="w-40"
          placeholder="Filter by name"
          onChange={(e) => {
            const { name, ...rest } = filters;
            const value = e.target.value;
            if (value.length === 0) {
              setFilters(rest);
            }
            if (value.length < 3 || value.length > 50) return;
            setFilters({
              ...rest,
              name: e.target.value,
            });
          }}
        />
        <FilterPopover filters={filters} setFilters={setFilters} />
      </div>
      <div className="w-full">
        {games ? <DataTable columns={columns} data={games} /> : <Spinner />}
      </div>
      {gamesStatus === "success" ? (
        <Pagination>
          <PaginationContent>
            <PaginationItem
              onClick={() =>
                handlePageChange({
                  type: "dec",
                })
              }
            >
              <PaginationPrevious disabled={filters.page === 1} />
            </PaginationItem>
            {pageArr
              .filter((pageNum) => pageNum <= VISIBLE_NUM_PAGES_ONE_SIDE)
              .map((pageNum) => {
                return (
                  <PaginationItem
                    key={pageNum}
                    onClick={() =>
                      handlePageChange({
                        desiredPage: pageNum,
                      })
                    }
                  >
                    <PaginationLink isActive={pageNum === filters.page}>
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
            {filters.page > numPages! * 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            {pageArr
              .filter(
                (pageNum) =>
                  pageNum >= numPages! - VISIBLE_NUM_PAGES_ONE_SIDE &&
                  pageNum > VISIBLE_NUM_PAGES_ONE_SIDE,
              )
              .map((pageNum) => {
                return (
                  <PaginationItem
                    key={pageNum}
                    onClick={() =>
                      handlePageChange({
                        desiredPage: pageNum,
                      })
                    }
                  >
                    <PaginationLink isActive={pageNum === filters.page}>
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
            <PaginationItem
              onClick={() =>
                handlePageChange({
                  type: "inc",
                })
              }
            >
              <PaginationNext disabled={filters.page === numPages!} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : null}
    </div>
  );
}

export default GamesSection;
