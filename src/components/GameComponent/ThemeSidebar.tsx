import { Dispatch, SetStateAction } from "react";

interface Props {
  themes: string[];
  selectedTheme: string;
  setSelectedTheme: Dispatch<SetStateAction<string>>;
}

export default function ThemeSidebar({
  themes,
  selectedTheme,
  setSelectedTheme,
}: Props) {
  return (
    <div className="flex h-[365px] w-[260px] flex-col overflow-y-scroll">
      <p
        onClick={() => {
          setSelectedTheme("All Games");
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
                onClick={() => {
                  setSelectedTheme(theme);
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
