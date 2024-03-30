import React, { useState } from "react";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  useDisclosure,
  ChakraProvider,
} from "@chakra-ui/react";
import chakraTheme from "@/styles/chakraTheme";
import { useRouter } from "next/router";
import { useRef } from "react";
import axios from "axios";

interface Props {
  setAddOrEdit: React.Dispatch<React.SetStateAction<"Add" | "Edit">>;
}

function DeleteWebGLBuild(props: Props) {
  const router = useRouter();
  const gameId = router.query.id;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement | null>(null);

  const [deleting, setDeleting] = useState<boolean>(false);

  async function deleteGame() {
    setDeleting(true);
    await axios.delete(`/api/games/${gameId}/builds`);
    props.setAddOrEdit("Add");
    setDeleting(false);
    onClose();
  }

  return (
    <div className="my-4">
      <ChakraProvider theme={chakraTheme}>
        <div>
          <Button
            type="button"
            onClick={onOpen}
            className="rounded-xl border border-delete-red bg-white px-4 py-2 font-sans text-lg text-xl font-semibold text-delete-red hover:bg-delete-red hover:text-white"
          >
            <div className="flex items-center gap-2">
              <p>Delete WebGL Build</p>
              <X />
            </div>
          </Button>
          <AlertDialog
            motionPreset="slideInBottom"
            leastDestructiveRef={cancelRef}
            onClose={onClose}
            isOpen={isOpen}
            isCentered
          >
            <AlertDialogOverlay />

            <AlertDialogContent
              border="4px"
              borderColor="brand.600"
              height="350"
              width="450"
            >
              <div>
                <AlertDialogCloseButton
                  disabled={deleting}
                  mr="12px"
                  mt="12px"
                  color="brand.600"
                />
              </div>
              <AlertDialogHeader p="0">
                <div className="mx-auto flex w-4/5 flex-col items-center">
                  <div className="mt-16 text-center font-sans text-[26px] font-bold leading-tight text-blue-primary">
                    Are you sure you want to delete the WebGL Build?
                  </div>
                  <div className="mb-6 mt-6 text-center font-sans text-base font-normal">
                    Deleting a WebGL Build is final and cannot be undone.
                  </div>
                </div>
              </AlertDialogHeader>

              <AlertDialogFooter p="0" justifyContent="center">
                <div className="mt-4 flex flex-row items-center gap-4">
                  <button
                    onClick={deleteGame}
                    className="rounded-xl bg-delete-red px-6 py-3 font-sans font-semibold text-white"
                    disabled={deleting}
                  >
                    Yes, delete build
                  </button>
                  <button
                    ref={cancelRef}
                    onClick={onClose}
                    disabled={deleting}
                    className="rounded-xl border-[1px] border-solid border-black px-6 py-3 font-sans font-semibold"
                  >
                    No, return
                  </button>
                </div>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </ChakraProvider>
    </div>
  );
}

export default DeleteWebGLBuild;
