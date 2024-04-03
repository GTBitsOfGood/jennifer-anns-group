import { ITag } from "@/server/db/models/TagModel";
import { ITheme } from "@/server/db/models/ThemeModel";
import { ExtendId } from "@/utils/types";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import AddModal from "./Modals/AddModal";
import DeleteModal from "./Modals/DeleteModal";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Tag } from "../ui/tag";

type SelectedDeleteSubject = {
  subjectType: "theme" | "tag";
  subject: (ITheme & { _id: string }) | (ITag & { _id: string });
};

type SelectedAddSubject = "theme" | "tag" | "accessibility";

function ThemesTagsSection() {
  const [addModalDisclosure, setAddModalDisclosure] = useState(false);
  const [deleteModalDisclosure, setDeleteModalDisclosure] = useState(false);

  const [selectedAddSubject, setSelectedAddSubject] =
    useState<SelectedAddSubject | null>(null);
  const [selectedDeleteSubject, setSelectedDeleteSubject] =
    useState<SelectedDeleteSubject | null>(null);

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

  return (
    <>
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
        <div className="flex flex-row">
          <div className="peer mt-2 flex flex-row flex-wrap gap-2">
            {themes?.map((theme) => {
              return (
                <Tag key={theme._id} variant="theme" className="group">
                  <div className="flex flex-row items-center gap-2">
                    {theme.name}
                    <div className="hidden hover:cursor-pointer group-hover:block">
                      <X
                        size={18}
                        onClick={() => {
                          setSelectedDeleteSubject({
                            subject: theme,
                            subjectType: "theme",
                          });
                          setDeleteModalDisclosure(true);
                        }}
                      />
                    </div>
                  </div>
                </Tag>
              );
            })}
          </div>
          <div className="w-12 peer-hover:hidden"></div>
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
        <div className="mt-2 flex flex-row flex-wrap gap-2">
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
        <div className="mt-2 flex flex-row gap-2">
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
    </>
  );
}

export default ThemesTagsSection;
