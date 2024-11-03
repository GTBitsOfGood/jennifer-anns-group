import { Pencil, Upload, X } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useEffect, useRef, useState } from "react";
import { GameDataState } from "../GameScreen/GamePage";

interface Props {
  field: keyof GameDataState;
  fileField: keyof GameDataState;
  gameData: GameDataState;
  setGameData: React.Dispatch<React.SetStateAction<GameDataState>>;
}

function UploadModal(props: Props) {
  const { setGameData, fileField, field, gameData } = props;
  const fileRef = useRef(null);
  const [open, setOpen] = useState(false);

  const fieldValue = gameData[field] as string;
  const fileFieldValue = gameData[fileField] as File | undefined;

  const [newFile, setNewFile] = useState<File | undefined>(fileFieldValue);

  useEffect(() => {
    setNewFile(fileFieldValue);
  }, [fileFieldValue]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="flex items-center gap-1 rounded-md border border-font-1000 bg-white px-4 py-3 font-sans text-lg font-medium text-font-1000 hover:bg-gray-100"
          onClick={() => setOpen(false)}
        >
          {fieldValue || fileFieldValue ? `Replace PDF` : `Add PDF`}
          <Upload size={18} />
        </button>
      </DialogTrigger>
      <DialogContent className="gap-6 border-4 border-blue-primary p-12">
        <DialogHeader>
          <DialogTitle className="font-sans text-xl font-semibold text-blue-primary">
            {fieldValue || fileFieldValue ? `Replace PDF` : `Add PDF`}
          </DialogTitle>
        </DialogHeader>
        <div className="flex w-full flex-row items-center gap-4">
          <label className="font-sans font-semibold">
            File<span className="text-orange-primary">*</span>
          </label>
          <div className="flex w-full flex-row items-center">
            {newFile ? (
              <div className="flex flex-row items-center gap-2">
                <p className="font-sans">{newFile.name}</p>
                <X
                  className="text-orange-primary hover:cursor-pointer"
                  size={18}
                  onClick={() => {
                    setNewFile(undefined);
                  }}
                />
              </div>
            ) : (
              <div className="bg-red flex w-full">
                <label
                  htmlFor="file"
                  className="w-full cursor-pointer rounded-md border border-black bg-[#D9D9D9] p-1 text-center font-sans font-medium"
                >
                  Choose File
                </label>
                <input
                  id="file"
                  ref={fileRef}
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  onChange={(e) => {
                    const files = e.currentTarget.files;
                    if (!files) return;
                    setNewFile(files[0]);
                  }}
                />
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="flex w-full flex-row gap-4">
          <button
            className="w-full rounded-md border border-border px-4 py-3 font-sans text-xl font-medium hover:border-gray-tab hover:bg-gray-tab"
            onClick={() => {
              setOpen(false);
              setNewFile(fileFieldValue);
            }}
          >
            Cancel
          </button>
          <button
            className="w-full rounded-md bg-blue-primary px-4 py-3 font-sans text-xl font-medium text-white hover:bg-blue-hover"
            type="submit"
            onClick={() => {
              setGameData({ ...gameData, [fileField]: newFile });
              setOpen(false);
            }}
          >
            Done
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UploadModal;
