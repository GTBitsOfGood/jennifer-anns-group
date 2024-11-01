import { Upload, X } from "lucide-react";
import React, { useRef, useState } from "react";
import cn from "classnames";

interface Props {
  imageFormKey: string;
  validationErrors: Record<string, string | undefined>;
  setValidationErrors: React.Dispatch<
    React.SetStateAction<Record<string, string | undefined>>
  >;
}

const UploadImage = ({
  imageFormKey,
  validationErrors,
  setValidationErrors,
}: Props) => {
  const imagePreviewRef = useRef<HTMLInputElement>(null);
  const [imagePreviewFile, setImagePreviewFile] = useState<File | null>(null);
  return (
    <div className="relative flex w-full flex-col gap-3 md:w-2/3">
      <label className="text-xl font-semibold">
        Image Preview
        <span className="text-orange-primary">*</span>
      </label>
      <div className="flex w-fit flex-row items-center justify-start gap-2">
        <label htmlFor={imageFormKey}>
          <div
            className={cn(
              validationErrors.image
                ? "border-red-500 focus-visible:ring-red-500"
                : "",
              "flex h-12 w-32 flex-row items-center justify-center gap-3 rounded-md border border-[#666666] bg-[#FAFBFC] text-slate-900 hover:opacity-80",
            )}
          >
            <div>
              <Upload size={24} />
            </div>
            <p className="text-sm">Upload</p>
          </div>
        </label>
        <input
          ref={imagePreviewRef}
          className="block w-fit text-sm file:hidden"
          id={imageFormKey}
          name={imageFormKey}
          type="file"
          accept=".jpg,.jpeg,.png"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.files === null || event.target.files.length === 0)
              return;
            setValidationErrors({
              ...validationErrors,
              image: undefined,
            });
            setImagePreviewFile(event.target.files[0]);
          }}
        />
        <X
          className={
            imagePreviewFile
              ? "block text-orange-primary hover:cursor-pointer"
              : "hidden"
          }
          onClick={() => {
            if (!imagePreviewRef.current) return;
            imagePreviewRef.current.value = "";
            setImagePreviewFile(null);
          }}
        />
      </div>
    </div>
  );
};

export default UploadImage;
