import { Dispatch, SetStateAction } from "react";

interface Props {
  themes: string[];
  selectedTheme: string;
  setSelectedTheme: Dispatch<SetStateAction<string>>;
  setFiltersApplied: Dispatch<SetStateAction<boolean>>;
}

export default function ThemeSidebar({
  themes,
  selectedTheme,
  setSelectedTheme,
  setFiltersApplied,
}: Props) {
  return (
    <div className="flex h-[365px] w-[268px] flex-col overflow-y-scroll">
      <p
        onClick={() => {
          setSelectedTheme("All Games");
          setFiltersApplied(true);
        }}
        className={
          selectedTheme === "All Games"
            ? "mb-[26px] cursor-pointer font-sans text-2xl font-bold text-[#2352A0]"
            : "mb-[26px] cursor-pointer font-sans text-2xl text-neutral-500"
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
                  setSelectedTheme(theme);
                  setFiltersApplied(true);
                }}
                className={
                  selectedTheme === theme
                    ? "mb-[26px] cursor-pointer font-sans text-2xl font-bold text-[#2352A0]"
                    : "mb-[26px] cursor-pointer font-sans text-2xl text-neutral-500"
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
