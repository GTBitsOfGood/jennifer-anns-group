import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ITag } from "@/server/db/models/TagModel";
import { ITheme } from "@/server/db/models/ThemeModel";
import { Spinner } from "@chakra-ui/react";
import { PopoverClose } from "@radix-ui/react-popover";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { PageRequiredGameQuery } from "./GamesSection";
import { ExtendId } from "@/utils/types";

const FORM_THEMES_KEY = "themes";
const FORM_TAGS_ACCESSIBILITY_KEY = "accessibility";
const FORM_TAGS_CUSTOM_KEY = "custom";

interface Props {
  filters: PageRequiredGameQuery;
  setFilters: React.Dispatch<React.SetStateAction<PageRequiredGameQuery>>;
}

function FilterPopover(props: Props) {
  const { filters, setFilters } = props;

  const [open, setOpen] = useState(false);

  const { status: themesStatus, data: themes } = useQuery({
    queryKey: ["allThemes"],
    queryFn: () =>
      fetch("/api/themes").then((res) => res.json()) as Promise<
        ExtendId<ITheme>[]
      >,
  });

  const { status: tagsStatus, data: tags } = useQuery({
    queryKey: ["tagsByType"],
    queryFn: () =>
      fetch("/api/tags").then((res) => res.json()) as Promise<{
        accessibility: ExtendId<ITag>[];
        custom: ExtendId<ITag>[];
      }>,
  });

  if (themesStatus === "pending" || tagsStatus === "pending") {
    return <Spinner />;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const input = {
      theme: formData.getAll(FORM_THEMES_KEY) as string[],
      accessibility: formData.getAll(FORM_TAGS_ACCESSIBILITY_KEY) as string[],
      tags: formData.getAll(FORM_TAGS_CUSTOM_KEY) as string[],
    };
    setFilters({
      ...filters,
      page: 1, // reset page
      ...input,
    });
    setOpen(false);
  }

  const selectedThemes = new Set(filters.theme);
  const selectedAccesibilityTags = new Set(filters.accessibility);
  const selectedCustomTags = new Set(filters.tags);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline2">Filter</Button>
      </PopoverTrigger>
      <PopoverContent className="w-[40em]" align="start">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-[#6D758F]">Themes</p>
              <div className="flex flex-row flex-wrap gap-2">
                {themes?.map((theme) => {
                  return (
                    <div key={theme._id}>
                      <input
                        id={theme._id}
                        className="peer hidden"
                        type="checkbox"
                        name={FORM_THEMES_KEY}
                        defaultChecked={selectedThemes.has(theme.name)}
                        value={theme.name}
                      />
                      <Label
                        htmlFor={theme._id}
                        className="rounded-full bg-[#F6F6F6] px-4 py-1.5 font-normal hover:cursor-pointer peer-checked:bg-[#A9CBEB]"
                      >
                        {theme.name}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-[#6D758F]">Accessibility</p>
              <div className="flex flex-row flex-wrap gap-2">
                {tags?.accessibility.map((tag) => {
                  return (
                    <div key={tag._id}>
                      <input
                        id={tag._id}
                        className="peer hidden"
                        type="checkbox"
                        name={FORM_TAGS_ACCESSIBILITY_KEY}
                        defaultChecked={selectedAccesibilityTags.has(tag.name)}
                        value={tag.name}
                      />
                      <Label
                        htmlFor={tag._id}
                        className="rounded-full bg-[#F6F6F6] px-4 py-1.5 font-normal hover:cursor-pointer peer-checked:bg-[#FFE5C6]"
                      >
                        {tag.name}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-[#6D758F]">Tags</p>
              <div className="flex flex-row flex-wrap gap-2">
                {tags?.custom.map((tag) => {
                  return (
                    <div key={tag._id}>
                      <input
                        id={tag._id}
                        className="peer hidden"
                        type="checkbox"
                        name={FORM_TAGS_CUSTOM_KEY}
                        defaultChecked={selectedCustomTags.has(tag.name)}
                        value={tag.name}
                      />
                      <Label
                        htmlFor={tag._id}
                        className="rounded-full bg-[#F6F6F6] px-4 py-1.5 font-normal hover:cursor-pointer peer-checked:bg-[#E2DED5]"
                      >
                        {tag.name}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center justify-between">
            <Button
              variant="ghost"
              className="w-18 h-6 text-blue-primary hover:text-blue-primary"
              onClick={() => {
                const { theme, accessibility, tags, ...original } = filters;
                setFilters(original);
              }}
              type="reset"
            >
              Clear
            </Button>
            <Button variant="primary" className="w-18 h-6" type="submit">
              Apply
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}

export default FilterPopover;