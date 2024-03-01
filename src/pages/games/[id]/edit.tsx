import { useRouter } from "next/router";
import { useState } from "react";
import { gameSchema, tagSchema, themeSchema } from "@/utils/types";
import { z } from "zod";
import TagsComponent from "@/components/Tags/TagsComponent";
import TabsComponent from "@/components/Tabs/TabsComponent";
import Link from "next/link";
import React from "react";
import DeleteGameComponent from "@/components/GameComponent/DeleteGameComponent";

const EditGamePage = () => {
  const gameID = useRouter().query.id;
  const [gameData, setGameData] = useState<z.infer<typeof gameSchema>>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [themes, setThemes] = useState<z.infer<typeof themeSchema>[]>();
  const [tags, setTags] = useState<z.infer<typeof tagSchema>[]>();
  const [description, setDescription] = useState("");

  const getGame = async () => {
    try {
      const response = await fetch(`/api/games/${gameID}`);
      if (!response.ok) {
        setError("Failed to fetch game");
      }
      const data = await response.json();
      setGameData(data.data);
      setName(data.data.name);
      setThemes(data.data.themes);
      setTags(data.data.tags);
      setDescription(data.data.description);
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const saveChanges = async () => {};

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
        <span
          contentEditable="true"
          className="mt-[126px] max-w-[50vw] rounded-[20px] border border-solid border-grey bg-input-bg px-8 py-2.5 text-center font-sans text-[56px] font-semibold !outline-none"
          onChange={(e) => setName(e.currentTarget.textContent || "")}
        >
          {" "}
          {name}{" "}
        </span>
      </div>
      <div className="mx-auto flex w-[80vw] justify-end">
        <DeleteGameComponent gameName={gameData.name} />
      </div>
      <TabsComponent
        mode="edit"
        description={description}
        setDescription={setDescription}
        gameData={gameData}
      />
      {tags && themes ? (
        <TagsComponent
          mode="edit"
          themes={themes}
          setThemes={setThemes}
          tags={tags}
          setTags={setTags}
        />
      ) : null}
      {/* <div className="absolute"> */}
      <div className="mx-auto my-24 flex w-[80vw] justify-end">
        <Link href={`/games/${gameID}`}>
          <button className="rounded-xl bg-input-border px-6 py-3 font-sans text-2xl font-medium text-blue-primary">
            Discard changes
          </button>
        </Link>
        <button
          onClick={saveChanges}
          className="ml-8 rounded-xl bg-blue-primary px-6 py-3 font-sans text-2xl font-medium text-white"
        >
          Save changes
        </button>
      </div>
      {/* </div> */}
    </div>
  );
};

export default EditGamePage;
