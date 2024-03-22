import { CLOUDFLARE_URL } from "@/utils/consts";
import axios from "axios";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { X } from "lucide-react";

// there's probably a better place to put these
export type BuildFileType = "data" | "framework" | "loader" | "code";
export const buildFileTypes = Object.freeze({
  data: "build.data",
  framework: "build.framework.js",
  loader: "build.loader.js",
  code: "build.wasm",
});

async function uploadBuildFiles(gameId: string, files: Map<string, File>) {
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

export default function WebGLUpload() {
  const [loaderFile, setLoaderFile] = useState<null | File>(null);
  const [dataFile, setDataFile] = useState<null | File>(null);
  const [codeFile, setCodeFile] = useState<null | File>(null);
  const [frameworkFile, setFrameworkFile] = useState<null | File>(null);
  const [gameId, setGameId] = useState("");

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      loaderFile === null ||
      dataFile === null ||
      codeFile === null ||
      frameworkFile === null
    ) {
      alert("Please select all files");
      return;
    }

    const files = new Map([
      ["loader", loaderFile],
      ["data", dataFile],
      ["code", codeFile],
      ["framework", frameworkFile],
    ]);

    try {
      await uploadBuildFiles(gameId, files);
      alert("Files uploaded successfully");
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

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex w-full flex-col gap-4 py-4">
          <div className="flex w-full flex-row items-center justify-between gap-3">
            <h1 className="text-md font-medium">Game ID</h1>

            <span className="w-4/5">
              <Input
                type="text"
                name="gameId"
                className="w-full text-xs font-light"
                onChange={(e) => {
                  setGameId(e.target.value);
                }}
              />
            </span>
          </div>

          <div className="flex w-full flex-row items-center justify-between gap-3">
            <h1 className="text-md font-medium">
              Loader<span className="text-orange-primary">*</span>
            </h1>

            <span className="w-4/5">
              {loaderFile ? (
                <Label className="inline-block w-full py-2 text-center">
                  <div className="flex flex-row items-center gap-2">
                    <span className="">{loaderFile.name}</span>
                    <X
                      className="cursor-pointer text-orange-primary"
                      onClick={(e) => handleFileDelete(e, setLoaderFile)}
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

            <span className="w-4/5">
              {dataFile ? (
                <Label className="inline-block w-full py-2 text-center">
                  <div className="flex flex-row items-center gap-2">
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
            <span className="w-4/5">
              {codeFile ? (
                <Label className="inline-block w-full py-2 text-center">
                  <div className="flex flex-row items-center gap-2">
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
            <span className="w-4/5">
              {frameworkFile ? (
                <Label className="inline-block w-full py-2 text-center">
                  <div className="flex flex-row items-center gap-2">
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

          <Button type="submit" className="block cursor-pointer font-bold">
            Submit
          </Button>
        </div>
      </form>
    </>
  );
}
