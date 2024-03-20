import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import { tagSchema, themeSchema, userSchema } from "@/utils/types";
import { z } from "zod";
import TagsComponent from "@/components/Tags/TagsComponent";
import TabsComponent from "@/components/Tabs/TabsComponent";
import React from "react";
import DeleteGameComponent from "@/components/GameComponent/DeleteGameComponent";
import { populatedGameWithId } from "@/server/db/models/GameModel";
import { useSession } from "next-auth/react";
//Comment for ticket
const EditGamePage = () => {
  const router = useRouter();
  const gameID = router.query.id;
  const [gameData, setGameData] = useState<populatedGameWithId>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");

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
    if (!session) {
      //TODO: Remove commenting once done.
      //router.push("/");
    }
  }, [session]);

  useEffect(() => {
    if (currentUser) {
      getUserData();
    }
  }, [currentUser]);

  useEffect(() => {
    if (userData && userData.label !== "administrator") {
      router.push("/");
    }
  }, [userData]);

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
      const response = await fetch(`/api/games/${gameID}`);
      if (!response.ok || response.status !== 200) {
        setError("Failed to fetch game");
        router.push("/");
      }
      const data = await response.json();
      setGameData(data);
      setName(data.name);
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const changeName = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setName(newValue);
    if (gameData) {
      setGameData({
        ...gameData,
        name: newValue,
      });
    }
  };

  const discardChanges = async () => {
    router.push(`/games/${gameID}`);
  };

  const saveChanges = async () => {
    const themeIds = gameData?.themes.map((theme) => {
      return theme._id;
    });
    const tagIds = gameData?.tags.map((tag) => {
      return tag._id;
    });

    const putData = {
      tags: tagIds,
      themes: themeIds,
      description: gameData?.description,
      name: gameData?.name,
      videoTrailer: gameData?.videoTrailer,
    };

    await fetch(`/api/games/${gameID}`, {
      method: "PUT",
      body: JSON.stringify(putData),
    });

    router.push(`/games/${gameID}`);
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
      <div className="flex justify-center">
        <input
          className="mt-[126px] rounded-[20px] border border-solid border-grey bg-input-bg py-2.5 text-center font-sans text-[56px] font-semibold !outline-none"
          type="text"
          value={name}
          onChange={changeName}
        />
      </div>
      <div className="mx-auto flex w-[80vw] justify-end">
        <DeleteGameComponent gameName={gameData.name} />
      </div>
      <TabsComponent
        mode="edit"
        gameData={gameData}
        setGameData={setGameData}
        admin={true}
      />
      {gameData.tags && gameData.themes ? (
        <TagsComponent
          mode="edit"
          gameData={gameData}
          setGameData={setGameData}
          admin={true}
        />
      ) : null}
      <div className="mx-auto mb-40 mt-24 flex w-[80vw] justify-end">
        <div className="absolute">
          <button
            onClick={discardChanges}
            className="rounded-xl bg-input-border px-6 py-3 font-sans text-2xl font-medium text-blue-primary"
          >
            Discard changes
          </button>
          <button
            onClick={saveChanges}
            className="ml-8 rounded-xl bg-blue-primary px-6 py-3 font-sans text-2xl font-medium text-white"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditGamePage;

//TODO: Change error statement and logic in add and edit trailer
//TODO: Fix styling for Contact Jennifer Ann's, and make it go to another screen once done.
//TODO: Add icons to Add Trailer, Delete Trailer, and Edit Trailer.
//TODO: Create popup for Contact Jennifer Ann's when submitted
//TODO: Make it so clicking the x on the Video Trailer tag lets you delete it.
