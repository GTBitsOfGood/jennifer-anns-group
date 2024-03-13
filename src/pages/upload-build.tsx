import { CLOUDFLARE_URL } from "@/utils/consts";
import axios from "axios";
import { useState } from "react";
// commenting for draft pr
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

export default function BuildUpload() {
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

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h1 className="font-bold">Upload Build</h1>
        <h1>Game ID</h1>
        <input
          type="text"
          name="gameId"
          className="border-2 border-black"
          onChange={(e) => {
            setGameId(e.target.value);
          }}
        />
        <h1>Loader</h1>
        <input type="file" name="loader" onChange={handleFileChange} />
        <h1>Data</h1>
        <input type="file" name="data" onChange={handleFileChange} />
        <h1>Code</h1>
        <input type="file" name="code" onChange={handleFileChange} />
        <h1>Framework</h1>
        <input type="file" name="framework" onChange={handleFileChange} />
        <button type="submit" className="block cursor-pointer font-bold">
          submit
        </button>
      </form>
    </>
  );
}
