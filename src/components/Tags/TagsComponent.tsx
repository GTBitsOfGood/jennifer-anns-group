import styles from "@/styles/tags.module.css";
import { ChakraProvider, Tag } from "@chakra-ui/react";
import theme from "../ui/tagsTheme";
import { gameSchema, tagSchema } from "@/utils/types";
import { z } from "zod";

interface Props {
  gameData: z.infer<typeof gameSchema>;
}

const sortByTagType = (
  tagA: z.infer<typeof tagSchema>,
  tagB: z.infer<typeof tagSchema>,
) => {
  if (tagA.type === "accessibility" && tagB.type !== "accessibility") {
    return -1;
  } else if (tagA.type !== "accessibility" && tagB.type === "accessibility") {
    return 1;
  }
  return 0;
};

export default function TagsComponent({ gameData }: Props) {
  return (
    <ChakraProvider theme={theme}>
      <div className={styles.tags}>
        {gameData.themes
          ? gameData.themes.map((theme) => (
              <Tag key={theme.name} bg="brand.400">
                {theme.name}
              </Tag>
            ))
          : null}
        {gameData.tags
          ? gameData.tags.sort(sortByTagType).map((tag) => (
              <Tag
                key={tag.name}
                bg={tag.type === "accessibility" ? "brand.300" : "brand.500"}
              >
                {tag.name}
              </Tag>
            ))
          : null}
      </div>
    </ChakraProvider>
  );
}
