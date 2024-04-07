import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  ChakraProvider,
} from "@chakra-ui/react";
import chakraTheme from "@/styles/chakraTheme";
import { populatedGameWithId } from "@/server/db/models/GameModel";
import { ChangeEvent, Dispatch, useState } from "react";
import GameBuildList from "../GameScreen/GameBuildList";
import VideoComponent from "./VideoComponent";
interface Props {
  mode: string;
  gameData: populatedGameWithId;
  setGameData?: Dispatch<populatedGameWithId>;
  authorized?: boolean;
}

export default function TabsComponent({
  mode,
  gameData,
  setGameData,
  authorized,
}: Props) {
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
          <TabPanels className="mb-12 mt-8 text-gray-500">
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
              mode === "edit") && <TabPanel>Lesson Plan</TabPanel>}
            {((gameData.parentingGuide && gameData.parentingGuide !== "") ||
              mode === "edit") && <TabPanel>Parenting Guide</TabPanel>}
            {((gameData.answerKey && gameData.answerKey !== "" && authorized) ||
              mode === "edit") && <TabPanel>Answer Key</TabPanel>}
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
