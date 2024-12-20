import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { PageRequiredGameQuery } from "../Admin/ThemesTags/GamesSection";
import { themeSchema } from "@/utils/types";
import { z } from "zod";

interface Props {
  setFilters: Dispatch<SetStateAction<PageRequiredGameQuery>>;
  filters: PageRequiredGameQuery;
}

export default function ThemeSidebar({ setFilters, filters }: Props) {
  const [themes, setThemes] = useState<string[]>([]);

  useEffect(() => {
    getThemes();
  }, []);

  async function getThemes() {
    const response = await fetch(`/api/themes`);
    const data = await response.json();
    const themesString = data.map((theme: z.infer<typeof themeSchema>) => {
      return theme.name;
    });
    themesString.sort();
    setThemes(themesString);
  }

  return (
    <div className="flex w-max flex-col">
      <p
        onClick={() => {
          setFilters({ ...filters, theme: [], page: 1 });
        }}
        className={
          filters.theme?.length === 0
            ? "mb-9 mr-6 cursor-pointer font-sans text-2xl font-bold text-blue-primary"
            : "mb-9 mr-6 cursor-pointer font-sans text-2xl text-unselected hover:text-blue-primary"
        }
      >
        All Games
      </p>
      {themes
        ? themes.map((theme) => {
            return (
              <p
                key={theme}
                onClick={() => {
                  setFilters({ ...filters, theme: [theme], page: 1 });
                }}
                className={
                  filters.theme?.includes(theme)
                    ? "mb-9 mr-6 cursor-pointer font-sans text-2xl font-bold text-blue-primary"
                    : "mb-9 mr-6 cursor-pointer font-sans text-2xl text-unselected hover:text-blue-primary"
                }
              >
                {theme}
              </p>
            );
          })
        : null}
    </div>
  );
}
