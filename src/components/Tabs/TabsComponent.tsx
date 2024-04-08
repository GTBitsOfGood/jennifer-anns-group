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
import { Button } from "../ui/button";
import { X } from "lucide-react";
import UploadModal from "./UploadModal";
import DeleteComponentModal from "../DeleteComponentModal";
import { GameDataState } from "../GameScreen/GamePage";

interface Props {
  mode: string;
  gameData: GameDataState;
  setGameData: Dispatch<React.SetStateAction<GameDataState | undefined>>;
  authorized?: boolean;
}

export default function TabsComponent({
  mode,
  gameData,
  setGameData,
  authorized,
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
  const [description, setDescription] = useState(gameData.description);
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

  return (
    <ChakraProvider theme={chakraTheme}>
      <div>
        <Tabs colorScheme="brand" className="m-auto w-5/6 font-sans">
          <TabList>
            {mode === "view" ? (
              <>
                {/** tabs in view mode only visible if value exists */}
                <Tab>Description</Tab>
                {gameData.videoTrailer && gameData.videoTrailer !== "" && (
                  <Tab>Trailer</Tab>
                )}
                {gameData.lesson && gameData.lesson !== "" && (
                  <Tab>Lesson Plan</Tab>
                )}
                {gameData.parentingGuide && gameData.parentingGuide !== "" && (
                  <Tab>Parenting Guide</Tab>
                )}
                {gameData.answerKey &&
                  gameData.answerKey !== "" &&
                  authorized && <Tab>Answer Key</Tab>}
                {gameData?.builds && gameData.builds.length > 0 && (
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
          <TabPanels className="mb-12 mt-8  text-gray-500">
            {/** description tab display depends on edit or view mode */}
            <TabPanel p="0px">
              {mode === "edit" ? (
                <div className="rounded-[20px] border border-solid border-grey bg-input-bg">
                  <textarea
                    className="h-52 w-full !resize-none rounded-[20px] border-[20px] border-solid border-transparent bg-input-bg font-sans !outline-none"
                    value={description}
                    onChange={handleChange}
                  />
                </div>
              ) : (
                <p>{gameData.description}</p>
              )}
            </TabPanel>
            {/** other tabs render if field exists or in edit mode */}
            {((gameData.videoTrailer && gameData.videoTrailer !== "") ||
              mode === "edit") && (
              <TabPanel>
                <VideoComponent
                  gameData={gameData}
                  edit={mode === "edit"}
                  setGameData={setGameData}
                />
              </TabPanel>
            )}
            {((gameData.lesson && gameData.lesson !== "") ||
              mode === "edit") && (
              <TabPanel display="flex" flexDir="column" gap={2}>
                {((gameData.lesson && gameData.lesson !== "") ||
                  gameData.lessonFile) && (
                  <iframe
                    className="w-full"
                    height="400"
                    src={
                      gameData.lessonFile
                        ? URL.createObjectURL(gameData.lessonFile as File)
                        : gameData.lesson
                    }
                  />
                )}
                {mode === "edit" && (
                  <div className="flex flex-row gap-2">
                    <UploadModal
                      title="Lesson Plan"
                      field="lesson"
                      fileField="lessonFile"
                      gameData={gameData}
                      setGameData={setGameData}
                    />
                    {((gameData.lesson && gameData.lesson !== "") ||
                      gameData.lessonFile) && (
                      <Button
                        type="button"
                        variant="outline"
                        className="items-center gap-1 border-red-700 text-red-700 hover:bg-red-700"
                        onClick={onDeleteLessonOpen}
                      >
                        Delete Lesson Plan <X size={18} />
                      </Button>
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
            {((gameData.parentingGuide && gameData.parentingGuide !== "") ||
              mode === "edit") && (
              <TabPanel display="flex" flexDir="column" gap={2}>
                {((gameData.parentingGuide && gameData.parentingGuide !== "") ||
                  gameData.parentingGuideFile) && (
                  <iframe
                    className="w-full"
                    height="400"
                    src={
                      gameData.parentingGuideFile
                        ? URL.createObjectURL(
                            gameData.parentingGuideFile as File,
                          )
                        : gameData.parentingGuide
                    }
                  />
                )}

                {mode === "edit" && (
                  <div className="flex flex-row gap-2">
                    <UploadModal
                      title="Parenting Guide"
                      field="parentingGuide"
                      fileField="parentingGuideFile"
                      gameData={gameData}
                      setGameData={setGameData}
                    />
                    {((gameData.parentingGuide &&
                      gameData.parentingGuide !== "") ||
                      gameData.parentingGuideFile) && (
                      <Button
                        type="button"
                        variant="outline"
                        className="items-center gap-1 border-red-700 text-red-700 hover:bg-red-700"
                        onClick={onDeleteParentingGuideOpen}
                      >
                        Delete Parenting Guide <X size={18} />
                      </Button>
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
            {((gameData.answerKey && gameData.answerKey !== "" && authorized) ||
              mode === "edit") && (
              <TabPanel display="flex" flexDir="column" gap={2}>
                {((gameData.answerKey && gameData.answerKey !== "") ||
                  gameData.answerKeyFile) && (
                  <iframe
                    className="w-full"
                    height="400"
                    src={
                      gameData.answerKeyFile
                        ? URL.createObjectURL(gameData.answerKeyFile as File)
                        : gameData.answerKey
                    }
                  />
                )}
                {mode === "edit" && (
                  <div className="flex flex-row gap-2">
                    <UploadModal
                      title="Answer Key"
                      field="answerKey"
                      fileField="answerKeyFile"
                      gameData={gameData}
                      setGameData={setGameData}
                    />
                    {((gameData.answerKey && gameData.answerKey !== "") ||
                      gameData.answerKeyFile) && (
                      <Button
                        type="button"
                        variant="outline"
                        className="items-center gap-1 border-red-700 text-red-700 hover:bg-red-700"
                        onClick={onDeleteAnswerKeyOpen}
                      >
                        Delete Answer Key <X size={18} />
                      </Button>
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
            {((gameData?.builds && gameData.builds.length > 0) ||
              mode === "edit") && (
              <TabPanel>
                <GameBuildList
                  gameData={gameData}
                  editing={mode === "edit"}
                  setGameData={setGameData}
                />
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </div>
    </ChakraProvider>
  );
}
