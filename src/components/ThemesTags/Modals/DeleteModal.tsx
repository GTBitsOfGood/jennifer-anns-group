import { ITheme } from "@/server/db/models/ThemeModel";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
} from "../../ui/dialog";
import { ITag } from "@/server/db/models/TagModel";
import { DeleteTagInput } from "@/pages/api/tags";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteThemeInput } from "@/pages/api/themes";

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
        className="flex flex-col items-center gap-8 border-4 border-blue-primary"
        showClose={false}
      >
        <div className="flex w-full flex-col items-center gap-4">
          <h2 className="text-center text-xl font-semibold text-blue-primary">
            Are you sure you want to delete *{subject.name}*?
          </h2>
          <p>{`Deleting a ${subjectType} is final and cannot be undone.`}</p>
        </div>
        <DialogFooter className="flex w-full flex-row gap-2 sm:justify-around">
          <Button
            variant="primary"
            type="submit"
            form="form"
            className="w-full bg-red-700 hover:bg-red-800"
            onClick={() => {
              mutateMap[subjectType](
                { _id: subject._id },
                { onSuccess: () => setOpen(false) },
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
