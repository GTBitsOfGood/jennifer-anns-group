import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EditGameInput } from "@/pages/api/games/[id]";
import {
  GetGameContextTagsOutput,
  PutTagsWithGameContextInput,
} from "@/pages/api/games/[id]/tags";
import {
  GetGameContextOutput,
  GetGameContextThemesOutput,
} from "@/pages/api/games/[id]/themes";
import { Spinner } from "@chakra-ui/react";
import { PopoverClose } from "@radix-ui/react-popover";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { useState } from "react";

type ContentType = "theme" | "accessibility" | "custom";

const contentTypePropertyMap: Record<ContentType, "themes" | "tags"> = {
  theme: "themes",
  accessibility: "tags",
  custom: "tags",
};

interface Props {
  gameId: string;
  contentType: ContentType;
}

//TODO: Make global or lazy-load. Fetches occur at first render, even when content is not visible as it is nested under Popover.
function EditPopover(props: Props) {
  const { gameId, contentType } = props;

  const queryClient = useQueryClient();

  const contentTypeGetEndpointMap: Record<ContentType, string> = {
    theme: `/api/games/${gameId}/themes`,
    accessibility: `/api/games/${gameId}/tags`,
    custom: `/api/games/${gameId}/tags`,
  };

  const contentTypePutEndpointMap: Record<ContentType, string> = {
    theme: `/api/games/${gameId}`,
    accessibility: `/api/games/${gameId}/tags`,
    custom: `/api/games/${gameId}/tags`,
  };

  const { data, status } = useQuery({
    queryKey: ["gameById", gameId, contentType],
    queryFn: () =>
      fetch(contentTypeGetEndpointMap[contentType]).then(
        (res) => res.json() as Promise<GetGameContextOutput>,
      ),
  });

  const { mutateAsync } = useMutation({
    mutationFn: (data: PutTagsWithGameContextInput | EditGameInput) =>
      fetch(contentTypePutEndpointMap[contentType], {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["allGames"],
      });
      queryClient.invalidateQueries({
        queryKey: ["gameById", gameId, contentType],
      });
    },
  });

  const [open, setOpen] = useState(false);

  const nestedSource =
    contentType === "accessibility" || contentType === "custom"
      ? (data as GetGameContextTagsOutput | undefined)?.[contentType]
      : (data as GetGameContextThemesOutput);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const selected = formData.getAll(contentType);
    const property = contentTypePropertyMap[contentType];

    let input = {};
    if (property === "themes") {
      input = {
        [property]: selected,
      };
    } else {
      input = {
        type: contentType,
        data: selected,
        gameId,
      };
    }
    const res = await mutateAsync(input);
    if (res.ok) {
      setOpen(false);
    }
  }

  if (status === "pending" || nestedSource === undefined) {
    return <Spinner />;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <Pencil className="h-4 w-4 text-blue-primary" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[12em]" align="start">
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            {nestedSource.map((d) => {
              return (
                <div key={d._id} className="flex items-center space-x-2">
                  <Checkbox
                    name={contentType}
                    id={d._id}
                    className="bg-blue-primary"
                    defaultChecked={d.checked}
                    value={d._id}
                  />
                  <Label htmlFor={d._id} className="font-normal">
                    {d.name}
                  </Label>
                </div>
              );
            })}
          </div>
          <div className="flex flex-row items-center justify-between">
            <PopoverClose asChild>
              <Button
                variant="ghost"
                className="w-18 h-6 text-blue-primary hover:text-blue-primary"
              >
                Cancel
              </Button>
            </PopoverClose>
            <Button variant="primary" className="w-18 h-6" type="submit">
              Apply
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}

export default EditPopover;
