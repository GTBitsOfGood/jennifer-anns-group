import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  ChakraProvider,
  Flex,
} from "@chakra-ui/react";
import chakraTheme from "@/styles/chakraTheme";
import { populatedGameWithId } from "@/server/db/models/GameModel";
import DeleteVideoTrailer from "../GameScreen/DeleteVideoTrailerComponent";
import AddOrEditVideoTrailer from "../GameScreen/AddVideoTrailerComponent";
import { ChangeEvent, Dispatch, useState } from "react";
import ReactPlayer from "react-player/lazy";
interface Props {
  mode: string;
  gameData: populatedGameWithId;
  setGameData?: Dispatch<populatedGameWithId>;
  admin?: boolean;
}

export default function TabsComponent({
  mode,
  gameData,
  setGameData,
  admin,
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
            <Tab>Description</Tab>
            {(gameData.videoTrailer && gameData.videoTrailer !== "") ||
            mode === "edit" ? (
              <Tab>Trailer</Tab>
            ) : null}
            {gameData.parentingGuide ? <Tab>Parenting Guide</Tab> : null}
            {gameData.lesson ? <Tab>Lesson Plan</Tab> : null}
            {gameData.answerKey && admin ? <Tab>Answer Key</Tab> : null}
          </TabList>
          <TabPanels className="mb-12 mt-8 text-gray-500">
            <TabPanel p="0px">
              {mode === "edit" ? (
                <div className="rounded-[20px] border border-solid border-grey bg-input-bg">
                  <textarea
                    className="h-52 w-full !resize-none rounded-[20px] border border-[20px] border-solid border-transparent bg-input-bg font-sans !outline-none"
                    value={description}
                    onChange={handleChange}
                  />
                </div>
              ) : (
                <p>{gameData.description}</p>
              )}
            </TabPanel>
            <TabPanel className="flex flex-col justify-center">
              {gameData.videoTrailer && gameData.videoTrailer !== "" ? (
                <div style={{ paddingTop: "56.25%", position: "relative" }}>
                  <ReactPlayer
                    url={gameData.videoTrailer}
                    controls={true}
                    width="100%"
                    height="100%" //TODO: Make height dynamically rescale.
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                  />
                </div>
              ) : null}
              {mode === "edit" && (
                <Flex className="flex-row">
                  <AddOrEditVideoTrailer gameData={gameData} />
                  {gameData.videoTrailer && gameData.videoTrailer !== "" ? (
                    <DeleteVideoTrailer gameData={gameData} />
                  ) : null}
                </Flex>
              )}
            </TabPanel>

            {gameData.parentingGuide ? (
              <TabPanel>Parenting Guide</TabPanel>
            ) : null}
            {gameData.lesson ? <TabPanel>Lesson Plan</TabPanel> : null}
          </TabPanels>
        </Tabs>
      </div>
    </ChakraProvider>
  );
}
