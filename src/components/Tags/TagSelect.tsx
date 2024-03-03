import { Badge } from "@/components/ui/badge";

import { Document } from "mongodb";
import { ITag } from "@/server/db/models/TagModel";

import { tagSchema } from "@/utils/types";
import { z } from "zod";
import { useState } from "react";

import { X } from "lucide-react";

interface Props {
  tags: z.infer<typeof tagSchema>[];
  type: "custom" | "accessibility";
  selected: z.infer<typeof tagSchema>[];
  setSelected: React.Dispatch<
    React.SetStateAction<z.infer<typeof tagSchema>[]>
  >;
}

export default function TagSelect({
  tags,
  type,
  selected,
  setSelected,
}: Props) {
  return (
    <div className="flex flex-row flex-wrap gap-3">
      {tags
        ? tags.map((tag, i) => (
            <Badge
              key={i}
              variant={selected.includes(tag) ? "tag" : "outline"}
              className="max-h-8"
              onClick={() => setSelected([...selected, tag])}
            >
              {tag.name}
              {selected.includes(tag) && (
                <X
                  className="h-5 w-5 pl-1 hover:cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(selected.filter((t) => t !== tag));
                  }}
                />
              )}
            </Badge>
          ))
        : null}
    </div>
  );
}
