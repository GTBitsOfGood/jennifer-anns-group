import { Badge } from "@/components/ui/badge";

import { themeSchema } from "@/utils/types";
import { z } from "zod";
import { useState } from "react";

import { X } from "lucide-react";

interface Props {
  themes: z.infer<typeof themeSchema>[] | null;
  type: "theme" | "tag";
  selected: z.infer<typeof themeSchema>[];
  setSelected: React.Dispatch<
    React.SetStateAction<z.infer<typeof themeSchema>[]>
  >;
}

export default function ThemeSelect({
  themes,
  type,
  selected,
  setSelected,
}: Props) {
  return (
    <div className="flex flex-row flex-wrap gap-3">
      {themes
        ? themes.map((theme, i) => (
            <Badge
              key={i}
              variant={selected.includes(theme) ? type : "outline"}
              className="max-h-8"
              onClick={() => setSelected([...selected, theme])}
            >
              {theme.name}
              {selected.includes(theme) && (
                <X
                  className="h-5 w-5 pl-1 hover:cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(selected.filter((t) => t !== theme));
                  }}
                />
              )}
            </Badge>
          ))
        : null}
    </div>
  );
}
