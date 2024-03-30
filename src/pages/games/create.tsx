import React from "react";
import pageAccessHOC from "@/components/HOC/PageAccess";
import { z } from "zod";
import cn from "classnames";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TextArea } from "@/components/ui/textarea";
import { AlertTriangleIcon, MoveLeft, Plus } from "lucide-react";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ThemeSelect from "@/components/Themes/ThemeSelect";
import TagSelect from "@/components/Tags/TagSelect";
import { ITheme } from "@/server/db/models/ThemeModel";
import { ITag } from "@/server/db/models/TagModel";
import { ExtendId, buildSchema, gameSchema } from "@/utils/types";
import { HTTP_STATUS_CODE } from "@/utils/consts";
import { IGame } from "@/server/db/models/GameModel";
import UploadGameBuild from "@/components/UploadGameBuild";

import axios from "axios";

const NAME_FORM_KEY = "name";
const TRAILER_FORM_KEY = "videoTrailer";
const DESCR_FORM_KEY = "description";

export const createGameSchema = z.object({
  name: z.string().min(3, "Title must be at least 3 characters"),
  videoTrailer: z.string().url("Not a valid URL").or(z.literal("")),
  description: z.string().min(1, "Description is required"),
});

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

function CreateGame() {
  const router = useRouter();

  const [themes, setThemes] = useState<ExtendId<ITheme>[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<ExtendId<ITheme>[]>([]);

  const [uploadedWebGL, setUploadedWebGL] = useState(false);

  const [accessibilityTags, setAccessibilityTags] = useState<ExtendId<ITag>[]>(
    [],
  );
  const [selectedAccessibilityTags, setSelectedAccessibilityTags] = useState<
    ExtendId<ITag>[]
  >([]);

  const [customTags, setCustomTags] = useState<ExtendId<ITag>[]>([]);
  const [selectedCustomTags, setSelectedCustomTags] = useState<
    ExtendId<ITag>[]
  >([]);

  const [builds, setBuilds] = useState<z.infer<typeof buildSchema>[]>([]);

  const [loaderFile, setLoaderFile] = useState<null | File>(null);
  const [dataFile, setDataFile] = useState<null | File>(null);
  const [codeFile, setCodeFile] = useState<null | File>(null);
  const [frameworkFile, setFrameworkFile] = useState<null | File>(null);

  const [fileValidationError, setFileValidationError] = useState<
    string | undefined
  >(undefined);

  const [uploadGameComponents, setUploadGameComponents] = useState<
    React.JSX.Element[]
  >([
    <UploadGameBuild
      key={0}
      uploadedWebGL={uploadedWebGL}
      setUploadedWebGL={setUploadedWebGL}
      builds={builds}
      setBuilds={setBuilds}
      loaderFile={loaderFile}
      setLoaderFile={setLoaderFile}
      dataFile={dataFile}
      setDataFile={setDataFile}
      codeFile={codeFile}
      setCodeFile={setCodeFile}
      frameworkFile={frameworkFile}
      setFrameworkFile={setFrameworkFile}
    />,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [themesRes, tagsRes] = await Promise.all([
          fetch("/api/themes/", { method: "GET" }),
          fetch("/api/tags/", { method: "GET" }),
        ]);

        const [themesData, tagsData] = await Promise.all([
          themesRes.json(),
          tagsRes.json(),
        ]);

        setThemes(themesData);
        setAccessibilityTags(tagsData.accessibility);
        setCustomTags(tagsData.custom);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const [validationErrors, setValidationErrors] = useState<
    Record<keyof z.input<typeof createGameSchema>, string | undefined>
  >({
    name: undefined,
    videoTrailer: undefined,
    description: undefined,
  });

  async function createGame(data: IGame) {
    try {
      const response = await fetch(`/api/games`, {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (response.status === HTTP_STATUS_CODE.CREATED) {
        return response;
      } else if (response.status === HTTP_STATUS_CODE.BAD_REQUEST) {
        setValidationErrors((prevValidationErrors) => ({
          ...prevValidationErrors,
          name: "Game with this title already exists",
        }));
      } else {
        console.error("Error creating game");
        return;
      }
    } catch (error) {
      console.error("Error creating game");
      return;
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (uploadedWebGL) {
      if (
        loaderFile === null ||
        dataFile === null ||
        codeFile === null ||
        frameworkFile === null
      ) {
        setFileValidationError(
          "All files must be uploaded for the WebGL Build!",
        );
      } else {
        setFileValidationError(undefined);
      }
    }

    const formData = new FormData(e.currentTarget);
    const input = {
      name: formData.get(NAME_FORM_KEY),
      videoTrailer: formData.get(TRAILER_FORM_KEY),
      description: formData.get(DESCR_FORM_KEY),
      builds: builds,
      themes: selectedThemes.map((theme) => theme._id),
      tags: [...selectedAccessibilityTags, ...selectedCustomTags].map(
        (tag) => tag._id,
      ),
    };
    const parse = gameSchema.safeParse(input);

    if (parse.success) {
      setValidationErrors({
        name: undefined,
        videoTrailer: undefined,
        description: undefined,
      });
      if (fileValidationError !== undefined) return;
      if (
        (!parse.data.builds || parse.data?.builds.length == 0) &&
        !uploadedWebGL
      ) {
        alert("Please add at least one Game Build.");
        return;
      }

      try {
        const response = await createGame(parse.data);
        if (response) {
          if (uploadedWebGL) {
            const data = await response.json();
            const webGLSubmit = await handleWebGLSubmit(data._id);
            if (!webGLSubmit) return;
          }
        }
        router.replace("/games");
      } catch (error) {
        console.error("Error creating game:", error);
      }
    } else {
      const errors = parse.error.formErrors.fieldErrors;
      setValidationErrors({
        name: errors.name?.at(0),
        videoTrailer: errors.videoTrailer?.at(0),
        description: errors.description?.at(0),
      });
    }
  }

  const addUploadComponent = () => {
    setUploadGameComponents((prevComponents) => [
      ...prevComponents,
      <UploadGameBuild
        key={prevComponents.length}
        builds={builds}
        uploadedWebGL={uploadedWebGL}
        setUploadedWebGL={setUploadedWebGL}
        setBuilds={setBuilds}
        loaderFile={loaderFile}
        setLoaderFile={setLoaderFile}
        dataFile={dataFile}
        setDataFile={setDataFile}
        codeFile={codeFile}
        setCodeFile={setCodeFile}
        frameworkFile={frameworkFile}
        setFrameworkFile={setFrameworkFile}
      />,
    ]);
  };

  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleWebGLSubmit = async (gameId: string): Promise<boolean> => {
    if (
      loaderFile === null ||
      dataFile === null ||
      codeFile === null ||
      frameworkFile === null
    ) {
      setFileValidationError("All files must be uploaded for the WebGL Build!");
      return false;
    }
    setFileValidationError(undefined);

    const files = new Map([
      ["loader", loaderFile],
      ["data", dataFile],
      ["code", codeFile],
      ["framework", frameworkFile],
    ]);

    try {
      setSubmitting(true);
      await uploadBuildFiles(gameId, files);
      setSubmitting(false);

      alert("Files uploaded successfully");
      return true;
    } catch (e) {
      console.error(e);
      setFileValidationError("An internal error occurred. Please try again.");
      return false;
    }
  };

  return (
    <div className="m-12 md:mx-24">
      <div className="mb-16 grid grid-cols-6 items-center">
        <div className="col-span-1 rounded-sm opacity-100 ring-offset-white transition-opacity hover:cursor-pointer focus:outline-none focus:ring-2">
          <MoveLeft
            onClick={() => {
              router.replace("/games");
            }}
            className="h-12 w-12 text-blue-primary"
          />
        </div>
        <h1 className="col-start-2 col-end-6 text-center text-5xl font-semibold">
          Create a Game
        </h1>
      </div>
      <form className="flex w-full flex-col gap-12" onSubmit={handleSubmit}>
        <div className="relative flex w-full flex-col gap-3 md:w-2/5">
          <label htmlFor={NAME_FORM_KEY} className="text-xl font-semibold">
            Title
            <span className="text-orange-primary">*</span>
          </label>
          <Input
            name={NAME_FORM_KEY}
            className={cn(
              validationErrors.name
                ? "border-red-500 focus-visible:ring-red-500"
                : "border-input-border focus:border-blue-primary",
              "h-12",
            )}
            disabled={submitting}
          />
        </div>

        <div className="relative flex w-full flex-col gap-3 md:w-2/3">
          <label className="text-xl font-semibold">
            Game Build
            <span className="text-orange-primary">*</span>
          </label>

          {uploadGameComponents.map(
            (component: React.JSX.Element, key: number) => (
              <div key={key}>{component}</div>
            ),
          )}
          <div
            className={
              "flex cursor-pointer flex-row items-center gap-2 p-2 text-blue-primary" +
              (uploadGameComponents.length >= 7
                ? "absolute hidden opacity-0"
                : "")
            }
            onClick={addUploadComponent}
          >
            <Plus />
            <p>Add Another Build</p>
          </div>
        </div>

        <div className="relative flex w-full flex-col gap-3 md:w-2/3">
          <label htmlFor={TRAILER_FORM_KEY} className="text-xl font-semibold">
            Video Trailer Link
          </label>
          <Input
            name={TRAILER_FORM_KEY}
            placeholder="https://www.example.com"
            disabled={submitting}
            className={cn(
              validationErrors.videoTrailer
                ? "border-red-500 focus-visible:ring-red-500"
                : "border-input-border focus:border-blue-primary",
              "h-12",
            )}
          />
        </div>

        <div className="relative flex w-full flex-col gap-3 md:w-2/3">
          <label htmlFor={DESCR_FORM_KEY} className="text-xl font-semibold">
            Description
            <span className="text-orange-primary">*</span>
          </label>
          <TextArea
            name={DESCR_FORM_KEY}
            disabled={submitting}
            className={
              validationErrors.description
                ? "border-red-500 focus-visible:ring-red-500"
                : "border-input-border focus:border-blue-primary"
            }
          />
        </div>

        <div className="relative flex w-full flex-col gap-3">
          <label className="text-xl font-semibold">Theme(s)</label>
          <ThemeSelect
            themes={themes}
            selected={selectedThemes}
            setSelected={setSelectedThemes}
          />
        </div>

        <div className="relative flex w-full flex-col gap-3">
          <label className="text-xl font-semibold">Accessibility</label>
          <TagSelect
            tags={accessibilityTags}
            type="accessibility"
            selected={selectedAccessibilityTags}
            setSelected={setSelectedAccessibilityTags}
          />
        </div>

        <div className="relative flex w-full flex-col gap-3">
          <label className="text-xl font-semibold">Tag(s)</label>
          <TagSelect
            tags={customTags}
            type="custom"
            selected={selectedCustomTags}
            setSelected={setSelectedCustomTags}
          />
        </div>

        <div className="flex w-full flex-col gap-3">
          {Object.values(validationErrors).some(
            (value) => value !== undefined,
          ) && (
            <div className="flex h-14 w-full items-center gap-2 rounded-sm bg-red-100 px-4 py-6 text-sm text-red-500">
              <AlertTriangleIcon className="h-5 w-5" />
              <p>
                {!validationErrors.videoTrailer
                  ? "All required fields need to be filled."
                  : "Please enter a valid URL for the Video Trailer."}
              </p>
            </div>
          )}
          {fileValidationError && (
            <div className="flex h-14 w-full items-center gap-2 rounded-sm bg-red-100 px-4 py-6 text-sm text-red-500">
              <AlertTriangleIcon className="h-5 w-5" />
              <p>{fileValidationError}</p>
            </div>
          )}
          <div className="relative flex justify-end">
            <Button
              type="submit"
              variant="mainblue"
              className="px-6 py-6 text-2xl font-semibold"
              disabled={submitting}
            >
              {submitting ? "Uploading..." : "Publish"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default pageAccessHOC(CreateGame);
