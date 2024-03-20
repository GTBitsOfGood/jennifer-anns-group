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
import AddVideoTrailer from "../GameScreen/AddVideoTrailerComponent";
import EditVideoTrailer from "../GameScreen/EditVideoTrailerComponent";
import { ChangeEvent, Dispatch, useState } from "react";
import ReactPlayer from "react-player";
import { Delete } from "lucide-react";
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
            {gameData.videoTrailer && gameData.videoTrailer !== "" ? (
              <TabPanel className="flex flex-col justify-center">
                <ReactPlayer
                  url={gameData.videoTrailer}
                  controls={true}
                  width={1300}
                  height={731}
                />
                {mode === "edit" && (
                  <Flex className="flex-row">
                    <EditVideoTrailer gameData={gameData} />
                    <DeleteVideoTrailer gameData={gameData} />
                  </Flex>
                )}
              </TabPanel>
            ) : null}
            {(gameData.videoTrailer === undefined ||
              gameData.videoTrailer === "") &&
            mode === "edit" ? (
              <TabPanel>
                <AddVideoTrailer gameData={gameData} />
              </TabPanel>
            ) : null}
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

//TODO: Set it up so that it only actually updates the database when you click save changes. Else wise it just changes the object.
