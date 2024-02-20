import styles from "@/styles/tags.module.css";
import { ChakraProvider, Tag } from "@chakra-ui/react";
import theme from "../ui/tagsTheme";
import { gameSchema } from "@/utils/types";
import { z } from "zod";

interface Props {
  gameData: z.infer<typeof gameSchema>;
}

export default function TagsComponent({ gameData }: Props) {
  return (
    <ChakraProvider theme={theme}>
      <div className={styles.tags}>
        {gameData.themes
          ? gameData.themes.map((theme) => (
              <Tag bg="brand.400">{theme.name}</Tag>
            ))
          : null}
        {gameData.tags
          ? gameData.tags.map((tag) => <Tag bg="brand.500">{tag.name}</Tag>)
          : null}
      </div>
    </ChakraProvider>
  );
}
