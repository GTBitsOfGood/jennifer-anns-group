import { Badge } from "@/components/ui/badge";

import { gameSchema, tagSchema } from "@/utils/types";
import { z } from "zod";
import { useState } from "react";

import { X } from "lucide-react";

interface Props {
  themes: string[] | null;
  type: "theme" | "tag";
}

export default function ThemeSelect({ themes, type }: Props) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  return (
    <div className="flex flex-row flex-wrap gap-3">
      {themes
        ? themes.map((theme) => (
            <Badge
              variant={selectedTags.includes(theme) ? type : "outline"}
              className="max-h-8"
              onClick={() => setSelectedTags([...selectedTags, theme])}
            >
              {theme}
              {selectedTags.includes(theme) && (
                <X
                  className="h-5 w-5 pl-1 hover:cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTags(selectedTags.filter((t) => t !== theme));
                  }}
                />
              )}
            </Badge>
          ))
        : null}
    </div>
  );
}
