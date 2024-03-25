import { populatedGameWithId } from "@/server/db/models/GameModel";
import React, { useEffect } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { AlertTriangleIcon, Pencil, Plus, X } from "lucide-react";

import { useState } from "react";

import axios from "axios";
import { useRouter } from "next/router";
import DeleteWebGLBuild from "./DeleteWebGLBuild";

// there's probably a better place to put these
export type BuildFileType = "data" | "framework" | "loader" | "code";
export const buildFileTypes = Object.freeze({
  data: "build.data",
  framework: "build.framework.js",
  loader: "build.loader.js",
  code: "build.wasm",
});

interface Props {
  gameData: populatedGameWithId;
}

async function uploadBuildFiles(
  gameId: string,
  addOrEdit: "Add" | "Edit",
  files: Map<string, File>,
) {
  if (files.size !== 4) {
    throw new Error("Invalid build files");
  }

  for (const type of Object.keys(buildFileTypes)) {
    if (!files.has(type)) {
      throw new Error(`Missing file: ${type}`);
    }
  }

  // atomic uploads?
  await Promise.all(
    Array.from(files.entries()).map(async ([type, file]) => {
      let retryCount = 0;
      let success = false;

      while (retryCount < 4 && !success) {
        try {
          if (addOrEdit === "Edit") {
            const { data } = await axios.put(`/api/games/${gameId}/builds`, {
              gameId,
            });
            const uploadUrl = data.uploadUrl;
            const uploadAuthToken = data.uploadAuthToken;

            const fileName = `${gameId}/${
              buildFileTypes[type as keyof typeof buildFileTypes]
            }`;

            await axios.post(uploadUrl, file, {
              headers: {
                Authorization: uploadAuthToken,
                "X-Bz-File-Name": fileName,
                "Content-Type": file.type,
                "X-Bz-Content-Sha1": "do_not_verify",
              },
            });
          } else {
            const { data } = await axios.post(`/api/games/${gameId}/builds`, {
              gameId,
            });
            const uploadUrl = data.uploadUrl;
            const uploadAuthToken = data.uploadAuthToken;

            const fileName = `${gameId}/${
              buildFileTypes[type as keyof typeof buildFileTypes]
            }`;

            await axios.post(uploadUrl, file, {
              headers: {
                Authorization: uploadAuthToken,
                "X-Bz-File-Name": fileName,
                "Content-Type": file.type,
                "X-Bz-Content-Sha1": "do_not_verify",
              },
            });
          }

          success = true;
        } catch (error) {
          retryCount++;
        }
      }

      if (!success) {
        throw new Error("Failed to upload file after 4 retries");
      }
    }),
  );

  if (addOrEdit === "Add") {
    await axios.put(
      `/api/games/${gameId}`,
      JSON.stringify({ webGLBuild: true }),
      {
        headers: {
          "Content-Type": "text",
        },
      },
    );
  }
}
function AddEditWebGLComponent(props: Props) {
  const [loaderFile, setLoaderFile] = useState<null | File>(null);
  const [dataFile, setDataFile] = useState<null | File>(null);
  const [codeFile, setCodeFile] = useState<null | File>(null);
  const [frameworkFile, setFrameworkFile] = useState<null | File>(null);

  const [open, setOpen] = useState(false);

  const [uploading, setUploading] = useState<boolean>(false);
  const [fileValidationError, setFileValidationError] = useState(false);

  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null || event.target.files.length === 0) return;

    const file = event.target.files[0];
    const name = event.target.name;

    switch (name) {
      case "loader":
        setLoaderFile(file);
        break;
      case "data":
        setDataFile(file);
        break;
      case "code":
        setCodeFile(file);
        break;
      case "framework":
        setFrameworkFile(file);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async () => {
    if (
      loaderFile === null ||
      dataFile === null ||
      codeFile === null ||
      frameworkFile === null
    ) {
      setFileValidationError(true);
      return;
    }

    const files = new Map([
      ["loader", loaderFile],
      ["data", dataFile],
      ["code", codeFile],
      ["framework", frameworkFile],
    ]);

    try {
      const gameId = router.query.id;
      if (gameId) {
        setUploading(true);
        await uploadBuildFiles(gameId.toString(), addOrEdit, files);
        setUploading(false);
        setFileValidationError(false);
        setAddOrEdit("Edit");
        setOpen(false);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to upload files");
    }
  };

  const handleFileDelete = (
    e: React.MouseEvent<SVGSVGElement>,
    setFileState: React.Dispatch<React.SetStateAction<File | null>>,
  ) => {
    e.preventDefault();
    setFileState(null);
  };

  const cancelSubmit = () => {
    setOpen(false);
    setLoaderFile(null);
    setDataFile(null);
    setCodeFile(null);
    setFrameworkFile(null);
    setFileValidationError(false);
  };

  const [addOrEdit, setAddOrEdit] = useState<"Add" | "Edit">("Add");

  useEffect(() => {
    if (props.gameData.webGLBuild) {
      setAddOrEdit("Edit");
    } else {
      setAddOrEdit("Add");
    }
  }, [props.gameData]);

  const handleOpenChange = () => {
    setOpen(!open);
    setFileValidationError(false);
  };

  return (
    <div className="h-[65vh] font-sans">
      <div className="border-3 group flex h-full w-full items-center justify-center rounded-sm border border-black">
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="mainblue"
              className="flex hidden h-12 rounded-xl text-lg font-semibold text-white group-hover:block "
            >
              <div className="flex items-center gap-2 font-sans">
                <p>{addOrEdit} WebGL Game</p>
                {addOrEdit === "Add" ? <Plus /> : <Pencil />}
              </div>
            </Button>
          </DialogTrigger>

          <DialogContent className="border-4 border-solid border-blue-primary px-12 py-10 md:w-2/3">
            <DialogHeader>
              <DialogTitle className="-mb-2 text-lg font-semibold text-blue-primary">
                {addOrEdit} WebGL Game
              </DialogTitle>
            </DialogHeader>

            <div className="flex w-full flex-col gap-4 py-4 font-sans">
              <div className="flex w-full flex-row items-center justify-between gap-3">
                <h1 className="text-md font-medium">
                  Loader<span className="text-orange-primary">*</span>
                </h1>

                <span className="w-2/3">
                  {loaderFile ? (
                    <Label className="inline-block w-full py-2 text-center">
                      <div className="flex flex-row items-center gap-2 text-xs">
                        <span className="">{loaderFile.name}</span>
                        <X
                          className="cursor-pointer text-orange-primary"
                          onClick={(e: React.MouseEvent<SVGSVGElement>) =>
                            handleFileDelete(e, setLoaderFile)
                          }
                          type="button"
                          size={18}
                        />
                      </div>
                    </Label>
                  ) : (
                    <Label className="relative inline-block w-full rounded-md border border-black bg-[#D9D9D9] px-4 py-3 text-center hover:cursor-pointer">
                      Choose File
                      <input
                        className="absolute opacity-0 hover:cursor-pointer"
                        type="file"
                        name="loader"
                        onChange={handleFileChange}
                      />
                    </Label>
                  )}
                </span>
              </div>

              <div className="flex w-full flex-row items-center justify-between gap-3">
                <h1 className="text-md font-medium">
                  Data<span className="text-orange-primary">*</span>
                </h1>

                <span className="w-2/3">
                  {dataFile ? (
                    <Label className="inline-block w-full py-2 text-center">
                      <div className="flex flex-row items-center gap-2 text-xs">
                        <span className="">{dataFile.name}</span>
                        <X
                          className="cursor-pointer text-orange-primary"
                          onClick={(e) => handleFileDelete(e, setDataFile)}
                          type="button"
                          size={18}
                        />
                      </div>
                    </Label>
                  ) : (
                    <Label className="relative inline-block w-full rounded-md border border-black bg-[#D9D9D9] px-4 py-3 text-center hover:cursor-pointer">
                      Choose File
                      <input
                        className="absolute opacity-0 hover:cursor-pointer"
                        type="file"
                        name="data"
                        onChange={handleFileChange}
                      />
                    </Label>
                  )}
                </span>
              </div>

              <div className="flex w-full flex-row items-center justify-between gap-3">
                <h1 className="text-md font-medium">
                  Code<span className="text-orange-primary">*</span>
                </h1>
                <span className="w-2/3">
                  {codeFile ? (
                    <Label className="inline-block w-full py-2 text-center">
                      <div className="flex flex-row items-center gap-2 text-xs">
                        <span className="">{codeFile.name}</span>
                        <X
                          className="cursor-pointer text-orange-primary"
                          onClick={(e) => handleFileDelete(e, setCodeFile)}
                          type="button"
                          size={18}
                        />
                      </div>
                    </Label>
                  ) : (
                    <Label className="relative inline-block w-full rounded-md border border-black bg-[#D9D9D9] px-4 py-3 text-center hover:cursor-pointer">
                      Choose File
                      <input
                        className="absolute opacity-0 hover:cursor-pointer"
                        type="file"
                        name="code"
                        onChange={handleFileChange}
                      />
                    </Label>
                  )}
                </span>
              </div>

              <div className="flex w-full flex-row items-center justify-between gap-3">
                <h1 className="text-md font-medium">
                  Framework<span className="text-orange-primary">*</span>
                </h1>
                <span className="w-2/3">
                  {frameworkFile ? (
                    <Label className="inline-block w-full py-2 text-center">
                      <div className="flex flex-row items-center gap-2 text-xs">
                        <span className="">{frameworkFile.name}</span>
                        <X
                          className="cursor-pointer text-orange-primary"
                          onClick={(e) => handleFileDelete(e, setFrameworkFile)}
                          type="button"
                          size={18}
                        />
                      </div>
                    </Label>
                  ) : (
                    <Label className="relative inline-block w-full rounded-md border border-black bg-[#D9D9D9] px-4 py-3 text-center hover:cursor-pointer">
                      Choose File
                      <input
                        className="absolute opacity-0 hover:cursor-pointer"
                        type="file"
                        name="framework"
                        onChange={handleFileChange}
                      />
                    </Label>
                  )}
                </span>
              </div>
              {fileValidationError && (
                <div className="mt-2 flex h-10 w-full items-center gap-2 rounded-sm bg-red-100 px-4 py-6 text-sm text-red-500">
                  <AlertTriangleIcon className="h-5 w-5" />
                  <p className="">All files must be uploaded!</p>
                </div>
              )}
              <div className="flex-end mt-5 flex w-full justify-end gap-3">
                <Button
                  variant="white"
                  className="px-4 text-lg"
                  type="button"
                  disabled={uploading}
                  onClick={cancelSubmit}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  variant="mainblue"
                  className="px-4 text-lg"
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Done"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {addOrEdit === "Edit" && <DeleteWebGLBuild setAddOrEdit={setAddOrEdit} />}
    </div>
  );
}

export default AddEditWebGLComponent;
