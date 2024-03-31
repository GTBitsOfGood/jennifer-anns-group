import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TabsComponent from "../../components/Tabs/TabsComponent";
import TagsComponent from "../../components/Tags/TagsComponent";
import ContactComponent from "../../components/Tabs/ContactComponent";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { userSchema } from "@/utils/types";
import EmbeddedGame from "@/components/EmbeddedGame";
import NotesComponent from "@/components/Tabs/NotesComponent";
import { populatedGameWithId } from "@/server/db/models/GameModel";
import AdminEditButton from "@/components/GameScreen/AdminEditButton";

const GamePage = () => {
  const gameId = useRouter().query.id as string;
  const [gameData, setGameData] = useState<populatedGameWithId>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session } = useSession();
  const idSchema = z.string().length(24);
  const [visibleAnswer, setVisibleAnswer] = useState(false);
  const userDataSchema = userSchema
    .extend({
      _id: idSchema,
    })
    .omit({ hashedPassword: true });
  const currentUser = session?.user;
  const [userData, setUserData] = useState<z.infer<typeof userDataSchema>>();
  const userId = currentUser?._id as string | undefined;
  useEffect(() => {
    if (userData && userData.label !== "student") {
      setVisibleAnswer(true);
    } else {
      setVisibleAnswer(false);
    }
  }, [userData]);
  useEffect(() => {
    if (currentUser) {
      getUserData();
    }
  }, [currentUser]);

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
        router.push("/");
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

  const loaded = userData && userId;

  return (
    <div>
      <h1 className="mt-[32px] text-center font-sans text-[56px] font-semibold">
        {gameData.name}
      </h1>
      {loaded && (
        <>
          {userData.label === "administrator" && (
            <AdminEditButton gameId={gameId} />
          )}
        </>
      )}
      <EmbeddedGame gameId={gameId as string} />
      <TabsComponent
        mode="view"
        gameData={gameData}
        authorized={visibleAnswer}
      />
      {loaded && userData.label !== "administrator" && (
        <NotesComponent gameId={gameId} userId={userId} />
      )}
      {loaded && userData.label !== "administrator" && <ContactComponent />}
      <TagsComponent mode="view" gameData={gameData} admin={visibleAnswer} />
    </div>
  );
};

export default GamePage;

//Fix formatting of ContactComponent, and add that second screen once submitted.
