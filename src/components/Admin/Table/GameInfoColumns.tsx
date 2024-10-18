import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "gameTitle",
    header: "Game Title",
    meta: "w-1/5",
  },
  {
    id: "hitsToPage",
    header: "Hits to Page",
    meta: "w-1/5",
    cell: ({ row }) => {
      return (
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-row flex-wrap">
            {row.original.hitsToPage}
          </div>
        </div>
      );
    },
  },
  {
    id: "hitsToPDF",
    header: "Hits to PDF",
    meta: "w-1/5",
    cell: ({ row }) => {
      return (
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-row flex-wrap">
            {row.original.hitsToPDF}
          </div>
        </div>
      );
    },
  },
  {
    id: "downloads",
    header: "Downloads",
    meta: "w-1/5",
    cell: ({ row }) => {
      return (
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-row flex-wrap">
            {row.original.downloads}
          </div>
        </div>
      );
    },
  },
  // {
  //   id: "plays",
  //   header: "Plays",
  //   meta: "w-1/5",
  //   cell: ({ row }) => {
  //     return (
  //       <div className="flex flex-row items-center gap-2">
  //         <div className="flex flex-row flex-wrap">{row.original.plays}</div>
  //       </div>
  //     );
  //   },
  // },
];
