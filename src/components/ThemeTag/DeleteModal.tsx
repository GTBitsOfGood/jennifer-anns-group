import { ITheme } from "@/server/db/models/ThemeModel";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Tag } from "../ui/tag";
import { X } from "lucide-react";
import { ITag } from "@/server/db/models/TagModel";
import { DeleteTagInput } from "@/pages/api/tags";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteThemeInput } from "@/pages/api/themes";
import { useState } from "react";

type SubjectType = "theme" | "tag";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  subjectType: SubjectType | undefined;
  subject: (ITheme & { _id: string }) | (ITag & { _id: string }) | undefined;
}

function DeleteModal({ open, setOpen, subject, subjectType }: Props) {
  const queryClient = useQueryClient();

  const { mutate: deleteTheme, status } = useMutation({
    mutationFn: (theme: DeleteThemeInput) =>
      fetch("/api/themes", {
        method: "DELETE",
        body: JSON.stringify(theme),
      }).then((res) => res.json()) as Promise<ITheme & { _id: string }>,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["allThemes"] });
    },
  });

  console.log(status);

  const { mutate: deleteTag } = useMutation({
    mutationFn: (tag: DeleteTagInput) =>
      fetch("/api/tags", {
        method: "DELETE",
        body: JSON.stringify(tag),
      }).then((res) => res.json()) as Promise<ITag & { _id: string }>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tagsByType"] });
    },
  });

  const mutateMap: Record<SubjectType, typeof deleteTheme | typeof deleteTag> =
    {
      theme: deleteTheme,
      tag: deleteTag,
    };

  if (!subject || !subjectType) {
    return <div></div>;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="border-blue-primary border-4 flex flex-col gap-8 items-center"
        showClose={false}
      >
        <div className="flex w-full flex-col items-center gap-4">
          <h2 className="text-blue-primary text-xl font-semibold text-center">
            Are you sure you want to delete *{subject.name}*?
          </h2>
          <p>{`Deleting a ${subjectType} is final and cannot be undone.`}</p>
        </div>
        <DialogFooter className="flex flex-row sm:justify-around w-full gap-2">
          <Button
            variant="primary"
            type="submit"
            form="form"
            className="w-full bg-red-700 hover:bg-red-800"
            onClick={() => {
              mutateMap[subjectType](
                { _id: subject._id },
                { onSuccess: () => setOpen(false) }
              );
            }}
          >
            Apply
          </Button>
          <DialogClose asChild>
            <Button variant="outline" className="w-full">
              No, return
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteModal;
