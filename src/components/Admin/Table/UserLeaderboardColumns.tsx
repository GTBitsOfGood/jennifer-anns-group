import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "Name",
    meta: "w-1/3",
  },
  {
    id: "type",
    header: "Type",
    meta: "w-1/3",
    cell: ({ row }) => {
      return (
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-row flex-wrap">{row.original.type}</div>
        </div>
      );
    },
  },
  {
    id: "playsDownloads",
    header: "Plays/Downloads",
    meta: "w-1/3",
    cell: ({ row }) => {
      return (
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-row flex-wrap">
            {row.original.playsDownloads}
          </div>
        </div>
      );
    },
  },
];
