import { env } from "process";
import connectB2 from "@/server/db/b2";
import { CLOUDFLARE_URL } from "./consts";

export enum BucketType {
  ApplicationFiles,
  WebGLBuilds,
}

export const bucketTypeIdMap: Record<BucketType, string> = {
  [BucketType.ApplicationFiles]: env.B2_BUCKET_ID_APPLICATION,
  [BucketType.WebGLBuilds]: env.B2_BUCKET_ID_BUILD,
};

export async function getDirectUploadUrl(bucket: BucketType) {
  const b2 = await connectB2();

  const bucketId = bucketTypeIdMap[bucket];
  const response = await b2.getUploadUrl({ bucketId });
  const uploadUrl = response.data.uploadUrl;
  const uploadAuthToken = response.data.authorizationToken;

  return { uploadUrl, uploadAuthToken };
}

/**
 * Uploads file to storage bucket via direct upload URL.
 *
 * @param url direct upload URL to bucket
 * @param file raw file
 * @param authToken auth token to verify signed direct upload URL
 * @param fileName file name including `/` delimiters for storage bucket
 * @returns
 */
export const uploadApplicationFile = async (
  url: string,
  file: File,
  authToken: string,
  fileName: string,
) => {
  let count = 0;
  const maxTries = 3;
  while (true) {
    const uploadResp = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: authToken,
        "X-Bz-File-Name": encodeURIComponent(fileName),
        "Content-Type": file.type,
        "X-Bz-Content-Sha1": "do_not_verify",
      },
      body: await file.arrayBuffer(),
    });

    if (uploadResp.status === 200) {
      const data = await uploadResp.json();
      return `${CLOUDFLARE_URL}/application-files/${fileName}`;
    }

    if (++count === maxTries) {
      console.error(await uploadResp.json());
      throw new Error("Error uploading file");
    }
  }
};
