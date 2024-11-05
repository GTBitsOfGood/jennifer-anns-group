import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  ChakraProvider,
} from "@chakra-ui/react";
import chakraTheme from "@/styles/chakraTheme";
import { useRouter } from "next/compat/router";
import { useRef, Dispatch } from "react";
import { GameDataState } from "./GameScreen/GamePage";

interface Props {
  deleteType: string;
  isOpen: boolean;
  onClose: () => void;
  gameData: GameDataState;
  setGameData: Dispatch<React.SetStateAction<GameDataState>>;
}

export default function DeleteComponentModal(props: Props) {
  const router = useRouter();
  const gameID = router?.query.id;
  const cancelRef = useRef<HTMLButtonElement | null>(null);

  const deleteType = props.deleteType;

  const title: Record<string, string> = {
    game: props.gameData.name ? props.gameData.name : "",
    answerKey: "this answer key",
    parentingGuide: "this parenting guide",
    lessonPlan: "this lesson plan",
    trailer: "this trailer",
  };

  const subtitle: Record<string, string> = {
    game: "a game ",
    answerKey: "an answer key",
    parentingGuide: "a parenting guide",
    lessonPlan: "a lesson plan",
    trailer: "a trailer",
  };

  const deleteFunction: Record<string, () => Promise<void>> = {
    game: deleteGame,
    answerKey: deleteAnswerKey,
    parentingGuide: deleteParentingGuide,
    lessonPlan: deleteLessonPlan,
    trailer: deleteTrailer,
  };

  function handleDelete() {
    deleteFunction[deleteType]();
  }

  async function deleteGame() {
    fetch(`/api/games/${gameID}`, {
      method: "DELETE",
    });
    router?.push("/games");
  }

  async function deleteAnswerKey() {
    if (!props.gameData) return;
    props.setGameData({
      ...props.gameData,
      answerKey: "",
      answerKeyFile: undefined,
    });
    props.onClose();
  }

  async function deleteParentingGuide() {
    if (!props.gameData) return;
    props.setGameData({
      ...props.gameData,
      parentingGuide: "",
      parentingGuideFile: undefined,
    });
    props.onClose();
  }

  async function deleteLessonPlan() {
    if (!props.gameData) return;
    props.setGameData({ ...props.gameData, lesson: "", lessonFile: undefined });
    props.onClose();
  }

  async function deleteTrailer() {
    if (props.gameData) {
      props.setGameData({ ...props.gameData, videoTrailer: "" });
      props.onClose();
    }
  }

  return (
    <ChakraProvider theme={chakraTheme}>
      <div>
        <AlertDialog
          motionPreset="slideInBottom"
          leastDestructiveRef={cancelRef}
          onClose={props.onClose}
          isOpen={props.isOpen}
          isCentered
        >
          <AlertDialogOverlay />

          <AlertDialogContent
            className="items-center border-blue-primary p-12"
            border="4px"
            minHeight="250px"
            minWidth="480px"
          >
            <div>
              <AlertDialogCloseButton className="mr-11 mt-11 text-sm text-blue-primary" />
            </div>
            <AlertDialogHeader className="mt-12 w-80 p-0 text-center font-sans text-lg font-semibold text-blue-primary">
              Are you sure you want to delete &quot;{title[deleteType]}&quot;?
            </AlertDialogHeader>
            <AlertDialogBody p="0">
              <div className="mt-6 text-center font-sans text-base">
                Deleting {subtitle[deleteType]} is final and cannot be undone.
              </div>
            </AlertDialogBody>
            <AlertDialogFooter className="mt-12 w-full justify-center gap-4 p-0">
              <button
                ref={cancelRef}
                onClick={props.onClose}
                className="w-full rounded-md border border-border px-4 py-3 font-sans text-xl font-medium hover:border-gray-tab hover:bg-gray-tab"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="w-full rounded-md bg-delete-red px-4 py-3 font-sans text-xl font-medium text-white hover:bg-dark-red-hover"
              >
                Yes, delete
              </button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ChakraProvider>
  );
}
