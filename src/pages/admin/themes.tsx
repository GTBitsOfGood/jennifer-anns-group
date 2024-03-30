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
import pageAccessHOC from "@/components/HOC/PageAccess";

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
    <div>
      <div className="mb-16 flex flex-col items-center gap-10 px-[10em] pt-8">
        <h1 className="mb-16 mt-10 text-center font-sans text-6xl font-semibold">
          Themes and Tags
        </h1>
        <div className="w-full">
          <div className="flex flex-row justify-between">
            <h3 className="text-xl font-semibold">Themes</h3>
            <Button
              variant="primary"
              className="h-fit cursor-pointer gap-1 rounded-full px-3 py-2 text-xs"
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
          <div className="flex flex-row flex-wrap gap-2">
            {themes?.map((theme) => {
              return (
                <Tag
                  key={theme._id}
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
            <h3 className="text-xl font-semibold">Accessibility</h3>
            <Button
              variant="primary"
              className="h-fit cursor-pointer gap-1 rounded-full px-3 py-2 text-xs"
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
          <div className="flex flex-row flex-wrap gap-2">
            {tags?.accessibility.map((tag) => {
              return (
                <Tag
                  key={tag._id}
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
          <div className="flex flex-row flex-wrap justify-between">
            <h3 className="text-xl font-semibold">Tags</h3>
            <Button
              variant="primary"
              className="h-fit cursor-pointer gap-1 rounded-full px-3 py-2 text-xs"
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
                  key={tag._id}
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
    </div>
  );
}

export default pageAccessHOC(Themes);
