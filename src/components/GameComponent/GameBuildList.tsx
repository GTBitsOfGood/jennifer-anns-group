import React, { useState, useRef } from "react";
import Image from "next/image";
import { NonWebGLBuilds, buildSchema } from "@/utils/types";
import { Download, Pencil, Trash } from "lucide-react";
import { z } from "zod";
import { populatedGameWithId } from "@/server/db/models/GameModel";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { TextArea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  gameData: populatedGameWithId;
  editing: boolean;
  setGameData?: React.Dispatch<populatedGameWithId>;
}

function GameBuildList({ gameData, editing, setGameData }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState<z.infer<typeof buildSchema> | null>(
    null,
  );
  const [url, setUrl] = useState<string | undefined>("");
  const [instructions, setInstructions] = useState<string | undefined>("");
  const [selectedBuildType, setSelectedBuildType] = useState<
    NonWebGLBuilds | ""
  >("");

  interface ValidationErrors {
    link: string | undefined;
  }

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    link: undefined,
  });

  const handleEditBuild = () => {
    if (!editData || !setGameData) return;

    if (selectedBuildType === "") {
      alert("Please select a Game Build type.");
      return;
    }
    const input = {
      type: selectedBuildType,
      link: url,
      instructions: instructions,
    };
    const parse = buildSchema.safeParse(input);

    if (parse.success) {
      setValidationErrors({
        link: undefined,
      });
      const updatedBuilds = gameData?.builds?.map((build) => {
        if (build.type === editData.type) {
          return {
            ...build,
            link: url || build.link,
            instructions: instructions || build.instructions,
            type: selectedBuildType || build.type,
          };
        }
        return build;
      });

      setGameData({
        ...gameData,
        builds: updatedBuilds,
      });

      setOpenIndex(null);
      setEditData(null);
      setUrl("");
      setInstructions("");
      setSelectedBuildType("");
    } else {
      const errors = parse.error.formErrors.fieldErrors;
      setValidationErrors({
        link: errors.link?.at(0),
      });
    }
  };

  const handleDeleteConfirmation = (index: number) => {
    setOpenIndex(index);
  };

  const handleDeleteBuild = (data: z.infer<typeof buildSchema>) => {
    if (!setGameData) return;

    const updatedBuilds = gameData?.builds?.filter(
      (build) => build.type !== data.type,
    );

    setGameData({
      ...gameData,
      builds: updatedBuilds,
    });

    setOpenIndex(null);
  };

  const cancelRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div>
      {gameData.builds &&
        gameData.builds.map(
          (data: z.infer<typeof buildSchema>, index: number) => (
            <div key={index} className="mb-4">
              <div className="flex flex-row items-start justify-between">
                <div key={index} className="mb-2 flex flex-row gap-5">
                  <div className="flex max-h-14 min-h-14 w-14 min-w-14 max-w-14">
                    <Image
                      src={`/gamebuilds/${data.type}.png`}
                      height={30}
                      width={30}
                      className="mx-2 self-center"
                      alt=""
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <div
                      className="flex cursor-pointer flex-row gap-2 font-semibold text-blue-primary"
                      onClick={() => window.open(data.link, "_blank")}
                    >
                      <Download />
                      Download
                    </div>
                  </div>
                </div>
                {editing && (
                  <div className="flex flex-row items-center gap-4 text-sm">
                    <Pencil
                      className="cursor-pointer"
                      onClick={() => {
                        setEditData(data);
                        setOpenIndex(index);
                        setUrl(data.link);
                        setInstructions(data.instructions || "");
                        setSelectedBuildType(data.type);
                      }}
                    />
                    <Trash
                      className="cursor-pointer"
                      onClick={() => handleDeleteConfirmation(index)}
                    />

                    {/* Edit Dialogue */}
                    <Dialog
                      open={openIndex === index && editData === data}
                      onOpenChange={(isOpen) =>
                        isOpen ? setOpenIndex(index) : setOpenIndex(null)
                      }
                    >
                      <DialogContent
                        className="border-4 border-solid border-blue-primary p-12 font-sans sm:max-w-[600px]"
                        onCloseAutoFocus={() => {
                          // Reset state when dialog closes
                          setOpenIndex(null);
                          setEditData(null);
                          setUrl("");
                          setInstructions("");
                          setSelectedBuildType("");
                          setValidationErrors({
                            link: undefined,
                          });
                        }}
                      >
                        <DialogHeader>
                          <DialogTitle className="-mb-2 text-lg font-semibold text-blue-primary">
                            Edit Non-WebGL Build
                          </DialogTitle>
                        </DialogHeader>
                        <div className="mt-4 flex flex-col gap-5">
                          <div className="flex w-full flex-row items-center justify-between gap-3">
                            <Label className="text-md min-w-28 font-medium">
                              Game Build
                              <span className="text-orange-primary">*</span>
                            </Label>

                            <span className="w-full">
                              <Select
                                value={selectedBuildType}
                                onValueChange={(s) =>
                                  setSelectedBuildType(s as NonWebGLBuilds)
                                }
                                name="build-type"
                              >
                                <SelectTrigger className="w-full text-xs font-light">
                                  <SelectValue placeholder="Select an option" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup className="font-sans">
                                    <SelectItem
                                      disabled={
                                        !(data.type == "amazon") &&
                                        gameData?.builds?.some(
                                          (build) => build.type === "amazon",
                                        )
                                      }
                                      value="amazon"
                                    >
                                      Amazon
                                    </SelectItem>
                                    <SelectItem
                                      disabled={
                                        !(data.type == "android") &&
                                        gameData?.builds?.some(
                                          (build) => build.type === "android",
                                        )
                                      }
                                      value="android"
                                    >
                                      Android
                                    </SelectItem>
                                    <SelectItem
                                      disabled={
                                        !(data.type == "appstore") &&
                                        gameData?.builds?.some(
                                          (build) => build.type === "appstore",
                                        )
                                      }
                                      value="appstore"
                                    >
                                      App Store
                                    </SelectItem>
                                    <SelectItem
                                      disabled={
                                        !(data.type == "linux") &&
                                        gameData?.builds?.some(
                                          (build) => build.type === "linux",
                                        )
                                      }
                                      value="linux"
                                    >
                                      Linux
                                    </SelectItem>
                                    <SelectItem
                                      disabled={
                                        !(data.type == "mac") &&
                                        gameData?.builds?.some(
                                          (build) => build.type === "mac",
                                        )
                                      }
                                      value="mac"
                                    >
                                      Mac
                                    </SelectItem>
                                    <SelectItem
                                      disabled={
                                        !(data.type == "windows") &&
                                        gameData?.builds?.some(
                                          (build) => build.type === "windows",
                                        )
                                      }
                                      value="windows"
                                    >
                                      Windows
                                    </SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </span>
                          </div>

                          <div className="flex w-full flex-row items-center justify-between gap-4">
                            <Label
                              htmlFor="url"
                              className="text-md font-medium"
                            >
                              URL
                              <span className="text-orange-primary">*</span>
                            </Label>

                            <span className="w-full">
                              <div className="flex flex-col">
                                <Input
                                  id="url"
                                  value={url}
                                  onChange={(e) => setUrl(e.target.value)}
                                  type="url"
                                  className={
                                    "w-full text-xs font-light" +
                                    (validationErrors.link
                                      ? " border-red-500 focus-visible:ring-red-500"
                                      : "")
                                  }
                                />
                                <p className="absolute mt-10 text-xs text-red-500">
                                  {validationErrors.link}
                                </p>
                              </div>
                            </span>
                          </div>

                          <div className="flex w-full flex-col items-start gap-3 md:flex-row md:gap-8">
                            <Label
                              htmlFor="instructions"
                              className="text-md min-w-21 font-medium"
                            >
                              Instructions
                            </Label>
                            <span className="w-full">
                              <TextArea
                                id="instructions"
                                className="min-h-24 shrink text-xs font-light"
                                value={instructions}
                                onChange={(
                                  e: React.ChangeEvent<HTMLTextAreaElement>,
                                ) => setInstructions(e.target.value)}
                              />
                            </span>
                          </div>
                          <div className="flex-end mt-5 flex w-full justify-end gap-3">
                            <Button
                              variant="white"
                              className="px-4 text-lg"
                              type="button"
                              onClick={() => {
                                setOpenIndex(null);
                                setEditData(null);
                                setUrl("");
                                setInstructions("");
                                setSelectedBuildType("");
                              }}
                            >
                              Cancel
                            </Button>

                            <Button
                              type="button"
                              onClick={handleEditBuild}
                              variant="mainblue"
                              className="px-4 text-lg"
                            >
                              Done
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Delete Confirmation Dialog */}
                    <Dialog
                      open={openIndex === index && editData === null}
                      onOpenChange={(isOpen) =>
                        isOpen ? setOpenIndex(index) : setOpenIndex(null)
                      }
                    >
                      <DialogContent className="border-4 border-solid border-blue-primary p-14 sm:max-w-[500px]">
                        <div className="mx-auto flex w-full flex-col items-center">
                          <div className="text-center font-sans text-xl font-bold text-blue-primary">
                            Are you sure you want to delete this {gameData.name}{" "}
                            {data.type.toUpperCase()} build?
                          </div>
                        </div>
                        <p className="mt-1 text-center font-sans text-sm">
                          Deleting a game build is final and cannot be undone.
                        </p>
                        <div className="mx-auto mt-4 flex flex-row items-center gap-4">
                          <button
                            onClick={() => handleDeleteBuild(data)}
                            className="text-md rounded-xl bg-delete-red px-4 py-2 font-sans font-semibold text-white"
                          >
                            Yes, delete build
                          </button>
                          <button
                            ref={cancelRef}
                            onClick={() => setOpenIndex(null)}
                            className="text-md rounded-xl border-[1px] border-solid border-black px-4 py-2 font-sans font-semibold"
                          >
                            No, return
                          </button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
              {data.instructions && (
                <div className="mb-6 flex flex-row">
                  <div className="max-w-4/5 min-w-[78px]"></div>
                  <div className="flex max-w-[80%] flex-col gap-2">
                    <p className="text-sm text-blue-primary">Instructions</p>
                    <p className="text-sm">{data.instructions}</p>
                  </div>
                </div>
              )}
            </div>
          ),
        )}
    </div>
  );
}

export default GameBuildList;
