import { Tag } from "@chakra-ui/react";

interface Props {
  gameBuilds: string[];
  gameContent: string[];
  accessibility: string[];
  tags: string[];
}

export default function SelectedFilters({
  gameBuilds,
  gameContent,
  accessibility,
  tags,
}: Props) {
  const selected = [...gameBuilds, ...gameContent, ...accessibility, ...tags];

  return (
    <div>
      {selected.map((item) => {
        return (
          <Tag key={item} height="36px" variant="filter_selected">
            {item}
          </Tag>
        );
      })}
    </div>
  );
}
