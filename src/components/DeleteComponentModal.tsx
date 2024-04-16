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
import { useRef, Dispatch } from "react";
import { GameDataState } from "./GameScreen/GamePage";

interface Props {
  deleteType: string;
  isOpen: boolean;
  onClose: () => void;
  gameData: GameDataState;
  setGameData: Dispatch<React.SetStateAction<GameDataState | undefined>>;
}

export default function DeleteComponentModal(props: Props) {
  const router = useRouter();
  const gameID = router.query.id;
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
    game: "a game page",
    answerKey: "an answer key",
    parentingGuide: "a parenting guide",
    lessonPlan: "a lesson plan",
    trailer: "a trailer",
  };

  const button: Record<string, string> = {
    game: "page",
    answerKey: "key",
    parentingGuide: "guide",
    lessonPlan: "plan",
    trailer: "trailer",
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
    router.push("/games");
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
                Are you sure you want to delete {title[deleteType]}?
              </div>
            </AlertDialogHeader>
            <AlertDialogBody p="0" mt="50px">
              <div className="mb-10 text-center font-sans text-base font-normal">
                Deleting {subtitle[deleteType]} is final and cannot be undone.
              </div>
            </AlertDialogBody>
            <AlertDialogFooter p="0" justifyContent="center">
              <button
                onClick={handleDelete}
                className="mb-24 mr-[22px] h-[47px] w-[198px] rounded-[10px] bg-delete-red font-sans font-semibold text-white"
              >
                Yes, delete {button[deleteType]}
              </button>
              <button
                ref={cancelRef}
                onClick={props.onClose}
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
