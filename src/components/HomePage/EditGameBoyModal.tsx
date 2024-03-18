import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Edit2Icon } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { IGameBoy } from "@/server/db/models/HomePageModel";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  QueryObserverResult,
  RefetchOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { IGame } from "@/server/db/models/GameModel";
import cx from "classnames";
import { TextArea } from "../ui/textarea";
import { Button } from "../ui/button";
import axios from "axios";

interface EditGameBoyModalProps {
  gameBoyTitle: string;
  gameBoyData: IGameBoy[];
  refetchHomePage: (
    options?: RefetchOptions | undefined,
  ) => Promise<QueryObserverResult<any, Error>>;
}

export default function EditGameBoyModal({
  gameBoyTitle,
  gameBoyData,
  refetchHomePage,
}: EditGameBoyModalProps) {
  const [open, setOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(gameBoyTitle);
  const [newData, setNewData] = useState(gameBoyData);
  const [validationErrors, setValidationErrors] = useState<{
    title: string | undefined;
    data: { gameId: string | undefined; description: string | undefined }[];
  }>({
    title: undefined,
    data: [
      {
        gameId: undefined,
        description: undefined,
      },
      {
        gameId: undefined,
        description: undefined,
      },
      {
        gameId: undefined,
        description: undefined,
      },
    ],
  });

  const { data: games } = useQuery({
    queryKey: ["games"],
    queryFn: async () => {
      const response = await fetch("/api/games");
      if (!response.ok) {
        throw new Error("Failed to fetch games");
      }
      const data = await response.json();
      return data;
    },
    retry: 3,
  });

  const editGameBoy = useMutation({
    mutationFn: () => {
      return axios.put(
        `/api/homepage/`,
        JSON.stringify({
          gameBoyTitle: newTitle,
          gameBoys: newData,
        }),
        {
          headers: {
            "Content-Type": "application/text",
          },
        },
      );
    },
    onSuccess: async () => {
      await refetchHomePage();
      setOpen(false);
    },
  });

  function clearValidationErrors() {
    setValidationErrors({
      title: undefined,
      data: [
        {
          gameId: undefined,
          description: undefined,
        },
        {
          gameId: undefined,
          description: undefined,
        },
        {
          gameId: undefined,
          description: undefined,
        },
      ],
    });
  }

  function validateForm() {
    if (!newTitle) {
      setValidationErrors({
        title: "Title is required!",
        data: validationErrors.data,
      });
      return false;
    }
    if (!newData[0].gameId || !newData[0].description) {
      setValidationErrors({
        title: validationErrors.title,
        data: [
          {
            gameId: !newData[0].gameId ? "Game is required!" : undefined,
            description: !newData[0].description
              ? "Description is required!"
              : undefined,
          },
          validationErrors.data[1],
          validationErrors.data[2],
        ],
      });
      return false;
    }

    for (let i = 1; i < 3; i++) {
      if (newData[i].gameId && !newData[i].description) {
        setValidationErrors({
          title: validationErrors.title,
          data: [
            validationErrors.data[0],
            {
              gameId: undefined,
              description: !newData[i].description
                ? "Description is required!"
                : undefined,
            },
            validationErrors.data[2],
          ],
        });
        return false;
      }
    }

    if (!newData[1].gameId && newData[2].gameId) {
      setValidationErrors({
        title: validationErrors.title,
        data: [
          validationErrors.data[0],
          {
            gameId: "Game is required!",
            description: validationErrors.data[2].description,
          },
          validationErrors.data[2],
        ],
      });
      return false;
    }

    return true;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);

        if (newOpen) {
          clearValidationErrors();
        }
      }}
    >
      <DialogTrigger asChild>
        <Edit2Icon className="absolute right-20 top-20 cursor-pointer self-end text-gray-500" />
      </DialogTrigger>

      <DialogContent className="flex max-h-[calc(100%-4rem)] max-w-2xl flex-col space-y-4 overflow-scroll">
        <div className="relative">
          <h1 className="text-lg font-semibold">
            Title<span className="text-orange-primary">*</span>
          </h1>
          <Input
            className="max-w-md"
            defaultValue={gameBoyTitle}
            onChange={(e) => {
              setNewTitle(e.target.value);
            }}
          />
          <p className="absolute bottom-[-2em] text-xs text-red-500">
            {validationErrors.title}
          </p>
        </div>
        {gameBoyData.map((gameBoy, index) => (
          <div key={index} className="flex flex-col space-y-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-nowrap text-lg font-semibold">
                Game {index + 1}
                <span
                  className={cx("text-orange-primary", {
                    invisible: index !== 0,
                  })}
                >
                  *
                </span>
              </h1>
              <div className="relative w-full">
                <Select
                  defaultValue={gameBoy.gameId}
                  onValueChange={(value) => {
                    setNewData((prev) => {
                      const newData = [...prev];
                      if (value === "no-game") {
                        newData[index].gameId = undefined;
                        return newData;
                      }
                      newData[index].gameId = value;
                      return newData;
                    });
                  }}
                >
                  <SelectTrigger className="col-span-8 text-xs font-light">
                    <SelectValue placeholder="select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="no-game">
                        <span className="text-sm italic text-gray-500">
                          No game
                        </span>
                      </SelectItem>
                      {games?.map((game: IGame & { _id: string }) => (
                        <SelectItem value={game._id} key={game._id}>
                          <span className="text-sm">{game.name}</span>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <p className="absolute bottom-[-2em] text-xs text-red-500">
                  {validationErrors.data[index].gameId}
                </p>
              </div>
            </div>
            <div className="relative">
              <h1 className="mb-2 text-lg font-semibold">
                Description
                <span
                  className={cx("text-orange-primary", {
                    invisible: index !== 0,
                  })}
                >
                  *
                </span>
              </h1>
              <TextArea
                defaultValue={gameBoy.description}
                className="h-20"
                onChange={(e) => {
                  setNewData((prev) => {
                    const newData = [...prev];
                    newData[index].description = e.target.value;
                    return newData;
                  });
                }}
              />
              <p className="absolute bottom-[-2em] text-xs text-red-500">
                {validationErrors.data[index].description}
              </p>
            </div>
          </div>
        ))}

        <div className="flex justify-end space-x-3 self-end">
          <Button
            className="bg-transparent text-black hover:bg-transparent"
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            className="bg-blue-primary"
            onClick={() => {
              if (!validateForm()) {
                return;
              }
              editGameBoy.mutate();
            }}
          >
            Save changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
