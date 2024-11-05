import { Pencil, Image as ImageIcon } from "lucide-react";
import NextImage from "next/image";
import React, { useState, useEffect, ChangeEvent, Dispatch } from "react";
import { GameDataState } from "../GamePage";

interface Props {
  imageURL: string | null;
  gameData: GameDataState;
  setGameData: Dispatch<React.SetStateAction<GameDataState>>;
}

const EditImage = ({ imageURL, gameData, setGameData }: Props) => {
  const [previewURL, setPreviewURL] = useState<string | null>(imageURL);

  useEffect(() => {
    if (!gameData?.imageFile) {
      return;
    }
    setPreviewURL(URL.createObjectURL(gameData?.imageFile));

    return () => {
      if (previewURL) {
        URL.revokeObjectURL(previewURL);
      }
    };
  }, [gameData?.imageFile]);

  const updateImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files ? e.target.files[0] : undefined;
    if (image) {
      const validImage = await validateImage(image);
      if (validImage) {
        setGameData({
          ...gameData,
          imageFile: image,
        });
      }
    }
  };

  async function validateImage(image: File | null): Promise<boolean> {
    if (image) {
      if (
        image.type !== "image/png" &&
        image.type !== "image/jpg" &&
        image.type !== "image/jpeg" &&
        image.type !== "image/webp"
      ) {
        alert("Invalid Image: Only PNG, JPG, JPEG, or WEBP permitted.");
        return false;
      }

      return new Promise((resolve) => {
        const img = new Image();
        img.src = URL.createObjectURL(image);
        img.onload = () => {
          const naturalWidth = img.naturalWidth;
          const naturalHeight = img.naturalHeight;
          URL.revokeObjectURL(img.src);
          if (naturalWidth !== 630 || naturalHeight !== 500) {
            alert("Image must have dimensions 630x500 pixels.");
            resolve(false);
          } else {
            resolve(true);
          }
        };
        img.onerror = () => {
          alert("Image failed to load");
          resolve(false);
        };
      });
    }
    return true;
  }

  return (
    <>
      <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-blue-primary">
        {previewURL ? (
          <NextImage
            src={previewURL}
            alt="Edit Image Preview"
            className="h-full w-full object-cover"
            width={112}
            height={112}
          />
        ) : (
          <div className="h-28 w-28 bg-placeholder" />
        )}
        <input
          id="imagePreview"
          type="file"
          accept=".jpg,.jpeg,.png"
          onChange={updateImage}
          style={{ display: "none" }}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 ">
          <label htmlFor="imagePreview" className="cursor-pointer">
            <div className="rounded-full p-2 text-white">
              <ImageIcon size={42} />
            </div>
          </label>
        </div>
      </div>
      <div className="absolute top-20 flex items-center justify-center">
        <label htmlFor="imagePreview" className="cursor-pointer">
          <div className="rounded-full bg-blue-primary p-2 text-white">
            <Pencil size={16} />
          </div>
        </label>
      </div>
    </>
  );
};

export default EditImage;
