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
import { Dispatch, useState } from "react";
import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import searchTheme from "../ui/searchTagsTheme";
import { ThemeProvider } from "@mui/material/styles";

interface Props {
  mode: string;
  themes: z.infer<typeof themeSchema>[];
  setThemes: Dispatch<z.infer<typeof themeSchema>[]>;
  tags: z.infer<typeof tagSchema>[];
  setTags: Dispatch<z.infer<typeof tagSchema>[]>;
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
  const top100Films = [
    { label: "Gaslighting", year: 2008 },
    { label: "Girlboss", year: 1957 },
    { label: "Gatekeep", year: 1993 },
    { label: "Glass Onion", year: 1994 },
  ];

  const handleSelection = (event, newValue: string | null) => {
    if (newValue) {
      console.log(newValue.label);
    }
  };

  return (
    <div>
      <ChakraProvider theme={theme}>
        <div className={styles.tags}>
          {themes
            ? themes.map((theme) => (
                <Tag key={theme.name} bg="brand.400">
                  {theme.name}
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
                  {mode === "edit" ? <TagCloseButton /> : null}
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
          <ThemeProvider theme={searchTheme}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={top100Films}
              className="sans-serif"
              onChange={handleSelection}
              sx={{
                width: 560,
              }}
              renderInput={(params) => (
                <TextField {...params} placeholder="Search themes/tags" />
              )}
            />
          </ThemeProvider>
        </div>
      ) : null}
    </div>
  );
}
