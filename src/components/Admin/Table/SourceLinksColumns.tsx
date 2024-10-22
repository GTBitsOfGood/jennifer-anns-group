import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "url",
    header: "URL",
    meta: "w-1/3",
    cell: ({ row }) => {
      return (
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-row flex-wrap">{row.original.label}</div>
        </div>
      );
    },
  },
  {
    id: "hitsFromPage",
    header: "Hits from Page",
    meta: "w-1/3",
    cell: ({ row }) => {
      console.log(row);
      return (
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-row flex-wrap">{row.original.value}</div>
        </div>
      );
    },
  },
  {
    id: "percentHits",
    header: "% of Hits",
    meta: "w-1/3",
    cell: ({ row }) => {
      return (
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-row flex-wrap">{row.original.ratio}%</div>
        </div>
      );
    },
  },
];
