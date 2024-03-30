import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  ChakraProvider,
  Flex,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import chakraTheme from "@/styles/chakraTheme";
import { populatedGameWithId } from "@/server/db/models/GameModel";
import AddEditVideoTrailer from "../GameScreen/AddEditVideoTrailerComponent";
import { ChangeEvent, Dispatch, useState } from "react";
import GameBuildList from "../GameComponent/GameBuildList";
import ReactPlayer from "react-player/lazy";
import DeleteComponentModal from "../DeleteComponentModal";
import { CloseIcon } from "@chakra-ui/icons";
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [description, setDescription] = useState(gameData.description);
  const [deleted, setDeleted] = useState(false);
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
            {gameData.answerKey && authorized ? <Tab>Answer Key</Tab> : null}
            {((gameData?.builds && gameData.builds.length > 0) ||
              mode === "edit") && <Tab>Game Builds</Tab>}
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
            {(gameData.videoTrailer && gameData.videoTrailer !== "") ||
            mode === "edit" ? (
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
                    <AddEditVideoTrailer
                      gameData={gameData}
                      deleted={deleted}
                    />
                    {gameData.videoTrailer && gameData.videoTrailer !== "" ? (
                      <div>
                        <Button
                          onClick={onOpen}
                          rightIcon={
                            <CloseIcon color="deleteRed" boxSize="10px" />
                          }
                          bg="white"
                          color="deleteRed"
                          className="w-183 h-46 mt-5 rounded-md border border-delete-red bg-white px-[17px] py-2 font-sans text-xl font-semibold text-delete-red"
                        >
                          Delete Trailer
                        </Button>
                        <DeleteComponentModal
                          deleteType="trailer"
                          isOpen={isOpen}
                          onClose={onClose}
                          gameData={gameData}
                          setDeleted={setDeleted}
                        />
                      </div>
                    ) : null}
                  </Flex>
                )}
              </TabPanel>
            ) : null}
            {gameData.parentingGuide ? (
              <TabPanel>Parenting Guide</TabPanel>
            ) : null}
            {gameData.lesson ? <TabPanel>Lesson Plan</TabPanel> : null}
            {gameData.answerKey && authorized ? (
              <TabPanel>Answer Key</TabPanel>
            ) : null}
            {((gameData?.builds && gameData.builds.length > 0) ||
              mode === "edit") && (
              <TabPanel p="0px">
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
