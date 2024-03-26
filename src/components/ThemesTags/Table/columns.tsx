import { IBuild, IGame } from "@/server/db/models/GameModel";
import { ExtendId } from "@/utils/types";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
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
  },
  {
    id: "themes",
    header: "Themes",
    cell: ({ row }) => {
      return (
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-row">
            {row.original.themes.map((theme) => {
              return (
                <Tag key={theme._id} variant="theme" className="group">
                  {theme.name}
                </Tag>
              );
            })}
          </div>
          <EditPopover gameId={row.original._id} contentType="theme" />
        </div>
      );
    },
  },
  {
    id: "accessibility",
    header: "Accessibility",
    cell: ({ row }) => {
      return (
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-row">
            {row.original.accessibility.map((accessibilityTag) => {
              return (
                <Tag
                  key={accessibilityTag._id}
                  variant="accessibility"
                  className="group"
                >
                  {accessibilityTag.name}
                </Tag>
              );
            })}
          </div>
          <EditPopover gameId={row.original._id} contentType="accessibility" />
        </div>
      );
    },
  },
  {
    id: "custom",
    header: "Tags",
    cell: ({ row }) => {
      return (
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-row">
            {row.original.custom.map((customTag) => {
              return (
                <Tag key={customTag._id} variant="custom" className="group">
                  {customTag.name}
                </Tag>
              );
            })}
          </div>
          <EditPopover gameId={row.original._id} contentType="custom" />
        </div>
      );
    },
  },
];
