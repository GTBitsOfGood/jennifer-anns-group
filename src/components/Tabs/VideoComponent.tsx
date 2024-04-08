import ReactPlayer from "react-player/lazy";
import { Flex, Button, useDisclosure } from "@chakra-ui/react";
import DeleteComponentModal from "@/components/DeleteComponentModal";
import AddEditVideoTrailer from "../GameScreen/AddEditVideoTrailerComponent";
import { populatedGameWithId } from "@/server/db/models/GameModel";
import { Dispatch } from "react";
import { CloseIcon } from "@chakra-ui/icons";
import { GameDataState } from "../GameScreen/GamePage";

interface Props {
  gameData: GameDataState;
  setGameData: Dispatch<React.SetStateAction<GameDataState | undefined>>;
  edit: boolean;
}

export default function VideoComponent({ gameData, edit, setGameData }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <div className="flex flex-col justify-center">
      {gameData.videoTrailer && gameData.videoTrailer !== "" ? (
        <div style={{ paddingTop: "56.25%", position: "relative" }}>
          <ReactPlayer
            url={gameData.videoTrailer}
            controls={true}
            width="100%"
            height="100%"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
        </div>
      ) : null}

      {edit && setGameData && (
        <Flex className="flex-row">
          <AddEditVideoTrailer gameData={gameData} setGameData={setGameData} />
          {gameData.videoTrailer && gameData.videoTrailer !== "" ? (
            <div>
              <Button
                onClick={onOpen}
                rightIcon={<CloseIcon color="deleteRed" boxSize="10px" />}
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
                setGameData={setGameData}
              />
            </div>
          ) : null}
        </Flex>
      )}
    </div>
  );
}
