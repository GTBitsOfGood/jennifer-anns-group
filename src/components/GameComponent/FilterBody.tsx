import { UserLabel, tagSchema } from "@/utils/types";
import { Checkbox, CheckboxGroup, Tag, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { z } from "zod";

interface Props {
  gameBuilds: string[];
  gameContent: string[];
  accessibility: string[];
  tags: string[];
  userLabel: UserLabel;
}

export default function FilterBody({
  gameBuilds,
  gameContent,
  accessibility,
  tags,
  userLabel,
}: Props) {
  const gameBuildsOptions = [
    "Amazon",
    "Android",
    "App Store",
    "Linux",
    "Mac",
    "WebGL",
    "Windows",
  ];
  const gameContentOptions = [
    "Parenting guide",
    "Lesson plan",
    "Video trailer",
  ];
  const [accessibilityOptions, setAccessibilityOptions] = useState<string[]>(
    [],
  );
  const [tagsOptions, setTagsOptions] = useState<string[]>([]);
  const [selectedGameBuilds, setSelectedGameBuilds] = useState<string[]>([]);
  const [selectedAccessibility, setSelectedAccessibility] = useState<string[]>(
    [],
  );
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    getAllTags();
  }, []);

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

  return (
    <div>
      <p className="mb-5 ml-16 mt-11	font-sans font-extrabold text-gray-500">
        Game builds
      </p>
      <div className="mb-[52px] ml-[52px] mr-[52px]">
        {gameBuildsOptions.map((gameBuild) => {
          return (
            <Tag
              variant={
                !selectedGameBuilds.includes(gameBuild)
                  ? "filter"
                  : "filter_selected"
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
              {gameBuild}
            </Tag>
          );
        })}
      </div>

      <p className="mb-5 ml-16	font-sans font-extrabold text-gray-500">
        Game content
      </p>
      {
        <CheckboxGroup>
          <VStack align="start" ml="52px" mb="52px">
            {gameContentOptions.map((content) => {
              return <Checkbox>{content}</Checkbox>;
            })}
            {userLabel === "administrator" ? (
              <Checkbox>Answer key</Checkbox>
            ) : null}
          </VStack>
        </CheckboxGroup>
      }

      <p className="mb-5 ml-16	font-sans font-extrabold text-gray-500">
        Accessibility
      </p>
      <div className="mb-[52px] ml-[52px]">
        {accessibilityOptions.map((a) => {
          return (
            <Tag
              variant={
                !selectedAccessibility.includes(a)
                  ? "filter"
                  : "filter_selected"
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

      <p className="mb-5 ml-16	font-sans font-extrabold text-gray-500">Tags</p>
      <div className="mb-[52px] ml-[52px]">
        {tagsOptions?.map((t) => {
          return (
            <Tag
              variant={!selectedTags.includes(t) ? "filter" : "filter_selected"}
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

      <div className=" ml-[52px] mr-[52px] flex flex-row justify-between">
        <button className="font-sans font-semibold text-blue-primary">
          Cancel
        </button>
        <button className="h-12 w-[120px] rounded-md bg-blue-primary font-sans font-semibold text-white">
          Apply
        </button>
      </div>
    </div>
  );
}
