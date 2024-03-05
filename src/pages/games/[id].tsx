import styles from "@/styles/game.module.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TabsComponent from "../../components/Tabs/TabsComponent";
import TagsComponent from "../../components/Tags/TagsComponent";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { userSchema } from "@/utils/types";
import Image from "next/image";
import Link from "next/link";
import EmbeddedGame from "@/components/EmbeddedGame";
import NotesComponent from "@/components/Tabs/NotesComponent";
import { populatedGameWithId } from "@/server/db/models/GameModel";

const GamePage = () => {
  const gameId = useRouter().query.id as string;
  const [gameData, setGameData] = useState<populatedGameWithId>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { data: session } = useSession();
  const idSchema = z.string().length(24);
  const userDataSchema = userSchema
    .extend({
      _id: idSchema,
    })
    .omit({ hashedPassword: true });
  const currentUser = session?.user;
  const [userData, setUserData] = useState<z.infer<typeof userDataSchema>>();
  const userId = currentUser?._id as string | undefined;

  useEffect(() => {
    if (currentUser) {
      getUserData();
    }
  }, [currentUser, getUserData]);

  async function getUserData() {
    try {
      const response = await fetch(`/api/users/${currentUser?._id}`);
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error getting user:", error);
    }
  }

  const getGame = async () => {
    try {
      const response = await fetch(`/api/games/${gameId}`);
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
      {userData && userData.label === "administrator" ? (
        <Link href={`/games/${gameId}/edit`}>
          <div className="mx-auto flex w-[80vw] justify-end">
            <button className="rounded-full bg-input-border">
              <div className="flex flex-row py-2 pl-3.5 pr-4">
                <Image
                  width={24}
                  height={24}
                  src={`/editIcon.png`}
                  alt="edit-icon"
                />
                <p className="ml-1 font-sans text-base font-medium text-blue-primary">
                  Edit
                </p>
              </div>
            </button>
          </div>
        </Link>
      ) : null}
      <TabsComponent mode="view" gameData={gameData} />
      {userData && userData.label !== "administrator" && userId && (
        <NotesComponent gameId={gameId} userId={userId} />
      )}
      <TagsComponent mode="view" gameData={gameData} />
    </div>
  );
};

export default GamePage;
