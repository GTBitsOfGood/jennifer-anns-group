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
import React, { useState } from "react";
import axios from "axios";
import { populatedGameWithId } from "@/server/db/models/GameModel";

interface Props {
  deleteType: string;
  isOpen: boolean;
  onClose: () => void;
  gameName?: string;
  buildType?: string;
  setAddOrEdit?: React.Dispatch<React.SetStateAction<"Add" | "Edit">>;
  gameData?: populatedGameWithId;
  setDeleted?: (value: boolean) => void;
}

export default function DeleteComponentModal(props: Props) {
  const router = useRouter();
  const gameID = router.query.id;
  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  const deleteType = props.deleteType;

  const title: Record<string, string> = {
    game: props.gameName ? props.gameName : "",
    answerKey: "this answer key",
    parentingGuide: "this parenting guide",
    lessonPlan: "this lesson plan",
    trailer: "this trailer",
    build: props.gameName + " " + props.buildType,
  };

  const subtitle: Record<string, string> = {
    game: "a game page",
    answerKey: "an answer key",
    parentingGuide: "a parenting guide",
    lessonPlan: "a lesson plan",
    trailer: "a trailer",
    build: "a game build",
  };

  const button: Record<string, string> = {
    game: "page",
    answerKey: "key",
    parentingGuide: "guide",
    lessonPlan: "plan",
    trailer: "trailer",
    build: "build",
  };

  // const deleteFunction: Record<string, Promise<void>> = {
  //   game: deleteGame(),
  //   answerKey: deleteAnswerKey(),
  //   parentingGuide: deleteParentingGuide(),
  //   lessonPlan: deleteLessonPlan(),
  //   trailer: deleteTrailer(),
  //   build: deleteBuild(),
  // };

  function handleDelete() {
    deleteFunction[deleteType];
  }

  const deleteFunction: Record<string, Promise<void>> = {
    game: temp(),
    answerKey: temp(),
    parentingGuide: temp(),
    lessonPlan: temp(),
    trailer: temp(),
    build: temp(),
  };

  async function temp() {}

  async function deleteGame() {
    console.log("alsdkfjlaksjdf");
    // fetch(`/api/games/${gameID}`, {
    //   method: "DELETE",
    // });
    router.push("/games");
  }

  async function deleteAnswerKey() {}

  async function deleteParentingGuide() {}

  async function deleteLessonPlan() {}

  async function deleteBuild() {
    if (props.setAddOrEdit) {
      setDeleting(true);
      await axios.delete(`/api/games/${gameID}/builds`);
      props.setAddOrEdit("Add");
      setDeleting(false);
      props.onClose();
    }
  }

  async function deleteTrailer() {
    if (props.gameData && props.setDeleted) {
      props.gameData.videoTrailer = "";
      props.setDeleted(true);
      router.push(`/games/${gameID}/edit`);
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
              <div className="text-center font-sans text-base font-normal">
                Deleting {subtitle[deleteType]} is final and cannot be undone.
              </div>
            </AlertDialogBody>
            <AlertDialogFooter p="0" justifyContent="center">
              <button
                // onClick={handleDelete}
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
