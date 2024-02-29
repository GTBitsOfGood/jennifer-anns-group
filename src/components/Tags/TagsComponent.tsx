import styles from "@/styles/tags.module.css";
import {
  ChakraProvider,
  Tag,
  TagCloseButton,
  TagRightIcon,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import theme from "../ui/tagsTheme";
import { tagSchema, themeSchema } from "@/utils/types";
import { z } from "zod";
import { Dispatch, SetStateAction, useState } from "react";
import SearchTagsComponent from "./SearchTagsComponent";

interface Props {
  mode: string;
  themes: z.infer<typeof themeSchema>[];
  setThemes: Dispatch<SetStateAction<z.infer<typeof themeSchema>>[]>;
  tags: z.infer<typeof tagSchema>[];
  setTags: Dispatch<SetStateAction<z.infer<typeof tagSchema>>[]>;
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

export default function TagsComponent({
  mode,
  themes,
  setThemes,
  tags,
  setTags,
}: Props) {
  const [search, setSearch] = useState(false);

  // async function deleteTag(tag: z.infer<typeof tagSchema>) {
  //   const tagID = tag._id;
  //   const response = await fetch(`/api/tags/${tagID}`, {
  //     method: "DELETE",
  //   });
  // }

  // async function deleteTheme(theme: z.infer<typeof tagSchema>) {
  //   const themeID = theme._id;
  //   const response = await fetch(`/api/themes/${themeID}`, {
  //     method: "DELETE",
  //   });
  // }

  function removeTag(tag: z.infer<typeof tagSchema>) {
    const newList = tags.filter((t) => {
      return t.name !== tag.name;
    });
    setTags(newList);
  }

  function removeTheme(theme: z.infer<typeof themeSchema>) {
    const newList = themes.filter((t) => {
      return t.name !== theme.name;
    });
    setThemes(newList);
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
      {mode === "edit" && search ? (
        <div className="mb-32 ml-[10vw] mt-7 font-sans">
          <SearchTagsComponent setSearch={setSearch} />
        </div>
      ) : null}
    </div>
  );
}
