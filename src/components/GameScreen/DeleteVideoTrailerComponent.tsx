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
  Flex,
} from "@chakra-ui/react";
import chakraTheme from "@/styles/chakraTheme";
import { useRouter } from "next/router";
import { useRef } from "react";
import { populatedGameWithId } from "@/server/db/models/GameModel";

interface Props {
  gameData: populatedGameWithId;
}

export default function DeleteVideoTrailer({ gameData }: Props) {
  const router = useRouter();
  const gameID = router.query.id;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement | null>(null);

  async function deleteVideoTrailer() {
    //The themes is populated and cant be send to the endpoint
    //TODO: How do I delete a field with the API endpoint?
    gameData.videoTrailer = undefined;
    const { themes, ...gameDatawithoutTheme } = gameData;
    console.log("GameData", gameData);
    const response = await fetch(`/api/games/${gameID}`, {
      method: "PUT",
      body: JSON.stringify(gameDatawithoutTheme),
    });
    console.log("RESPONSE", response);
    router.push(`/games/${gameID}`);
  }

  return (
    <ChakraProvider theme={chakraTheme}>
      <div>
        <button
          onClick={onOpen}
          className="mt-5 rounded-md border border-delete-red bg-white px-[17px] py-2 font-sans text-xl font-semibold text-delete-red"
        >
          Delete Trailer
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
                Are you sure you want to delete this trailer?
              </div>
            </AlertDialogHeader>
            <AlertDialogBody p="0" mt="50px">
              <div className="text-center font-sans text-base font-normal">
                Deleting a trailer is final and cannot be undone.
              </div>
            </AlertDialogBody>
            <AlertDialogFooter p="0" justifyContent="center">
              <button
                onClick={deleteVideoTrailer}
                className="mb-24 mr-[22px] h-[47px] w-[198px] rounded-[10px] bg-delete-red font-sans font-semibold text-white"
              >
                Yes, delete trailer
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
    </ChakraProvider>
  );
}

//TODO: Clean up imports and remove console logs. Only do this at the end.
