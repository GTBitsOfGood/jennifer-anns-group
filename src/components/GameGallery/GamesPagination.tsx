import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { PageRequiredGameQuery } from "../ThemesTags/GamesSection";

type IncDecInput = { type: "inc" | "dec" };
type DirectInput = { desiredPage: number };
type PageChangeHandlerInput = IncDecInput | DirectInput;

interface Props {
  setCurrPage: Dispatch<SetStateAction<number>>;
  numPages: number;
  filters: PageRequiredGameQuery;
  setFilters: Dispatch<SetStateAction<PageRequiredGameQuery>>;
}

export default function GamesPagination({
  setCurrPage,
  numPages,
  filters,
  setFilters,
}: Props) {
  const [items, setItems] = useState<Array<string | number>>([]);

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

  useEffect(() => {
    setCurrPage(filters.page);
  }, [filters.page]);

  useEffect(() => {
    if (!numPages) return;
    const newItems = pagination(4)(filters.page, numPages);
    setItems(newItems);
  }, [filters.page, numPages]);

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

  return (
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
                <PaginationLink isActive={page === filters.page}>
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
          <PaginationNext disabled={filters.page === numPages!} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
