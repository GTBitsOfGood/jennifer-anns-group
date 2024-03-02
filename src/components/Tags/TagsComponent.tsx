import styles from "@/styles/tags.module.css";
import {
  ChakraProvider,
  Tag,
  TagCloseButton,
  TagRightIcon,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import theme from "../ui/tagsTheme";
import { z } from "zod";
import { Dispatch, useState } from "react";
import SearchTagsComponent from "./SearchTagsComponent";
import { themeDataSchema, tagDataSchema } from "@/pages/games/[id]/edit";

interface Props {
  mode: string;
  themes: z.infer<typeof themeDataSchema>[];
  setThemes?: Dispatch<z.infer<typeof themeDataSchema>[]>;
  tags: z.infer<typeof tagDataSchema>[];
  setTags?: Dispatch<z.infer<typeof tagDataSchema>[]>;
}

const sortByTagType = (
  tagA: z.infer<typeof tagDataSchema>,
  tagB: z.infer<typeof tagDataSchema>,
) => {
  if (tagA.type === "accessibility" && tagB.type !== "accessibility") {
    return -1;
  } else if (tagA.type !== "accessibility" && tagB.type === "accessibility") {
    return 1;
  }
  return 0;
};

export default function TagsComponent({
  mode,
  themes,
  setThemes,
  tags,
  setTags,
}: Props) {
  const [search, setSearch] = useState(false);

  function removeTag(tag: z.infer<typeof tagDataSchema>) {
    if (setTags) {
      const newList = tags.filter((t) => {
        return t.name !== tag.name;
      });
      setTags(newList);
    }
  }

  function removeTheme(theme: z.infer<typeof themeDataSchema>) {
    if (setThemes) {
      const newList = themes.filter((t) => {
        return t.name !== theme.name;
      });
      setThemes(newList);
    }
  }

  return (
    <div>
      <ChakraProvider theme={theme}>
        <div className={styles.tags}>
          {themes
            ? themes.map((theme) => (
                <Tag key={theme.name} bg="brand.400">
                  {theme.name}
                  {mode === "edit" ? (
                    <TagCloseButton onClick={() => removeTheme(theme)} />
                  ) : null}
                </Tag>
              ))
            : null}
          {tags
            ? tags.sort(sortByTagType).map((tag) => (
                <Tag
                  key={tag.name}
                  bg={tag.type === "accessibility" ? "brand.300" : "brand.500"}
                >
                  {tag.name}
                  {mode === "edit" &&
                  tag.name !== "Parenting Guide" &&
                  tag.name !== "Lesson Plan" ? (
                    <TagCloseButton onClick={() => removeTag(tag)} />
                  ) : null}
                </Tag>
              ))
            : null}
          {mode === "edit" && !search ? (
            <Tag
              className="cursor-pointer"
              bg="brand.600"
              color="white"
              onClick={() => {
                setSearch(true);
              }}
            >
              Add
              <TagRightIcon color="white" boxSize="12px" as={AddIcon} />
            </Tag>
          ) : null}
        </div>
      </ChakraProvider>
      {mode === "edit" && search && setThemes && setTags ? (
        <div className="mb-32 ml-[10vw] mt-7 font-sans">
          <SearchTagsComponent
            setSearch={setSearch}
            currThemes={themes}
            setCurrThemes={setThemes}
            currTags={tags}
            setCurrTags={setTags}
          />
        </div>
      ) : null}
    </div>
  );
}
