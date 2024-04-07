import { Tag } from "@chakra-ui/react";
import { PageRequiredGameQuery } from "../ThemesTags/GamesSection";
import { gameContentsMap, gameBuildsMap } from "./FilterBody";

interface Props {
  filters: PageRequiredGameQuery;
}

export default function SelectedFilters({ filters }: Props) {
  const { gameBuilds, gameContent, accessibility, tags } = filters;

  return (
    <div>
      {gameBuilds?.map((item) => {
        return (
          <Tag key={item} height="36px" variant="filter_selected">
            {gameBuildsMap[item]}
          </Tag>
        );
      })}
      {gameContent?.map((item) => {
        return (
          <Tag key={item} height="36px" variant="filter_selected">
            {gameContentsMap[item]}
          </Tag>
        );
      })}
      {accessibility?.map((item) => {
        return (
          <Tag key={item} height="36px" variant="filter_selected">
            {item}
          </Tag>
        );
      })}
      {tags?.map((item) => {
        return (
          <Tag key={item} height="36px" variant="filter_selected">
            {item}
          </Tag>
        );
      })}
    </div>
  );
}
