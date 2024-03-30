import ReactPlayer from "react-player/lazy";
import { Flex } from "@chakra-ui/react";
import DeleteVideoTrailer from "../GameScreen/DeleteVideoTrailerComponent";
import AddEditVideoTrailer from "../GameScreen/AddEditVideoTrailerComponent";
import { populatedGameWithId } from "@/server/db/models/GameModel";
import { Dispatch } from "react";
interface Props {
  gameData: populatedGameWithId;
  setGameData?: Dispatch<populatedGameWithId>;
  edit: boolean;
}

export default function VideoComponent({ gameData, edit, setGameData }: Props) {
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
            <DeleteVideoTrailer gameData={gameData} setGameData={setGameData} />
          ) : null}
        </Flex>
      )}
    </div>
  );
}
