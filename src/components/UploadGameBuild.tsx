import React, { useEffect, useState } from "react";
import { AlertTriangleIcon, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { ChangeEvent } from "react";
import { Input } from "./ui/input";
import { TextArea } from "./ui/textarea";
import WebGLUpload from "./WebGLUpload";

import { z } from "zod";
import { AllBuilds, NonWebGLBuilds, buildSchema } from "@/utils/types";
import Image from "next/image";

const BUILD_FORM_KEY = "build";
const URL_FORM_KEY = "gameurl";
const INSTR_FORM_KEY = "instructions";

interface Props {
  builds: z.infer<typeof buildSchema>[];
  uploadedWebGL: boolean;
  setUploadedWebGL: React.Dispatch<React.SetStateAction<boolean>>;
  setBuilds: React.Dispatch<
    React.SetStateAction<z.infer<typeof buildSchema>[]>
  >;
  loaderFile: null | File;
  setLoaderFile: React.Dispatch<React.SetStateAction<null | File>>;
  dataFile: null | File;
  setDataFile: React.Dispatch<React.SetStateAction<null | File>>;
  codeFile: null | File;
  setCodeFile: React.Dispatch<React.SetStateAction<null | File>>;
  frameworkFile: null | File;
  setFrameworkFile: React.Dispatch<React.SetStateAction<null | File>>;
}

function getInstructions(os: string): string {
  switch (os) {
    case "windows":
      return `After downloading the file to your computer it needs to be unzipped.\nOnce the file has been unzipped, navigate to the new folder (GAME_FOLDER).\nIn that folder there will be an executable file called GAME_FILE -- opening this file will launch GAME_NAME.`;
    case "linux":
      return `After downloading the file the content first needs to be extracted.\nOnce the content has been extracted, navigate to the new folder (GAME_FOLDER).\nIn that folder there will be an executable file called GAME_FILE -- opening this file will launch GAME_NAME.`;
    case "mac":
      return `After downloading the file the content first needs to be unzipped.\nOnce the file has been unzipped, navigate to the new folder (GAME_FOLDER).\nIn that folder there will be an executable file called GAME_FILE -- opening this file will launch GAME_NAME.`;
    default:
      return "";
  }
}

function UploadGameBuild(props: Props) {
  const [selectedOption, setSelectedOption] = useState<AllBuilds | "">("");

  const [url, setUrl] = useState<string>("");
  const [instructions, setInstructions] = useState<string>("");

  const [uploadedFilenames, setUploadedFilenames] = useState<string[]>([]);

  const handleSelectChange = (value: AllBuilds) => {
    setSelectedOption(value);
    setInstructions(getInstructions(value));
  };

  const [showUploadGameBuild, setShowUploadGameBuild] =
    useState<boolean>(false);

  const [showUploadedBuild, setShowUploadedBuild] = useState<boolean>(false);

  interface ValidationErrors {
    link: string | undefined;
  }

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    link: undefined,
  });

  function handleSubmitNonWebGL() {
    if (selectedOption === "") {
      alert("Please select a Game Build type.");
      return;
    }
    const input = {
      type: selectedOption,
      link: url,
      instructions: instructions,
    };
    const parse = buildSchema.safeParse(input);

    if (parse.success) {
      setValidationErrors({
        link: undefined,
      });
      props.setBuilds((prevBuilds) => {
        const index = prevBuilds.findIndex(
          (build) => build.type === parse.data.type,
        );
        if (index !== -1) {
          const updatedBuilds = [...prevBuilds];
          updatedBuilds[index] = parse.data;
          return updatedBuilds;
        } else {
          return [...prevBuilds, parse.data];
        }
      });
      setUploadedFilenames([parse.data.link]);
      setShowUploadGameBuild(false);
      setShowUploadedBuild(true);
    } else {
      setValidationErrors({
        link:
          url === ""
            ? "Required text field is missing!"
            : "Please enter a valid URL",
      });
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleInstructionsChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setInstructions(e.target.value);
  };

  const deleteBuild = (file: number): void => {
    props.setBuilds((prevBuilds) =>
      prevBuilds.filter(
        (build) => build.type !== (selectedOption as NonWebGLBuilds),
      ),
    );
    if (selectedOption === "webgl") {
      switch (file) {
        case 0:
          props.setLoaderFile(null);
          setUploadedFilenames((prevFilenames) =>
            prevFilenames.filter((_, index) => index !== 0),
          );
          break;
        case 1:
          props.setDataFile(null);
          setUploadedFilenames((prevFilenames) =>
            prevFilenames.filter((_, index) => index !== 1),
          );
          break;
        case 2:
          props.setCodeFile(null);
          setUploadedFilenames((prevFilenames) =>
            prevFilenames.filter((_, index) => index !== 2),
          );
          break;
        case 3:
          props.setFrameworkFile(null);
          setUploadedFilenames((prevFilenames) =>
            prevFilenames.filter((_, index) => index !== 3),
          );
          break;
        default:
          break;
      }
    }
    if (uploadedFilenames.length - 1 == 0) {
      props.setUploadedWebGL(false);
      setShowUploadedBuild(false);
    }
  };

  const cancelUpload = () => {
    deleteBuild(-1);

    setSelectedOption("");
    setUrl("");
    setInstructions("");

    setUploadedFilenames([]);
    setShowUploadedBuild(false);
    setShowUploadGameBuild(false);
  };

  const handleUploadBuild = () => {
    deleteBuild(-1);
    setShowUploadGameBuild(true);
  };

  return (
    <>
      {!showUploadGameBuild ? (
        <div className="flex flex-row items-center gap-3">
          <Button
            variant="upload"
            className="flex h-12 w-32 flex-row gap-3 self-start"
            type="button"
            onClick={handleUploadBuild}
          >
            <Upload className="h-6 w-6" />
            <p className="font-normal">Upload</p>
          </Button>
          {showUploadedBuild && (
            <div className="flex flex-row items-start gap-2">
              <Image
                src={`/gamebuilds/${selectedOption}.png`}
                height={24}
                width={24}
                className="mx-2"
                alt=""
              />
              <div className="flex flex-col">
                {uploadedFilenames.map((filename, index) => (
                  <div key={index} className="flex flex-row items-center gap-3">
                    <p>{filename}</p>
                    <X
                      className="cursor-pointer text-orange-primary"
                      type="button"
                      size={18}
                      onClick={() => {
                        deleteBuild(index);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-lg border-2 border-[#666666] p-8">
          <p className="mb-2 text-xl font-semibold text-blue-primary">
            Upload Game
          </p>
          <div className="flex w-full flex-col gap-7 py-4">
            <div className="flex w-full flex-row items-center justify-between gap-3">
              <Label className="text-md min-w-28 font-medium">
                Game Build
                <span className="text-orange-primary">*</span>
              </Label>

              <span className="w-full">
                <Select
                  name={BUILD_FORM_KEY}
                  onValueChange={handleSelectChange}
                  defaultValue={selectedOption}
                >
                  <SelectTrigger className="w-full text-xs font-light">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem
                        disabled={props.builds.some(
                          (build) => build.type === "amazon",
                        )}
                        value="amazon"
                      >
                        Amazon
                      </SelectItem>
                      <SelectItem
                        disabled={props.builds.some(
                          (build) => build.type === "android",
                        )}
                        value="android"
                      >
                        Android
                      </SelectItem>
                      <SelectItem
                        disabled={props.builds.some(
                          (build) => build.type === "appstore",
                        )}
                        value="appstore"
                      >
                        App Store
                      </SelectItem>
                      <SelectItem
                        disabled={props.builds.some(
                          (build) => build.type === "linux",
                        )}
                        value="linux"
                      >
                        Linux
                      </SelectItem>
                      <SelectItem
                        disabled={props.builds.some(
                          (build) => build.type === "mac",
                        )}
                        value="mac"
                      >
                        Mac
                      </SelectItem>
                      <SelectItem disabled={props.uploadedWebGL} value="webgl">
                        WebGL
                      </SelectItem>
                      <SelectItem
                        disabled={props.builds.some(
                          (build) => build.type === "windows",
                        )}
                        value="windows"
                      >
                        Windows
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </span>
            </div>
            {selectedOption !== "" &&
              (selectedOption === "webgl" ? (
                <WebGLUpload
                  cancel={cancelUpload}
                  setLoaderFile={props.setLoaderFile}
                  setDataFile={props.setDataFile}
                  setCodeFile={props.setCodeFile}
                  setFrameworkFile={props.setFrameworkFile}
                  setUploadedWebGL={props.setUploadedWebGL}
                  setUploadedFilenames={setUploadedFilenames}
                  setShowUploadGameBuild={setShowUploadGameBuild}
                  setShowUploadedBuild={setShowUploadedBuild}
                />
              ) : (
                <>
                  <div className="flex w-full flex-row items-center justify-between gap-4">
                    <Label
                      htmlFor={URL_FORM_KEY}
                      className="text-md font-medium"
                    >
                      URL
                      <span className="text-orange-primary">*</span>
                    </Label>

                    <span className="w-full">
                      <div className="flex flex-col">
                        <Input
                          className={
                            "w-full text-xs font-light" +
                            (validationErrors.link
                              ? " border-red-500 focus-visible:ring-red-500"
                              : "")
                          }
                          value={url}
                          onChange={handleUrlChange}
                          type="url"
                        />
                      </div>
                    </span>
                  </div>

                  <div className="flex w-full flex-col items-start gap-3 md:flex-row md:gap-8">
                    <Label
                      htmlFor={INSTR_FORM_KEY}
                      className="text-md min-w-14 font-medium"
                    >
                      Instructions
                    </Label>
                    <span className="w-full">
                      <TextArea
                        name={INSTR_FORM_KEY}
                        className="min-h-24 shrink text-xs font-light"
                        value={instructions}
                        onChange={handleInstructionsChange}
                      />
                    </span>
                  </div>
                  {validationErrors.link && (
                    <div className="mt-2 flex h-10 w-full items-center gap-2 rounded-sm bg-red-100 px-4 py-6 text-sm text-red-500">
                      <AlertTriangleIcon className="h-5 w-5" />
                      <p>{validationErrors.link}</p>
                    </div>
                  )}
                  <div className="flex-end mt-5 flex w-full justify-end gap-3">
                    <Button
                      variant="white"
                      className="px-4 text-lg"
                      type="button"
                      onClick={cancelUpload}
                    >
                      Cancel
                    </Button>

                    <Button
                      type="button"
                      onClick={handleSubmitNonWebGL}
                      variant="mainblue"
                      className="px-4 text-lg"
                    >
                      Done
                    </Button>
                  </div>
                </>
              ))}
          </div>
        </div>
      )}
    </>
  );
}

export default UploadGameBuild;
