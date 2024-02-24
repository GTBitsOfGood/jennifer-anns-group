import styles from "@/styles/game.module.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TabsComponent from "../../components/Tabs/TabsComponent";
import TagsComponent from "../../components/Tags/TagsComponent";
import { gameSchema } from "@/utils/types";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { userSchema } from "@/utils/types";
import editIcon from "@/images/editIcon.png";
import Link from "next/link";

const GamePage = () => {
  const gameID = useRouter().query.id;
  const [gameData, setGameData] = useState<z.infer<typeof gameSchema>>();
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
      {(userData && userData.label === "administrator")
        ? <Link href={`/games/${gameID}/edit`}>
            <div className="flex justify-end w-[80vw] mx-auto">
              <button className="bg-input-border font-sans font-medium text-blue-primary px-4 py-2 text-base rounded-full">
                Edit
              </button> 
            </div>
          </Link>: null}
      <TabsComponent gameData={gameData} />
      <TagsComponent gameData={gameData} />
    </div>
  );
};

export default GamePage;
