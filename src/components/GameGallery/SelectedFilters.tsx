import { Tag } from "@chakra-ui/react";
import { PageRequiredGameQuery } from "../ThemesTags/GamesSection";
import { capitalizeFirstLetter } from "@/utils/consts";

interface Props {
  filters: PageRequiredGameQuery;
}

export default function SelectedFilters({ filters }: Props) {
  const { gameBuilds, gameContent, accessibility, tags } = filters;

  return (
    <div>
      {gameBuilds?.map((item) => {
        const gbName =
          item === "appstore" ? "App Store" : capitalizeFirstLetter(item);
        return (
          <Tag key={gbName} height="36px" variant="filter_selected">
            {gbName}
          </Tag>
        );
      })}
      {gameContent?.map((item) => {
        return (
          <Tag key={item} height="36px" variant="filter_selected">
            {item}
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
