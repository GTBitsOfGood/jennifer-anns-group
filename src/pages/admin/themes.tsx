import AddModal from "@/components/ThemeTag/AddModal";
import { Tag } from "@/components/ui/tag";
import { IGame } from "@/server/db/models/GameModel";
import { ITag } from "@/server/db/models/TagModel";
import { ITheme } from "@/server/db/models/ThemeModel";
import { useQuery } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";
import DeleteModal from "@/components/ThemeTag/DeleteModal";
import { useState } from "react";
import { ExtendId } from "@/utils/types";
import { Button } from "@/components/ui/button";

type SelectedDeleteSubject = {
  subjectType: "theme" | "tag";
  subject: (ITheme & { _id: string }) | (ITag & { _id: string });
};

type SelectedAddSubject = "theme" | "tag" | "accessibility";

function Themes() {
  const [addModalDisclosure, setAddModalDisclosure] = useState(false);
  const [deleteModalDisclosure, setDeleteModalDisclosure] = useState(false);

  const [selectedDeleteSubject, setSelectedDeleteSubject] =
    useState<SelectedDeleteSubject | null>(null);
  const [selectedAddSubject, setSelectedAddSubject] =
    useState<SelectedAddSubject | null>(null);

  const subjectType = selectedDeleteSubject?.subjectType;
  const subject = selectedDeleteSubject?.subject;

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

  const { status: gamesStatus, data: games } = useQuery({
    queryKey: ["allGames"],
    queryFn: () =>
      fetch("/api/games").then((res) => res.json()) as Promise<IGame[]>,
  });

  return (
    <div className="flex pt-8 px-[10em] flex-col items-center gap-10">
      <h1 className="font-semibold text-4xl">Themes and Tags</h1>
      <div className="w-full">
        <div className="flex flex-row justify-between">
          <h3 className="font-semibold text-xl">Themes</h3>
          <Button
            variant="primary"
            className="text-xs rounded-full gap-1 py-2 px-3 h-fit cursor-pointer"
            onClick={() => {
              setSelectedAddSubject("theme");
              setAddModalDisclosure(true);
            }}
            asChild
          >
            <div>
              <Plus size={16} />
              <p>New theme</p>
            </div>
          </Button>
        </div>
        <div className="flex flex-row gap-2 flex-wrap">
          {themes?.map((theme) => {
            return (
              <Tag
                variant="theme"
                className="group hover:cursor-pointer"
                onClick={() => {
                  setSelectedDeleteSubject({
                    subject: theme,
                    subjectType: "theme",
                  });
                  setDeleteModalDisclosure(true);
                }}
              >
                <div className="flex flex-row items-center gap-2">
                  {theme.name}
                  <div className="hidden group-hover:block">
                    <X size={18} />
                  </div>
                </div>
              </Tag>
            );
          })}
        </div>
      </div>
      <div className="w-full">
        <div className="flex flex-row justify-between">
          <h3 className="font-semibold text-xl">Accessibility</h3>
          <Button
            variant="primary"
            className="text-xs rounded-full gap-1 py-2 px-3 h-fit cursor-pointer"
            onClick={() => {
              setSelectedAddSubject("accessibility");
              setAddModalDisclosure(true);
            }}
            asChild
          >
            <div>
              <Plus size={16} />
              <p>New accessibility</p>
            </div>
          </Button>
        </div>
        <div className="flex flex-row gap-2 flex-wrap">
          {tags?.accessibility.map((tag) => {
            return (
              <Tag
                variant="accessibility"
                className="group hover:cursor-pointer"
                onClick={() => {
                  setSelectedDeleteSubject({
                    subject: tag,
                    subjectType: "tag",
                  });
                  setDeleteModalDisclosure(true);
                }}
              >
                <div className="flex flex-row items-center gap-2">
                  {tag.name}
                  <div className="hidden group-hover:block">
                    <X size={18} />
                  </div>
                </div>
              </Tag>
            );
          })}
        </div>
      </div>
      <div className="w-full">
        <div className="flex flex-row justify-between flex-wrap">
          <h3 className="font-semibold text-xl">Tags</h3>
          <Button
            variant="primary"
            className="text-xs rounded-full gap-1 py-2 px-3 h-fit cursor-pointer"
            onClick={() => {
              setSelectedAddSubject("tag");
              setAddModalDisclosure(true);
            }}
            asChild
          >
            <div>
              <Plus size={16} />
              <p>New tag</p>
            </div>
          </Button>
        </div>
        <div className="flex flex-row gap-2">
          {tags?.custom.map((tag) => {
            return (
              <Tag
                variant="custom"
                className="group hover:cursor-pointer"
                onClick={() => {
                  setSelectedDeleteSubject({
                    subject: tag,
                    subjectType: "tag",
                  });
                  setDeleteModalDisclosure(true);
                }}
              >
                <div className="flex flex-row items-center gap-2">
                  {tag.name}
                  <div className="hidden group-hover:block">
                    <X size={18} />
                  </div>
                </div>
              </Tag>
            );
          })}
        </div>
        <AddModal
          open={addModalDisclosure}
          setOpen={setAddModalDisclosure}
          subject={selectedAddSubject}
        />
        <DeleteModal
          open={deleteModalDisclosure}
          setOpen={setDeleteModalDisclosure}
          subject={subject}
          subjectType={subjectType}
        />
      </div>
    </div>
  );
}

export default Themes;
