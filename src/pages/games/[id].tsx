import styles from "@/styles/game.module.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TabsComponent from "../../components/Tabs/TabsComponent";
import TagsComponent from "../../components/Tags/TagsComponent";
import { populatedGame } from "@/server/db/models/GameModel";

import { z } from "zod";

const GamePage = () => {
  const gameID = useRouter().query.id;
  const [gameData, setGameData] = useState<populatedGame>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getGame = async () => {
    try {
      const response = await fetch(`/api/games/${gameID}`);
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

  if (gameID && loading) {
    getGame();
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!gameData) {
    return <div>Game does not exist</div>;
  }

  return (
    <div>
      <h1 className={styles.name}>{gameData.name}</h1>
      <TabsComponent gameData={gameData} />
      <TagsComponent gameData={gameData} />
    </div>
  );
};

export default GamePage;
