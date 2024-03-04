import { Badge } from "@/components/ui/badge";

import { ITheme } from "@/server/db/models/ThemeModel";
import { ExtendId } from "@/utils/types";

import { X } from "lucide-react";

interface Props {
  themes: ExtendId<ITheme>[];
  selected: ExtendId<ITheme>[];
  setSelected: React.Dispatch<React.SetStateAction<ExtendId<ITheme>[]>>;
}

export default function ThemeSelect({ themes, selected, setSelected }: Props) {
  return (
    <div className="flex flex-row flex-wrap gap-3">
      {themes
        ? themes.map((theme, i) => (
            <Badge
              key={i}
              variant={selected.includes(theme) ? "theme" : "outline"}
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
