import styles from "@/styles/game.module.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TabsComponent from "../../components/Tabs/TabsComponent";
import TagsComponent from "../../components/Tags/TagsComponent";
import { gameSchema } from "@/utils/types";
import { z } from "zod";

export default function gamePage() {
  const gameID = useRouter().query.id;
  const [gameData, setGameData] = useState<z.infer<typeof gameSchema>>();

  useEffect(() => {
    if (gameID) {
      getGame();
    }
  }, [gameID]);

  async function getGame() {
    const response = await fetch(`/api/games/${gameID}`);
    const data = await response.json();
    setGameData(data);
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
}
