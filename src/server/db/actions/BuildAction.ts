import connectB2 from "../b2";

export async function deleteBuild(id: string) {
  const b2 = await connectB2();

  const bucketId = process.env.B2_BUCKET_ID;
  const response = await b2.listFileNames({
    bucketId,
    prefix: id + "/",
    delimiter: "",
    startFileName: "",
    maxFileCount: 1000,
  });

  const deletePromises = response.data.files.map(
    async (file: { fileId: string; fileName: string }) =>
      b2.deleteFileVersion({
        fileId: file.fileId,
        fileName: file.fileName,
      }),
  );
  await Promise.all(deletePromises);
  return response.data.files;
}

export async function getBuildUploadUrl() {
  const b2 = await connectB2();

  const bucketId = process.env.B2_BUCKET_ID;
  const response = await b2.getUploadUrl({ bucketId });
  const uploadUrl = response.data.uploadUrl;
  const uploadAuthToken = response.data.authorizationToken;

  return { uploadUrl, uploadAuthToken };
}
