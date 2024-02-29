import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import searchTheme from "../ui/searchTagsTheme";
import { ThemeProvider } from "@mui/material/styles";
import { useState, useEffect } from "react";
import { z } from "zod";
import { tagSchema, themeSchema } from "@/utils/types";

export default function SearchTagsComponent() {
  const [themes, setThemes] = useState<z.infer<typeof themeSchema>[]>();
  const [tags, setTags] = useState([]);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    getThemes();
    getTags();
  }, []);

  //   useEffect(() => {
  //     setOptions((options) => [...options, ...themes]);
  //   }, [themes]);

  useEffect(() => {
    if (tags.length > 0) {
      console.log(options);
      setOptions((options) => [...options, ...tags]);
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
    console.log(themes);
    console.log(tags);
  };

  return (
    <ThemeProvider theme={searchTheme}>
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={top100Films}
        // getOptionLabel={(t) => t.name}
        className="sans-serif"
        onChange={handleSelection}
        isOptionEqualToValue={(option, value) => option.label === value.label}
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
