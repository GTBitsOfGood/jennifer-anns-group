import axios from "axios";

const CLOUDFLARE_URL = process.env.CLOUDFLARE_URL;

// there's probably a better place to put these
type BuildFileType = "data" | "framework" | "loader" | "code";
const buildFileTypes = Object.freeze({
  data: "build.data",
  framework: "build.framework.js",
  loader: "build.loader.js",
  code: "build.wasm",
});

export async function uploadBuildFiles(
  gameId: string,
  files: Map<string, File>
) {
  if (files.size !== 4) {
    throw new Error("Invalid build files");
  }

  for (const type of Object.keys(buildFileTypes)) {
    if (!files.has(type)) {
      throw new Error(`Missing file: ${type}`);
    }
  }

  // atomic uploads? retry on error?
  try {
    await Promise.all(
      Array.from(files.entries()).map(async ([type, file]) => {
        const { data } = await axios.post(`/api/games/${gameId}/builds`, {
          gameId,
        });
        const uploadUrl = data.data.uploadUrl;
        const uploadAuthToken = data.data.uploadAuthToken;

        const fileName = `${gameId}/${
          buildFileTypes[type as keyof typeof buildFileTypes]
        }`;

        await axios.post(uploadUrl, file, {
          headers: {
            Authorization: uploadAuthToken,
            "X-Bz-File-Name": fileName,
            "Content-Type": file.type,
            "Content-Length": file.size.toString(),
            "X-Bz-Content-Sha1": "do_not_verify",
          },
        });
      })
    );
  } catch (error) {
    console.error("Failed to upload files:", error);
    throw error;
  }

  await axios.put(`/api/games/${gameId}`, {
    webGLBuild: true,
  });
}

export function getBuildFileUrl(gameId: string, type: BuildFileType) {
  const fileName = `${gameId}/${
    buildFileTypes[type as keyof typeof buildFileTypes]
  }`;

  return `${CLOUDFLARE_URL}/${fileName}`;
}
