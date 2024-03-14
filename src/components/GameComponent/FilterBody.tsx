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
  const [accessibilityOptions, setAccessibilityOptions] = useState<string[]>();
  const [tagsOptions, setTagsOptions] = useState<string[]>();

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
          return <Tag cursor="pointer">{gameBuild}</Tag>;
        })}
      </div>

      <p className="mb-5 ml-16	font-sans font-extrabold text-gray-500">
        Game content
      </p>
      {
        <CheckboxGroup>
          <VStack align="start" ml="52px" mb="52px">
            <Checkbox>Parenting guide</Checkbox>
            <Checkbox>Lesson plan</Checkbox>
            <Checkbox>Video trailer</Checkbox>
            {userLabel ? <Checkbox>Answer key</Checkbox> : null}
          </VStack>
        </CheckboxGroup>
      }

      <p className="mb-5 ml-16	font-sans font-extrabold text-gray-500">
        Accessibility
      </p>
      <div className="mb-[52px] ml-[52px]">
        {accessibilityOptions?.map((a) => {
          return <Tag cursor="pointer">{a}</Tag>;
        })}
      </div>

      <p className="mb-5 ml-16	font-sans font-extrabold text-gray-500">Tags</p>
      <div className="mb-[52px] ml-[52px]">
        {tagsOptions?.map((t) => {
          return <Tag cursor="pointer">{t}</Tag>;
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
