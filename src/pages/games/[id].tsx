import styles from "@/styles/game.module.css";
import { useRouter } from "next/router";
import { useState } from "react";
import TabsComponent from "../../components/Tabs/TabsComponent";
import TagsComponent from "../../components/Tags/TagsComponent";
import { gameSchema } from "@/utils/types";
import { z } from "zod";
import EmbeddedGame from "@/components/EmbeddedGame";

const GamePage = () => {
  const gameId = useRouter().query.id;
  const [gameData, setGameData] = useState<z.infer<typeof gameSchema>>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getGame = async () => {
    try {
      const response = await fetch(`/api/games/${gameId}`);
      if (!response.ok) {
        setError("Failed to fetch game");
      }
      const data = await response.json();
      setGameData(data.data);
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (gameId && loading) {
    getGame();
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (loading) {
    return <></>;
  }

  if (!gameData) {
    return <div>Game does not exist</div>;
  }

  return (
    <div>
      <h1 className={styles.name}>{gameData.name}</h1>
      <EmbeddedGame gameId={gameId as string} />
      <TabsComponent gameData={gameData} />
      <TagsComponent gameData={gameData} />
    </div>
  );
};

export default GamePage;
