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
import ReactPlayer from "react-player";
interface Props {
  mode: string;
  gameData: populatedGameWithId;
  setGameData?: Dispatch<populatedGameWithId>;
}

export default function TabsComponent({ mode, gameData, setGameData }: Props) {
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
            {gameData.videoTrailer ? <Tab>Trailer</Tab>: null}
            {gameData.parentingGuide ? <Tab>Parenting Guide</Tab> : null}
            {gameData.lesson ? <Tab>Lesson Plan</Tab> : null}
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
            {gameData.videoTrailer ? <TabPanel className="flex justify-center"><ReactPlayer url={gameData.videoTrailer} controls={true} width={1400} height={797} /></TabPanel> : null}
            {gameData.parentingGuide ? <TabPanel>Parenting Guide</TabPanel> : null}
            {gameData.lesson ? <TabPanel>Lesson Plan</TabPanel> : null}

          </TabPanels>
        </Tabs>
      </div>
    </ChakraProvider>
  );
}
