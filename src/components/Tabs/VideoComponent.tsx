import ReactPlayer from "react-player/lazy";
import { Flex, useDisclosure } from "@chakra-ui/react";
import DeleteComponentModal from "@/components/DeleteComponentModal";
import AddEditVideoTrailer from "../GameScreen/AddEditVideoTrailerComponent";
import { Dispatch, useEffect, useState } from "react";
import { Trash } from "lucide-react";
import { GameDataState } from "../GameScreen/GamePage";

interface Props {
  gameData: GameDataState;
  setGameData: Dispatch<React.SetStateAction<GameDataState>>;
  edit: boolean;
}

export default function VideoComponent({ gameData, edit, setGameData }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex flex-col justify-center">
      {isClient && gameData?.videoTrailer && gameData?.videoTrailer !== "" ? (
        <div
          className="mb-6"
          style={{ paddingTop: "56.25%", position: "relative" }}
        >
          <ReactPlayer
            url={gameData?.videoTrailer}
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
        <Flex className="flex flex-row gap-4">
          <AddEditVideoTrailer gameData={gameData} setGameData={setGameData} />
          {gameData?.videoTrailer && gameData?.videoTrailer !== "" ? (
            <div>
              <button
                onClick={onOpen}
                className="flex items-center gap-1 rounded-md border border-delete-red px-4 py-3  font-sans text-lg font-medium text-delete-red hover:bg-dark-red-hover hover:text-white"
              >
                Delete Trailer
                <Trash size={18} />
              </button>
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
