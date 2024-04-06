import { IBuild, IGame } from "@/server/db/models/GameModel";
import { ExtendId } from "@/utils/types";
import { ColumnDef } from "@tanstack/react-table";
import EditPopover from "./EditPopover";
import { ITheme } from "@/server/db/models/ThemeModel";
import { ITag } from "@/server/db/models/TagModel";
import { Tag } from "@/components/ui/tag";

export const columns: ColumnDef<
  ExtendId<
    Omit<IGame, "themes" | "tags" | "builds"> & {
      builds: ExtendId<IBuild>[];
      themes: ExtendId<ITheme>[];
      accessibility: ExtendId<ITag>[];
      custom: ExtendId<ITag>[];
    }
  >
>[] = [
  {
    accessorKey: "name",
    header: "Game Title",
    meta: "w-1/6",
  },
  {
    id: "themes",
    header: "Themes",
    meta: "w-1/4",
    cell: ({ row }) => {
      return (
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-row flex-wrap">
            {row.original.themes.map((theme) => {
              return (
                <Tag key={theme._id} variant="theme" className="group m-0.5">
                  {theme.name}
                </Tag>
              );
            })}
            <EditPopover gameId={row.original._id} contentType="theme" />
          </div>
        </div>
      );
    },
  },
  {
    id: "accessibility",
    header: "Accessibility",
    meta: "w-1/4",
    cell: ({ row }) => {
      return (
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-row flex-wrap">
            {row.original.accessibility.map((accessibilityTag) => {
              return (
                <Tag
                  key={accessibilityTag._id}
                  variant="accessibility"
                  className="group m-0.5"
                >
                  {accessibilityTag.name}
                </Tag>
              );
            })}
            <EditPopover
              gameId={row.original._id}
              contentType="accessibility"
            />
          </div>
        </div>
      );
    },
  },
  {
    id: "custom",
    header: "Tags",
    meta: "w-1/3",
    cell: ({ row }) => {
      return (
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-row flex-wrap">
            {row.original.custom.map((customTag) => {
              return (
                <Tag
                  key={customTag._id}
                  variant="custom"
                  className="group m-0.5"
                >
                  {customTag.name}
                </Tag>
              );
            })}
            <EditPopover gameId={row.original._id} contentType="custom" />
          </div>
        </div>
      );
    },
  },
];
