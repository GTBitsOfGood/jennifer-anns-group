import pageAccessHOC from "@/components/HOC/PageAccess";
import { z } from "zod";
import cn from "classnames";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TextArea } from "@/components/ui/textarea";
import { AlertTriangleIcon, MoveLeft, Plus, Upload, X } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import ThemeSelect from "@/components/Themes/ThemeSelect";
import TagSelect from "@/components/Tags/TagSelect";
import { ITheme } from "@/server/db/models/ThemeModel";
import { ITag } from "@/server/db/models/TagModel";
import { ExtendId, buildSchema, gameSchema } from "@/utils/types";
import { HTTP_STATUS_CODE } from "@/utils/consts";
import { IGame } from "@/server/db/models/GameModel";
import UploadGameBuild from "@/components/GameScreen/UploadGameBuild";
import {
  youtubeREGEX,
  vimeoREGEX,
} from "@/components/GameScreen/AddEditVideoTrailerComponent";

import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useMutation } from "@tanstack/react-query";
import { uploadApplicationFile } from "@/utils/file";
import UploadPDF from "@/components/CreateGameScreen/UploadPDF";

const NAME_FORM_KEY = "name";
const TRAILER_FORM_KEY = "videoTrailer";
const DESCR_FORM_KEY = "description";
const IMAGE_FORM_KEY = "image";
const PARENTING_GUIDE_FORM_KEY = "parentingGuide";
const LESSON_PLAN_FORM_KEY = "lesson";
const ANSWER_KEY_FORM_KEY = "answerKey";
const pdfFormKeys = [
  PARENTING_GUIDE_FORM_KEY,
  LESSON_PLAN_FORM_KEY,
  ANSWER_KEY_FORM_KEY,
];

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
  const hiddenImagePreviewRef = useRef<HTMLInputElement>(null);
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

  const [imagePreviewFile, setImagePreviewFile] = useState<null | File>(null);

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({
    name: undefined,
    image: undefined,
    videoTrailer: undefined,
    description: undefined,
    builds: undefined,
  });

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

  const { mutateAsync: getDirectUpload } = useMutation({
    mutationFn: (file: File) => fetch("/api/file").then((res) => res.json()),
  });

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
          name: "Game with this title already exists.",
        }));
        return;
      } else {
        console.error("Error creating game");
        return;
      }
    } catch (error) {
      console.error("Error creating game");
      return;
    }
  }

  async function uploadPDFs(formData: FormData) {
    const nonNullPdfInputs: Record<string, File> = pdfFormKeys.reduce(
      (acc, cur) => {
        const value = formData.get(cur) as File;
        if (value.size === 0) {
          return acc;
        } else {
          return { ...acc, [cur]: value };
        }
      },
      {},
    );

    const nonNullFormKeys = Object.keys(nonNullPdfInputs);

    const directUploadUrls = await Promise.all(
      nonNullFormKeys.map((k) => getDirectUpload(nonNullPdfInputs[k])),
    );

    const fieldDirectUploadUrls: Record<
      string,
      { uploadUrl: string; uploadAuthToken: string }
    > = nonNullFormKeys.reduce((acc, cur, i) => {
      return { ...acc, [cur]: directUploadUrls[i] };
    }, {});

    const storedUrls = await Promise.all(
      nonNullFormKeys.map((formKey) =>
        uploadApplicationFile(
          fieldDirectUploadUrls[formKey].uploadUrl,
          nonNullPdfInputs[formKey],
          fieldDirectUploadUrls[formKey].uploadAuthToken,
          uuidv4(),
        ),
      ),
    );

    const fieldStoredUrls: Record<string, string> = nonNullFormKeys.reduce(
      (acc, cur, i) => {
        return { ...acc, [cur]: storedUrls[i] };
      },
      {},
    );

    return fieldStoredUrls;
  }

  function validateVideoTrailer(link: string) {
    if (link && link !== "") {
      if (!youtubeREGEX.test(link) && !vimeoREGEX.test(link)) {
        setValidationErrors((prevValidationErrors) => ({
          ...prevValidationErrors,
          videoTrailer: "Invalid URL (Only Youtube and Vimeo videos supported)",
        }));
        return false;
      }
    }
    return true;
  }

  function validateImage() {
    if (imagePreviewFile) {
      if (
        imagePreviewFile.type !== "image/png" &&
        imagePreviewFile.type !== "image/jpg" &&
        imagePreviewFile.type !== "image/jpeg"
      ) {
        setValidationErrors((prevValidationErrors) => ({
          ...prevValidationErrors,
          image: "Invalid Image: Only PNG, JPG, or JPEG permitted.",
        }));
        return false;
      }
      const img = new Image();
      img.src = URL.createObjectURL(imagePreviewFile);
      img.onload = () => {
        const naturalWidth = img.naturalWidth;
        const naturalHeight = img.naturalHeight;
        URL.revokeObjectURL(img.src);
        if (naturalWidth !== 630 || naturalHeight !== 500) {
          setValidationErrors((prevValidationErrors) => ({
            ...prevValidationErrors,
            image: "Image must have dimensions 630x500 pixels.",
          }));
          return false;
        }
      };
      img.onerror = () => {
        setValidationErrors((prevValidationErrors) => ({
          ...prevValidationErrors,
          image: "Image failed to load",
        }));
        return false;
      };
    }
    return true;
  }

  function validateBuilds() {
    if (uploadedWebGL) {
      if (
        loaderFile === null ||
        dataFile === null ||
        codeFile === null ||
        frameworkFile === null
      ) {
        setValidationErrors((prevValidationErrors) => ({
          ...prevValidationErrors,
          builds: "All files must be uploaded for the WebGL Build.",
        }));
        return false;
      }
    } else {
      if (builds.length === 0) {
        setValidationErrors((prevValidationErrors) => ({
          ...prevValidationErrors,
          builds: "Please add at least one Game Build.",
        }));
      }
    }
    return true;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);

    const PDFUrls = await uploadPDFs(formData);

    const input = {
      name: formData.get(NAME_FORM_KEY),
      videoTrailer: formData.get(TRAILER_FORM_KEY),
      description: formData.get(DESCR_FORM_KEY),
      builds: builds,
      image: imagePreviewFile ? "http://dummy-image-url.com" : "", // Temporary image
      themes: selectedThemes.map((theme) => theme._id),
      tags: [...selectedAccessibilityTags, ...selectedCustomTags].map(
        (tag) => tag._id,
      ),
      preview: true,
      ...PDFUrls,
    };
    const parse = gameSchema.safeParse(input);

    const validImage = validateImage();
    const validVideo = validateVideoTrailer(
      formData.get(TRAILER_FORM_KEY) as string,
    );
    const validBuilds = validateBuilds();

    if (!validImage || !validVideo || !validBuilds) {
      setSubmitting(false);
      return;
    }

    if (parse.success) {
      setValidationErrors({
        name: undefined,
        image: undefined,
        videoTrailer: undefined,
        description: undefined,
        builds: undefined,
      });

      try {
        const response = await createGame(parse.data);
        if (response?.ok) {
          const data = await response.json();
          if (uploadedWebGL) {
            const webGLSubmit = await handleWebGLSubmit(data._id);
            if (!webGLSubmit) return;
          }
          router.replace(`/games/${data._id}/preview`);
        } else {
          setSubmitting(false);
        }
      } catch (error) {
        setSubmitting(false);
        console.error("Error creating game:", error);
      }
    } else {
      setSubmitting(false);
      const errors = parse.error.formErrors.fieldErrors;
      setValidationErrors({
        name: errors.name?.at(0),
        image: errors.image?.at(0),
        videoTrailer: errors.videoTrailer?.at(0),
        description: errors.description?.at(0),
        builds: errors.builds?.at(0),
      });
    }
  }

  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleWebGLSubmit = async (gameId: string): Promise<boolean> => {
    if (
      loaderFile === null ||
      dataFile === null ||
      codeFile === null ||
      frameworkFile === null
    ) {
      setValidationErrors((prevValidationErrors) => ({
        ...prevValidationErrors,
        builds: "All files must be uploaded for the WebGL Build.",
      }));
      return false;
    }

    const files = new Map([
      ["loader", loaderFile],
      ["data", dataFile],
      ["code", codeFile],
      ["framework", frameworkFile],
    ]);

    try {
      await uploadBuildFiles(gameId, files);
      setSubmitting(false);
      return true;
    } catch (e) {
      console.error(e);
      setValidationErrors((prevValidationErrors) => ({
        ...prevValidationErrors,
        builds: "An internal error occurred. Please try again.",
      }));
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
        <h1 className="col-start-2 col-end-6 text-center text-6xl font-semibold">
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
            onChange={() => {
              setValidationErrors({ ...validationErrors, name: undefined });
            }}
          />
        </div>

        <div className="relative flex w-full flex-col gap-3 md:w-2/5">
          <label htmlFor={IMAGE_FORM_KEY} className="text-xl font-semibold">
            Image Preview
            <span className="text-orange-primary">*</span>
          </label>
          <div className="flex gap-6">
            <Button
              name={IMAGE_FORM_KEY}
              variant="upload"
              className={cn(
                validationErrors.image
                  ? "border-red-500 focus-visible:ring-red-500"
                  : "",
                "flex h-12 w-32 flex-row gap-3 self-start",
              )}
              type="button"
              onClick={() => {
                setValidationErrors({ ...validationErrors, image: undefined });
                if (hiddenImagePreviewRef.current !== null) {
                  hiddenImagePreviewRef.current.click();
                }
              }}
            >
              <Upload className="h-6 w-6" />
              <p>Upload</p>
            </Button>
            {imagePreviewFile ? (
              <div className="flex flex-row items-center gap-3">
                <p>{imagePreviewFile.name}</p>
                <X
                  className="cursor-pointer text-orange-primary"
                  type="button"
                  size={18}
                  onClick={() => {
                    setImagePreviewFile(null);
                  }}
                />
              </div>
            ) : null}
          </div>
          <Input
            type="file"
            ref={hiddenImagePreviewRef}
            accept=".jpg,.jpeg,.png"
            className="hidden"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              if (
                event.target.files === null ||
                event.target.files.length === 0
              )
                return;
              setImagePreviewFile(event.target.files[0]);
            }}
          ></Input>
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
            onChange={() => {
              setValidationErrors({
                ...validationErrors,
                videoTrailer: undefined,
              });
            }}
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
            onChange={() => {
              setValidationErrors({
                ...validationErrors,
                description: undefined,
              });
            }}
          />
        </div>

        <UploadPDF pdfFormKeys={pdfFormKeys} />

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
                {validationErrors.name ||
                  validationErrors.image ||
                  validationErrors.builds ||
                  validationErrors.videoTrailer ||
                  validationErrors.description}
              </p>
            </div>
          )}
          <div className="relative flex justify-end">
            <Button
              type="submit"
              variant="mainblue"
              className="px-6 py-6 text-2xl font-semibold"
              disabled={submitting}
            >
              {submitting ? "Uploading..." : "Preview"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default pageAccessHOC(CreateGame);
