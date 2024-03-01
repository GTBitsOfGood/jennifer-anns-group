import styles from "@/styles/game.module.css";
import { useRouter } from "next/router";
import { useState } from "react";
import TabsComponent from "../../components/Tabs/TabsComponent";
import TagsComponent from "../../components/Tags/TagsComponent";
import { gameSchema } from "@/utils/types";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { userSchema } from "@/utils/types";
import editIcon from "@/images/editIcon.png";
import Link from "next/link";
import { populatedGame } from "@/server/db/models/GameModel";

const GamePage = () => {
  const gameID = useRouter().query.id;
  const [gameData, setGameData] = useState<populatedGame>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const idSchema = z.string().length(24);

  const userDataSchema = userSchema
    .extend({
      _id: idSchema,
    })
    .omit({ hashedPassword: true });

  const { data: session } = useSession();
  const currentUser = session?.user;
  const [userData, setUserData] = useState<z.infer<typeof userDataSchema>>();

  useEffect(() => {
    if (currentUser) {
      getUserData();
      console.log(userData);
    }
  }, [currentUser]);

  async function getUserData() {
    try {
      const response = await fetch(`/api/users/${currentUser?._id}`);
      const data = await response.json();
      setUserData(data.data);
    } catch (error) {
      console.error("Error getting user:", error);
    }
  }

  const getGame = async () => {
    try {
      const response = await fetch(`/api/games/${gameID}`);
      if (!response.ok) {
        setError("Failed to fetch game");
      }
      const data = await response.json();
      setGameData(data);
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
      {userData && userData.label === "administrator" ? (
        <Link href={`/games/${gameID}/edit`}>
          <div className="mx-auto flex w-[80vw] justify-end">
            <button className="rounded-full bg-input-border px-4 py-2 font-sans text-base font-medium text-blue-primary">
              Edit
            </button>
          </div>
        </Link>
      ) : null}
      <TabsComponent mode="view" gameData={gameData} />
      <TagsComponent
        mode="view"
        themes={gameData.themes}
        tags={gameData.tags}
      />
    </div>
  );
};

export default GamePage;
