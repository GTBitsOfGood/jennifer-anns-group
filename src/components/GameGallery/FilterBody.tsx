import { UserLabel, tagSchema } from "@/utils/types";
import { Tag } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { z } from "zod";
import { PageRequiredGameQuery } from "../Admin/ThemesTags/GamesSection";

interface Props {
  setFilters: Dispatch<SetStateAction<PageRequiredGameQuery>>;
  filters: PageRequiredGameQuery;
  userLabel: UserLabel | undefined;
  onClose: () => void;
}
export const gameBuildsMap: Record<string, string> = {
  amazon: "Amazon Appstore",
  apple: "Apple Appstore",
  android: "Android",
  browser: "Browser",
  linux: "Linux",
  mac: "Mac",
  tabletop: "Tabletop",
  steam: "Steam",
  windows: "Windows",
};
export const gameContentsMap: Record<string, string> = {
  parentingGuide: "Parenting Guide",
  lesson: "Lesson Plan", //Maybe check back
  answerKey: "Answer Key",
  videoTrailer: "Video Trailer",
};

export default function FilterBody({
  setFilters,
  filters,
  userLabel,
  onClose,
}: Props) {
  const [accessibilityOptions, setAccessibilityOptions] = useState<string[]>(
    [],
  );
  const [tagsOptions, setTagsOptions] = useState<string[]>([]);
  const [selectedGameBuilds, setSelectedGameBuilds] = useState<string[]>([]);
  const [selectedAccessibility, setSelectedAccessibility] = useState<string[]>(
    [],
  );
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedGameContent, setSelectedGameContent] = useState<string[]>([]);

  useEffect(() => {
    getAllTags();
  }, []);

  useEffect(() => {
    setSelectedGameBuilds(filters.gameBuilds || []);
    setSelectedAccessibility(filters.accessibility || []);
    setSelectedTags(filters.tags || []);
    setSelectedGameContent(filters.gameContent || []);
  }, [filters]);

  async function getAllTags() {
    const response = await fetch(`/api/tags`);
    const data = await response.json();
    setAccessibilityOptions(
      data.accessibility.map((a: z.infer<typeof tagSchema>) => {
        return a.name;
      }),
    );
    setTagsOptions(
      data.custom.map((t: z.infer<typeof tagSchema>) => {
        return t.name;
      }),
    );
  }

  function applyFilters() {
    setFilters({
      ...filters,
      gameBuilds: selectedGameBuilds,
      accessibility: selectedAccessibility,
      tags: selectedTags,
      gameContent: selectedGameContent,
      page: 1,
    });
    onClose();
  }

  function clearSelections() {
    setSelectedGameBuilds([]);
    setSelectedAccessibility([]);
    setSelectedTags([]);
    setSelectedGameContent([]);
    const { gameBuilds, accessibility, tags, gameContent, ...rest } = filters;
    setFilters(rest);
    onClose();
  }

  return (
    <div className="grid gap-6">
      <p className="font-sans text-lg font-semibold text-blue-primary">
        Filters
      </p>
      <div>
        <p className="mb-3 font-sans text-font-1000">Builds</p>
        {Object.keys(gameBuildsMap).map((gameBuild) => {
          return (
            <Tag
              key={gameBuild}
              variant={
                !selectedGameBuilds.includes(gameBuild)
                  ? "filter"
                  : "filter_selected_other"
              }
              onClick={() => {
                if (selectedGameBuilds.includes(gameBuild)) {
                  setSelectedGameBuilds(
                    selectedGameBuilds.filter((gb) => {
                      return gb !== gameBuild;
                    }),
                  );
                } else {
                  setSelectedGameBuilds([...selectedGameBuilds, gameBuild]);
                }
              }}
              cursor="pointer"
            >
              {gameBuildsMap[gameBuild]}
            </Tag>
          );
        })}
      </div>

      <div>
        <p className="mb-3 font-sans text-font-1000">Supplementary Content</p>
        {Object.keys(gameContentsMap).map((content) => {
          return (
            (content !== "answerKey" ||
              userLabel === "administrator" ||
              userLabel === "parent" ||
              userLabel === "educator") && (
              <Tag
                key={content}
                variant={
                  !selectedGameContent.includes(content)
                    ? "filter"
                    : "filter_selected_other"
                }
                onClick={() => {
                  if (selectedGameContent.includes(content)) {
                    setSelectedGameContent(
                      selectedGameContent.filter((c) => {
                        return c !== content;
                      }),
                    );
                  } else {
                    setSelectedGameContent([...selectedGameContent, content]);
                  }
                }}
                cursor="pointer"
              >
                {gameContentsMap[content]}
              </Tag>
            )
          );
        })}
      </div>

      <div>
        <p className="mb-3 font-sans text-font-1000">Accessibility</p>
        {accessibilityOptions.map((a) => {
          return (
            <Tag
              key={a}
              variant={
                !selectedAccessibility.includes(a)
                  ? "filter"
                  : "filter_selected_accessibility"
              }
              onClick={() => {
                if (selectedAccessibility.includes(a)) {
                  setSelectedAccessibility(
                    selectedAccessibility.filter((acc) => {
                      return acc !== a;
                    }),
                  );
                } else {
                  setSelectedAccessibility([...selectedAccessibility, a]);
                }
              }}
              cursor="pointer"
            >
              {a}
            </Tag>
          );
        })}
      </div>

      <div>
        <p className="mb-3 font-sans text-font-1000">Tags</p>
        {tagsOptions?.map((t) => {
          return (
            <Tag
              key={t}
              variant={
                !selectedTags.includes(t) ? "filter" : "filter_selected_other"
              }
              onClick={() => {
                if (selectedTags.includes(t)) {
                  setSelectedTags(
                    selectedTags.filter((tag) => {
                      return tag !== t;
                    }),
                  );
                } else {
                  setSelectedTags([...selectedTags, t]);
                }
              }}
              cursor="pointer"
            >
              {t}
            </Tag>
          );
        })}
      </div>

      <div className="flex flex-row gap-4">
        <button
          onClick={clearSelections}
          className="w-full rounded-md border border-border px-3 py-4 font-sans font-medium text-blue-primary"
        >
          Clear
        </button>
        <button
          onClick={applyFilters}
          className="w-full rounded-md bg-blue-primary px-3 py-4 font-sans font-medium text-white"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
