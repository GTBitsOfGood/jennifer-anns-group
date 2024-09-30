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
  title: string;
  field: keyof GameDataState;
  fileField: keyof GameDataState;
  gameData: GameDataState;
  setGameData: React.Dispatch<React.SetStateAction<GameDataState>>;
}

function UploadModal(props: Props) {
  const { title, setGameData, fileField, field, gameData } = props;
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
        <Button
          type="button"
          className="gap-1 border border-black bg-white font-sans text-black hover:bg-gray-100"
          onClick={() => setOpen(false)}
        >
          {fieldValue || fileFieldValue ? `Edit ${title}` : `Add ${title}`}
          {fieldValue || fileFieldValue ? (
            <Pencil size={18} />
          ) : (
            <Upload size={18} />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="border-4 border-blue-primary">
        <DialogHeader>
          <DialogTitle className="font-sans text-xl font-semibold text-blue-primary">
            Edit {title}
          </DialogTitle>
        </DialogHeader>
        <div className="flex w-full flex-row items-center gap-4">
          <label className="font-sans font-semibold">
            File<span className="text-orange-primary">*</span>
          </label>
          <div className="flex w-full flex-row items-center">
            {newFile ? (
              <div className="flex flex-row items-center gap-2">
                <p className="font-sans text-sm">{newFile.name}</p>
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
        <DialogFooter className="flex w-full flex-row ">
          <Button
            variant="ghost"
            className="w-18 h-10 font-sans text-blue-primary hover:text-blue-primary"
            onClick={() => {
              setOpen(false);
              setNewFile(fileFieldValue);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="h-10 w-20 font-sans"
            type="submit"
            onClick={() => {
              setGameData({ ...gameData, [fileField]: newFile });
              setOpen(false);
            }}
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UploadModal;
