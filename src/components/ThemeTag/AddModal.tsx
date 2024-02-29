import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutateFunction,
} from "@tanstack/react-query";
import { IGame } from "@/server/db/models/GameModel";
import { Tag } from "../ui/tag";
import {
  DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_FORM_ACTIONS,
  useCallback,
  useState,
} from "react";
import { z } from "zod";
import { ITheme } from "@/server/db/models/ThemeModel";
import { CreateThemeInput } from "@/pages/api/themes";
import { CreateTagInput } from "@/pages/api/tags";

const FORM_GAMES_KEY = "games";
const FORM_NAME_KEY = "name";

const formSchema = z.object({
  name: z.string().trim().min(1, "Name must not be empty"),
  games: z.array(z.string().length(24)),
});

type Subject = "theme" | "accessibility" | "tag";

interface Props {
  subject: Subject | null;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function AddModal({ subject, open, setOpen }: Props) {
  const queryClient = useQueryClient();

  const { status, data: games } = useQuery({
    queryKey: ["allGames"],
    queryFn: () =>
      fetch("/api/games").then((res) => res.json()) as Promise<
        (IGame & { _id: string })[]
      >,
  });

  const { mutate: mutateTheme } = useMutation({
    mutationFn: (theme: CreateThemeInput) =>
      fetch("/api/themes", {
        method: "POST",
        body: JSON.stringify(theme),
      }).then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allThemes"] });
    },
  });

  const { mutate: mutateTag } = useMutation({
    mutationFn: (tag: CreateTagInput) =>
      fetch("/api/tags", {
        method: "POST",
        body: JSON.stringify(tag),
      }).then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tagsByType"] });
    },
  });

  const SUBJECT_MUTATE_MAP: Record<
    Subject,
    (
      input: { name: string; games: string[] },
      callback: { onSuccess: () => void }
    ) => void
  > = {
    theme: (input, callback) => mutateTheme(input, callback),
    tag: (input, callback) => mutateTag({ ...input, type: "custom" }, callback),
    accessibility: (input, callback) =>
      mutateTag({ ...input, type: "accessibility" }, callback),
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const inputs = {
        name: formData.get(FORM_NAME_KEY),
        games: formData.getAll(FORM_GAMES_KEY),
      };

      const parsed = formSchema.safeParse(inputs);
      if (!parsed.success) {
        console.log(parsed.error.formErrors.fieldErrors);
        setNameError(parsed.error.formErrors.fieldErrors.name?.at(0));
        return;
      }
      setNameError(undefined);
      SUBJECT_MUTATE_MAP[subject!](
        {
          name: parsed.data.name,
          games: parsed.data.games,
        },
        {
          onSuccess: () => {
            setOpen(false);
          },
        }
      );
    },
    [subject]
  );

  const [nameError, setNameError] = useState<string | undefined>(undefined);

  if (!subject) {
    return <div></div>;
  }

  const capitalizedSubject = subject.charAt(0).toUpperCase() + subject.slice(1);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="border-blue-primary border-4 flex flex-col gap-8">
        <DialogHeader>
          <DialogTitle className="text-blue-primary text-xl tracking-normal font-semibold">{`New ${capitalizedSubject}`}</DialogTitle>
        </DialogHeader>
        <div className="w-full">
          <form
            id="form"
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
          >
            <div className="relative">
              <Label
                htmlFor={FORM_NAME_KEY}
                className="text-lg font-normal"
              >{`${capitalizedSubject} name`}</Label>
              <Input
                id={FORM_NAME_KEY}
                name={FORM_NAME_KEY}
                className={
                  nameError ? "border-red-500 border" : "border-input-border"
                }
              />
              {nameError ? (
                <p className=" absolute bottom-[-1.5em] text-red-500 text-xs">
                  {nameError}
                </p>
              ) : null}
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-lg font-normal">Select games</Label>
              <div className="flex flex-row gap-2">
                {games?.map((game) => {
                  return (
                    <div key={game._id}>
                      <input
                        id={game._id}
                        className="peer hidden"
                        type="checkbox"
                        name={FORM_GAMES_KEY}
                        value={game._id}
                      />
                      <Label
                        htmlFor={game._id}
                        className="bg-gray-200 rounded-full py-1.5 px-4 font-normal peer-checked:border-blue-primary border hover:cursor-pointer"
                      >
                        {game.name}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>
          </form>
        </div>
        <DialogFooter className="flex flex-row sm:justify-between w-full">
          <DialogClose>
            <Button
              variant="ghost"
              className="text-blue-primary hover:text-blue-primary"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button variant="primary" type="submit" form="form">
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddModal;
