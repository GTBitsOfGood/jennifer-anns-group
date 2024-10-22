import { Tag } from "@chakra-ui/react";
import { PageRequiredGameQuery } from "../Admin/ThemesTags/GamesSection";
import { gameContentsMap, gameBuildsMap } from "./FilterBody";
import { X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface Props {
  setFilters: Dispatch<SetStateAction<PageRequiredGameQuery>>;
  filters: PageRequiredGameQuery;
}

export default function SelectedFilters({ setFilters, filters }: Props) {
  const { gameBuilds, gameContent, accessibility, tags } = filters;

  return (
    <div>
      {gameBuilds?.map((item) => {
        return (
          <Tag key={item} height="36px" variant="filter_selected">
            <div className="flex flex-row items-center gap-2">
              {gameBuildsMap[item]}
              <X
                className="hover:cursor-pointer"
                size={18}
                onClick={() =>
                  setFilters((filters) => ({
                    ...filters,
                    gameBuilds: gameBuilds.filter((i) => i != item),
                  }))
                }
              />
            </div>
          </Tag>
        );
      })}
      {gameContent?.map((item) => {
        return (
          <Tag key={item} height="36px" variant="filter_selected">
            <div className="flex flex-row items-center gap-2">
              {gameContentsMap[item]}
              <X
                className="hover:cursor-pointer"
                size={18}
                onClick={() =>
                  setFilters((filters) => ({
                    ...filters,
                    gameContent: gameContent.filter((i) => i != item),
                  }))
                }
              />
            </div>
          </Tag>
        );
      })}
      {accessibility?.map((item) => {
        return (
          <Tag key={item} height="36px" variant="filter_selected">
            <div className="flex flex-row items-center gap-2">
              {item}
              <X
                className="hover:cursor-pointer"
                size={18}
                onClick={() =>
                  setFilters((filters) => ({
                    ...filters,
                    accessibility: accessibility.filter((i) => i != item),
                  }))
                }
              />
            </div>
          </Tag>
        );
      })}
      {tags?.map((item) => {
        return (
          <Tag key={item} height="36px" variant="filter_selected">
            <div className="flex flex-row items-center gap-2">
              {item}
              <X
                className="hover:cursor-pointer"
                size={18}
                onClick={() =>
                  setFilters((filters) => ({
                    ...filters,
                    tags: tags.filter((i) => i != item),
                  }))
                }
              />
            </div>
          </Tag>
        );
      })}
    </div>
  );
}
