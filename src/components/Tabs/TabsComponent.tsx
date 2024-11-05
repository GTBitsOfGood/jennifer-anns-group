import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  ChakraProvider,
  useDisclosure,
} from "@chakra-ui/react";
import chakraTheme from "@/styles/chakraTheme";
import { ChangeEvent, Dispatch, useState } from "react";
import GameBuildList from "../GameScreen/WebGL/GameBuildList";
import VideoComponent from "./VideoComponent";
import { Trash } from "lucide-react";
import UploadModal from "./UploadModal";
import DeleteComponentModal from "../DeleteComponentModal";
import { GameDataState } from "../GameScreen/GamePage";
import { userDataSchema } from "../ProfileModal/ProfileModal";
import { z } from "zod";
import { useAnalytics } from "@/context/AnalyticsContext";

interface Props {
  mode: string;
  gameData: GameDataState;
  setGameData: Dispatch<React.SetStateAction<GameDataState>>;
  authorized?: boolean;
  userData: z.infer<typeof userDataSchema> | undefined;
}

export default function TabsComponent({
  mode,
  gameData,
  setGameData,
  authorized,
  userData,
}: Props) {
  const {
    isOpen: isDeleteLessonOpen,
    onOpen: onDeleteLessonOpen,
    onClose: onDeleteLessonClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteParentingGuideOpen,
    onOpen: onDeleteParentingGuideOpen,
    onClose: onDeleteParentingGuideClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteAnswerKeyOpen,
    onOpen: onDeleteAnswerKeyOpen,
    onClose: onDeleteAnswerKeyClose,
  } = useDisclosure();
  const [description, setDescription] = useState(gameData?.description);
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setDescription(newValue);
    if (setGameData) {
      setGameData({
        ...gameData,
        description: newValue,
      });
    }
  };
  //Handle Analytics
  const { logCustomEvent } = useAnalytics();

  const [visitedLessonPlan, setVisitedLessonPlan] = useState(false);
  const [visitedParentingGuide, setVisitedParentingGuide] = useState(false);
  const [visitedAnswerKey, setVisitedAnswerKey] = useState(false);

  const loadedFile = (resourceUrl: string, resourceName: string) => {
    if (userData != undefined && userData.tracked) {
      const properties = {
        userId: userData._id,
        userGroup: userData.label,
        createdDate: Date(),
        gameName: gameData?.name,
        resourceName: resourceName,
        resourceUrl: resourceUrl,
        downloadSrc: window.location.href,
      };
      logCustomEvent("View", "pdf", properties);
    }
  };
  const onTabChange = (index: number) => {
    if (!visitedLessonPlan && index == 1) {
      setVisitedLessonPlan(true);
      loadedFile(gameData?.lesson ?? "No Url", "Lesson Plan");
    } else if (!visitedParentingGuide && index == 2) {
      setVisitedParentingGuide(true);
      loadedFile(gameData?.parentingGuide ?? "No Url", "Parenting Guide");
    } else if (!visitedAnswerKey && index == 3) {
      setVisitedAnswerKey(true);
      loadedFile(gameData?.answerKey ?? "No Url", "Answer Key");
    }
  };
  return (
    <ChakraProvider theme={chakraTheme}>
      <div>
        <Tabs colorScheme="brand" className="font-sans" onChange={onTabChange}>
          <TabList>
            {mode === "view" ? (
              <>
                {/** tabs in view mode only visible if value exists */}
                <Tab>Description</Tab>
                {gameData?.videoTrailer && gameData?.videoTrailer !== "" && (
                  <Tab>Trailer</Tab>
                )}
                {gameData?.lesson && gameData?.lesson !== "" && (
                  <Tab>Lesson Plan</Tab>
                )}
                {gameData?.parentingGuide &&
                  gameData?.parentingGuide !== "" && <Tab>Parenting Guide</Tab>}
                {gameData?.answerKey &&
                  gameData?.answerKey !== "" &&
                  authorized && <Tab>Answer Key</Tab>}
                {gameData?.builds && gameData?.builds.length > 0 && (
                  <Tab>Game Builds</Tab>
                )}
              </>
            ) : (
              <>
                {/** mode === "edit" all tabs are visible */}
                <Tab>Description</Tab>
                <Tab>Trailer</Tab>
                <Tab>Lesson Plan</Tab>
                <Tab>Parenting Guide</Tab>
                <Tab>Answer Key</Tab>
                <Tab>Game Builds</Tab>
              </>
            )}
          </TabList>
          <TabPanels className="mt-8 text-gray-500">
            {/** description tab display depends on edit or view mode */}
            <TabPanel className="p-0">
              {mode === "edit" ? (
                <textarea
                  className="border-lg h-52 w-full !resize-none rounded-lg border border-unselected bg-input-bg px-4 py-3 font-sans text-input-stroke !outline-none"
                  value={description}
                  onChange={handleChange}
                />
              ) : (
                <p className="font-sans text-input-stroke">
                  {gameData?.description}
                </p>
              )}
            </TabPanel>
            {/** other tabs render if field exists or in edit mode */}
            {((gameData?.videoTrailer && gameData?.videoTrailer !== "") ||
              mode === "edit") && (
              <TabPanel className="p-0">
                <VideoComponent
                  gameData={gameData}
                  edit={mode === "edit"}
                  setGameData={setGameData}
                />
              </TabPanel>
            )}
            {((gameData?.lesson && gameData?.lesson !== "") ||
              mode === "edit") && (
              <TabPanel className="p-0" display="flex" flexDir="column" gap={8}>
                {((gameData?.lesson && gameData?.lesson !== "") ||
                  gameData?.lessonFile) && (
                  <iframe
                    className="w-full"
                    height="600"
                    src={
                      gameData?.lessonFile
                        ? URL.createObjectURL(gameData?.lessonFile as File)
                        : gameData?.lesson
                    }
                  />
                )}
                {mode === "edit" && (
                  <div className="flex flex-row gap-4">
                    <UploadModal
                      field="lesson"
                      fileField="lessonFile"
                      gameData={gameData}
                      setGameData={setGameData}
                    />
                    {((gameData?.lesson && gameData?.lesson !== "") ||
                      gameData?.lessonFile) && (
                      <button
                        className="flex items-center gap-1 rounded-md border border-delete-red px-4 py-3  font-sans text-lg font-medium text-delete-red hover:bg-dark-red-hover hover:text-white"
                        onClick={onDeleteLessonOpen}
                      >
                        Delete PDF <Trash size={18} />
                      </button>
                    )}
                    <DeleteComponentModal
                      isOpen={isDeleteLessonOpen}
                      onClose={onDeleteLessonClose}
                      gameData={gameData}
                      setGameData={setGameData}
                      deleteType="lessonPlan"
                    />
                  </div>
                )}
              </TabPanel>
            )}
            {((gameData?.parentingGuide && gameData?.parentingGuide !== "") ||
              mode === "edit") && (
              <TabPanel className="p-0" display="flex" flexDir="column" gap={8}>
                {((gameData?.parentingGuide &&
                  gameData?.parentingGuide !== "") ||
                  gameData?.parentingGuideFile) && (
                  <iframe
                    className="w-full"
                    height="600"
                    src={
                      gameData?.parentingGuideFile
                        ? URL.createObjectURL(
                            gameData?.parentingGuideFile as File,
                          )
                        : gameData?.parentingGuide
                    }
                  />
                )}

                {mode === "edit" && (
                  <div className="flex flex-row gap-4">
                    <UploadModal
                      field="parentingGuide"
                      fileField="parentingGuideFile"
                      gameData={gameData}
                      setGameData={setGameData}
                    />
                    {((gameData?.parentingGuide &&
                      gameData?.parentingGuide !== "") ||
                      gameData?.parentingGuideFile) && (
                      <button
                        className="flex items-center gap-1 rounded-md border border-delete-red px-4 py-3  font-sans text-lg font-medium text-delete-red hover:bg-dark-red-hover hover:text-white"
                        onClick={onDeleteParentingGuideOpen}
                      >
                        Delete PDF <Trash size={18} />
                      </button>
                    )}
                    <DeleteComponentModal
                      isOpen={isDeleteParentingGuideOpen}
                      onClose={onDeleteParentingGuideClose}
                      gameData={gameData}
                      setGameData={setGameData}
                      deleteType="parentingGuide"
                    />
                  </div>
                )}
              </TabPanel>
            )}
            {((gameData?.answerKey &&
              gameData?.answerKey !== "" &&
              authorized) ||
              mode === "edit") && (
              <TabPanel className="p-0" display="flex" flexDir="column" gap={8}>
                {((gameData?.answerKey && gameData?.answerKey !== "") ||
                  gameData?.answerKeyFile) && (
                  <iframe
                    className="w-full"
                    height="600"
                    src={
                      gameData?.answerKeyFile
                        ? URL.createObjectURL(gameData?.answerKeyFile as File)
                        : gameData?.answerKey
                    }
                  />
                )}
                {mode === "edit" && (
                  <div className="flex flex-row gap-4">
                    <UploadModal
                      field="answerKey"
                      fileField="answerKeyFile"
                      gameData={gameData}
                      setGameData={setGameData}
                    />
                    {((gameData?.answerKey && gameData?.answerKey !== "") ||
                      gameData?.answerKeyFile) && (
                      <button
                        className="flex items-center gap-1 rounded-md border border-delete-red px-4 py-3  font-sans text-lg font-medium text-delete-red hover:bg-dark-red-hover hover:text-white"
                        onClick={onDeleteAnswerKeyOpen}
                      >
                        Delete PDF <Trash size={18} />
                      </button>
                    )}
                    <DeleteComponentModal
                      isOpen={isDeleteAnswerKeyOpen}
                      onClose={onDeleteAnswerKeyClose}
                      gameData={gameData}
                      setGameData={setGameData}
                      deleteType="answerKey"
                    />
                  </div>
                )}
              </TabPanel>
            )}
            {((gameData?.builds && gameData?.builds.length > 0) ||
              mode === "edit") && (
              <TabPanel className="p-0">
                <GameBuildList
                  gameData={gameData}
                  editing={mode === "edit"}
                  setGameData={setGameData}
                  userData={userData}
                />
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </div>
    </ChakraProvider>
  );
}
