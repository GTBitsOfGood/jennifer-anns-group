import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import searchTheme from "../ui/searchTagsTheme";
import { ThemeProvider } from "@mui/material/styles";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { z } from "zod";
import { tagSchema, themeSchema } from "@/utils/types";

interface Tags {
  accessibility: z.infer<typeof tagSchema>[];
  custom: z.infer<typeof tagSchema>[];
}

interface Props {
  setSearch: Dispatch<SetStateAction<boolean>>;
  currThemes: z.infer<typeof themeSchema>[];
  setCurrThemes: Dispatch<z.infer<typeof themeSchema>[]>;
  currTags: z.infer<typeof tagSchema>[];
  setCurrTags: Dispatch<z.infer<typeof tagSchema>[]>;
}

export default function SearchTagsComponent({
  setSearch,
  currThemes,
  setCurrThemes,
  currTags,
  setCurrTags,
}: Props) {
  const [themes, setThemes] = useState<z.infer<typeof themeSchema>[]>();
  const tagsVar: Tags = {
    accessibility: [],
    custom: [],
  };
  type TagOrTheme = z.infer<typeof tagSchema> | z.infer<typeof themeSchema>;
  const [tags, setTags] = useState<Tags>(tagsVar);
  const [options, setOptions] = useState<TagOrTheme[]>([]);

  useEffect(() => {
    getThemes();
    getTags();
  }, []);

  useEffect(() => {
    if (themes) {
      themes.map((theme) => {
        if (
          !currThemes.some((curr) => curr.name === theme.name) &&
          !options.some((option) => option.name === theme.name)
        ) {
          setOptions((options) => [...options, theme]);
        }
      });
    }
  }, [themes]);

  useEffect(() => {
    if (tags) {
      tags.accessibility.map((tag) => {
        if (
          !currTags.some((curr) => curr.name === tag.name) &&
          !options.some((option) => option.name === tag.name)
        ) {
          setOptions((options) => [...options, tag]);
        }
      });
      tags.custom.map((tag) => {
        if (
          !currTags.some((curr) => curr.name === tag.name) &&
          !options.some((option) => option.name === tag.name)
        ) {
          setOptions((options) => [...options, tag]);
        }
      });
    }
  }, [tags]);

  async function getThemes() {
    const response = await fetch("/api/themes");
    const data = await response.json();
    setThemes(data);
  }

  async function getTags() {
    const response = await fetch("/api/tags");
    const data = await response.json();
    setTags(data);
  }

  const handleSelection = (
    event,
    newValue: z.infer<typeof tagSchema> | z.infer<typeof themeSchema>,
  ) => {
    if (newValue) {
      if (tagSchema.safeParse(newValue).success) {
        setCurrTags((currTags) => [...currTags, newValue]);
      } else {
        setCurrThemes((currThemes) => [...currThemes, newValue]);
      }
    }
    setSearch(false);
  };

  return (
    <ThemeProvider theme={searchTheme}>
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={options}
        getOptionLabel={(t) => t.name}
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
  );
}
