import { env } from "process";
import connectB2 from "@/server/db/b2";

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
