import { useCallback, useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../ui/pagination";
import { DataTable } from "./DataTable";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

type IncDecInput = { type: "inc" | "dec" };
type DirectInput = { desiredPage: number };
type PageChangeHandlerInput = IncDecInput | DirectInput;
interface PaginatedTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data?: TData[];
  itemsPerPage: number;
  setSelectedRow?: React.Dispatch<React.SetStateAction<number>>;
  selectedRow?: number;
}

export function PaginatedTable<TData, TValue>({
  columns,
  data,
  itemsPerPage,
  setSelectedRow,
  selectedRow,
}: PaginatedTableProps<TData, TValue>) {
  const numPages = data && Math.ceil(data.length / itemsPerPage);
  const [paginatedData, setPaginatedData] = useState<TData[]>(
    (data ?? []).slice(0, itemsPerPage),
  );
  const [currPage, setCurrPage] = useState(1);

  const [items, setItems] = useState<Array<string | number>>([]);
  const handlePageChange = useCallback(
    (input: PageChangeHandlerInput) => {
      const type = Object.hasOwn(input, "type")
        ? (input as IncDecInput).type
        : undefined;
      const desiredPage = Object.hasOwn(input, "desiredPage")
        ? (input as DirectInput).desiredPage
        : undefined;

      const modifier = type === "inc" ? 1 : -1;
      const targetPage = desiredPage || currPage + modifier;
      if (numPages === undefined) return;
      if (targetPage <= 0) return;
      if (targetPage > numPages) return;
      setCurrPage(targetPage);
    },
    [numPages, currPage, data],
  );

  const { floor, min, max } = Math;
  const range = (lo: number, hi: number) =>
    Array.from({ length: hi - lo }, (_, i) => i + lo);

  const pagination =
    (count: number, ellipsis = "…") =>
    (page: number, total: number) => {
      const start = max(
        1,
        min(page - floor((count - 3) / 2), total - count + 2),
      );
      const end = Math.min(
        total,
        Math.max(page + floor((count - 4 + 2 * (count % 2)) / 2), count - 1),
      );
      return [
        ...(start > 2
          ? start === 3
            ? [1, 2]
            : [1, ellipsis]
          : start > 1
            ? [1]
            : []),
        ...range(start, end + 1),
        ...(end < total - 1
          ? end === total - 2
            ? [total - 1, total]
            : [ellipsis, total]
          : end < total
            ? [total]
            : []),
      ];
    };

  useEffect(() => {
    if (!numPages) return;
    const newItems = pagination(4)(currPage, numPages);
    setItems(newItems);
    setPaginatedData(
      data.slice((currPage - 1) * itemsPerPage, currPage * itemsPerPage),
    );
    setSelectedRow && setSelectedRow((currPage - 1) * itemsPerPage);
  }, [currPage, numPages, data]);

  return (
    <>
      {data ? (
        <div className="flex h-full flex-col justify-between">
          <div className="my-6 w-full">
            <DataTable
              columns={columns}
              data={paginatedData}
              minRowIndex={(currPage - 1) * itemsPerPage}
              setSelectedRow={setSelectedRow}
              selectedRow={selectedRow}
            />
          </div>
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem
                onClick={() =>
                  handlePageChange({
                    type: "dec",
                  })
                }
              >
                <PaginationPrevious disabled={currPage === 1} />
              </PaginationItem>
              {items.map((page, index) => {
                if (typeof page === "string") {
                  return (
                    <PaginationItem key={index}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                } else {
                  return (
                    <PaginationItem
                      key={index}
                      onClick={() =>
                        handlePageChange({
                          desiredPage: page,
                        })
                      }
                    >
                      <PaginationLink isActive={page === currPage}>
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
              })}
              <PaginationItem
                onClick={() =>
                  handlePageChange({
                    type: "inc",
                  })
                }
              >
                <PaginationNext disabled={currPage === numPages!} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      ) : (
        // setSelectedRow shows us if this is the game info table or user leaderboard table
        // Should probably find a better way to determine what table it is
        <div className="flex h-full w-full flex-col items-center justify-center">
          <Image
            src={`/orange_heart.svg`}
            alt="No data"
            width={90}
            height={70}
          />
          <div className="mt-4 text-center text-2xl font-semibold text-orange-primary">
            Sorry, no {setSelectedRow ? "game info" : "user leaderboard"}!
          </div>
          <div className="text-gray-text text-center">
            No users{" "}
            {setSelectedRow
              ? "visited the site"
              : "downloaded or played this game"}{" "}
            today.
          </div>
        </div>
      )}
    </>
  );
}
