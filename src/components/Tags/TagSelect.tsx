import { Badge } from "@/components/ui/badge";
import { ITag } from "@/server/db/models/TagModel";
import { ExtendId } from "@/utils/types";

import { X } from "lucide-react";

interface Props {
  tags: ExtendId<ITag>[];
  type: "accessibility" | "custom";
  selected: ExtendId<ITag>[];
  setSelected: React.Dispatch<React.SetStateAction<ExtendId<ITag>[]>>;
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
              variant={selected.includes(tag) ? type : "outline"}
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
