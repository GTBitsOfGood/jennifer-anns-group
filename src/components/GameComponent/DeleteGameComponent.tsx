import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useRef } from "react";

interface Props {
  gameName: string;
}

export default function DeleteGameDialog({ gameName }: Props) {
  const router = useRouter();
  const gameID = router.query.id;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement | null>(null);

  async function deleteGame() {
    fetch(`/api/games/${gameID}`, {
      method: "DELETE",
    });
    router.push("/games");
  }

  return (
    <div>
      <button
        onClick={onOpen}
        className="mt-1 rounded-md bg-delete-red px-[17px] py-2 font-sans text-xl font-semibold text-white"
      >
        Delete Page
      </button>
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
          height="444"
          maxWidth="585"
        >
          <div>
            <AlertDialogCloseButton mr="50px" mt="50px" color="brand.600" />
          </div>
          <AlertDialogHeader p="0">
            <div className="mx-[110px] mt-[100px] text-center text-[26px] font-bold leading-tight text-blue-primary">
              Are you sure you want to delete {gameName}?
            </div>
          </AlertDialogHeader>
          <AlertDialogBody p="0" mt="50px">
            <div className="text-center font-sans text-base font-normal">
              Deleting a game page is final and cannot be undone.
            </div>
          </AlertDialogBody>
          <AlertDialogFooter p="0" justifyContent="center">
            <button
              onClick={deleteGame}
              className="mb-24 mr-[22px] h-[47px] w-[198px] rounded-[10px] bg-delete-red font-sans font-semibold text-white"
            >
              Yes, delete page
            </button>
            <button
              ref={cancelRef}
              onClick={onClose}
              className="mb-24 ml-[22px] h-[47px] w-[198px] rounded-[10px] border-[1px] border-solid border-black font-sans font-semibold"
            >
              No, return
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
