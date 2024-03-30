import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import TagsComponent from "@/components/Tags/TagsComponent";
import TabsComponent from "@/components/Tabs/TabsComponent";
import React from "react";
import DeleteGameComponent from "@/components/GameScreen/DeleteGameComponent";
import { populatedGameWithId } from "@/server/db/models/GameModel";
import pageAccessHOC from "@/components/HOC/PageAccess";
import AddEditWebGLComponent from "@/components/GameScreen/AddEditWebGLComponent";

const EditGamePage = () => {
  const router = useRouter();
  const gameID = router.query.id;
  const [gameData, setGameData] = useState<populatedGameWithId>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");

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
      builds: gameData?.builds,
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
      <div className="mx-auto flex w-[75vw] justify-end">
        <DeleteGameComponent gameName={gameData.name} />
      </div>
      <div className="mx-auto my-8 h-[75vh] w-[75vw]">
        <AddEditWebGLComponent gameData={gameData} />
      </div>
      <TabsComponent
        mode="edit"
        gameData={gameData}
        setGameData={setGameData}
        authorized={true}
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

export default pageAccessHOC(EditGamePage);
