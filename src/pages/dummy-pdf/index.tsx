//TODO: Remove
import UploadPDF from "@/components/UploadPDF";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { IGame } from "@/server/db/models/GameModel";
import { CLOUDFLARE_URL } from "@/utils/consts";
import { ExtendId } from "@/utils/types";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/router";

const FORM_LESSON_PLAN_FILE_KEY = "lessonPlan";

async function handleFileUpload(file: File): Promise<{
  uploadUrl: string;
  uploadAuthToken: string;
}> {
  const directUploadRes = await fetch("/api/file");
  return await directUploadRes.json();
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
const uploadFile = async (
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
      return;
    }

    if (++count === maxTries) {
      console.error(await uploadResp.json());
      throw new Error("Error uploading file");
    }
  }
};

function DummyPDFPage() {
  const { toast } = useToast();
  const router = useRouter();
  // Mocks sample logic for uploading lesson plans (extend to parenting guide/answer key)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const newPostRes = await fetch("/api/games", {
        method: "POST",
        body: JSON.stringify({
          name: `Test game ${uuidv4()}`,
          description: "Description for test game",
        }),
      });

      const newPost = (await newPostRes.json()) as ExtendId<IGame>;

      const { _id } = newPost;

      const formData = new FormData(e.target as HTMLFormElement);
      const file = formData.get(FORM_LESSON_PLAN_FILE_KEY) as File | null;
      if (!file) {
        // Handle error in real `handleSubmit` for game forms
        return;
      }

      const fileName = `${_id}/${uuidv4()}_${file.name}`;

      const directUploadUrl = await handleFileUpload(file);

      await uploadFile(
        directUploadUrl.uploadUrl,
        file,
        directUploadUrl.uploadAuthToken,
        fileName,
      );

      const absoluteFileName = `${CLOUDFLARE_URL}/application-files/${fileName}`;

      await fetch(`/api/games/${_id}`, {
        method: "PUT",
        body: JSON.stringify({
          lesson: absoluteFileName,
        }),
      });

      toast({
        title: "Sample game created",
        description: _id,
        action: (
          <ToastAction
            altText="View page"
            onClick={() => router.push(`/dummy-pdf/${_id}`)}
          >
            View page
          </ToastAction>
        ),
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-fit flex-col">
      <Label
        htmlFor={FORM_LESSON_PLAN_FILE_KEY}
        className="text-2xl font-normal"
      >
        Upload lesson plan
      </Label>
      <UploadPDF formNameKey={FORM_LESSON_PLAN_FILE_KEY} />
      <Button type="submit">Submit</Button>
    </form>
  );
}

export default DummyPDFPage;
