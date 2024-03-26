import { useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { AlertTriangle, AlertTriangleIcon, X } from "lucide-react";

// there's probably a better place to put these
export type BuildFileType = "data" | "framework" | "loader" | "code";
export const buildFileTypes = Object.freeze({
  data: "build.data",
  framework: "build.framework.js",
  loader: "build.loader.js",
  code: "build.wasm",
});

interface Props {
  cancel: () => void;
  setLoaderFile: React.Dispatch<React.SetStateAction<null | File>>;
  setDataFile: React.Dispatch<React.SetStateAction<null | File>>;
  setCodeFile: React.Dispatch<React.SetStateAction<null | File>>;
  setFrameworkFile: React.Dispatch<React.SetStateAction<null | File>>;
  setUploadedWebGL: React.Dispatch<React.SetStateAction<boolean>>;
  setUploadedFilenames: React.Dispatch<React.SetStateAction<string[]>>;
  setShowUploadGameBuild: React.Dispatch<React.SetStateAction<boolean>>;
  setShowUploadedBuild: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function WebGLUpload({
  cancel,
  setLoaderFile,
  setDataFile,
  setCodeFile,
  setFrameworkFile,
  setUploadedWebGL,
  setUploadedFilenames,
  setShowUploadGameBuild,
  setShowUploadedBuild,
}: Props) {
  const [loaderName, setLoaderName] = useState<null | string>(null);
  const [dataName, setDataName] = useState<null | string>(null);
  const [codeName, setCodeName] = useState<null | string>(null);
  const [frameworkName, setFrameworkName] = useState<null | string>(null);

  const [fileValidationError, setFileValidationError] =
    useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null || event.target.files.length === 0) return;
    const file = event.target.files[0];
    const name = event.target.name;

    switch (name) {
      case "loader":
        setLoaderFile(file);
        setLoaderName(file.name);
        break;
      case "data":
        setDataFile(file);
        setDataName(file.name);
        break;
      case "code":
        setCodeFile(file);
        setCodeName(file.name);

        break;
      case "framework":
        setFrameworkFile(file);
        setFrameworkName(file.name);

        break;
      default:
        break;
    }
  };

  const handleSubmit = async () => {
    if (
      loaderName === null ||
      dataName === null ||
      codeName === null ||
      frameworkName === null
    ) {
      setFileValidationError(true);
      return;
    }
    setFileValidationError(false);
    setUploadedWebGL(true);
    setUploadedFilenames([loaderName, dataName, codeName, frameworkName]);
    setShowUploadGameBuild(false);
    setShowUploadedBuild(true);
  };

  const cancelSubmit = () => {
    setLoaderFile(null);
    setLoaderName(null);

    setDataFile(null);
    setDataName(null);

    setCodeFile(null);
    setCodeName(null);

    setFrameworkFile(null);
    setFrameworkName(null);

    setUploadedWebGL(false);

    cancel();
  };

  const handleFileDelete = (
    e: React.MouseEvent<SVGSVGElement>,
    setFileState: React.Dispatch<React.SetStateAction<File | null>>,
    setFileName: React.Dispatch<React.SetStateAction<string | null>>,
  ) => {
    e.preventDefault();
    setFileState(null);
    setFileName(null);
  };

  return (
    <>
      <div className="mt-2 flex w-full flex-col gap-4">
        <div className="flex w-full flex-row items-center justify-between gap-3">
          <h1 className="text-md font-medium">
            Loader<span className="text-orange-primary">*</span>
          </h1>

          <span className="w-4/5">
            {loaderName ? (
              <Label className="inline-block w-full py-2 text-center">
                <div className="flex flex-row items-center gap-2">
                  <span className="">{loaderName}</span>
                  <X
                    className="cursor-pointer text-orange-primary"
                    onClick={(e) =>
                      handleFileDelete(e, setLoaderFile, setLoaderName)
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

          <span className="w-4/5">
            {dataName ? (
              <Label className="inline-block w-full py-2 text-center">
                <div className="flex flex-row items-center gap-2">
                  <span className="">{dataName}</span>
                  <X
                    className="cursor-pointer text-orange-primary"
                    onClick={(e) =>
                      handleFileDelete(e, setDataFile, setDataName)
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
            {codeName ? (
              <Label className="inline-block w-full py-2 text-center">
                <div className="flex flex-row items-center gap-2">
                  <span className="">{codeName}</span>
                  <X
                    className="cursor-pointer text-orange-primary"
                    onClick={(e) =>
                      handleFileDelete(e, setCodeFile, setCodeName)
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
            {frameworkName ? (
              <Label className="inline-block w-full py-2 text-center">
                <div className="flex flex-row items-center gap-2">
                  <span className="">{frameworkName}</span>
                  <X
                    className="cursor-pointer text-orange-primary"
                    onClick={(e) =>
                      handleFileDelete(e, setFrameworkFile, setFrameworkName)
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
                  name="framework"
                  onChange={handleFileChange}
                />
              </Label>
            )}
          </span>
        </div>
        {fileValidationError && (
          <div className="mt-2 flex h-14 w-full items-center gap-2 rounded-sm bg-red-100 px-4 py-6 text-sm text-red-500">
            <AlertTriangleIcon className="h-5 w-5" />
            <p className="">All files must be uploaded!</p>
          </div>
        )}

        <div className="flex-end mt-5 flex w-full justify-end gap-3">
          <Button
            variant="white"
            className="px-4 text-lg"
            type="button"
            onClick={cancelSubmit}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            variant="mainblue"
            className="px-4 text-lg"
          >
            Done
          </Button>
        </div>
      </div>
    </>
  );
}
