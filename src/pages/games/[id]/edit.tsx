import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { tagSchema, themeSchema, userSchema } from "@/utils/types";
import { z } from "zod";
import TagsComponent from "@/components/Tags/TagsComponent";
import TabsComponent from "@/components/Tabs/TabsComponent";
import React from "react";
import DeleteGameComponent from "@/components/GameComponent/DeleteGameComponent";
import { populatedGame } from "@/server/db/models/GameModel";
import { useSession } from "next-auth/react";

export const themeDataSchema = themeSchema.extend({
  _id: z.string().length(24),
});

export const tagDataSchema = tagSchema.extend({
  _id: z.string().length(24),
});

const EditGamePage = () => {
  const router = useRouter();
  const gameID = router.query.id;
  const [gameData, setGameData] = useState<populatedGame>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [themes, setThemes] = useState<z.infer<typeof themeDataSchema>[]>();
  const [tags, setTags] = useState<z.infer<typeof tagDataSchema>[]>();
  const [description, setDescription] = useState("");

  const idSchema = z.string().length(24);

  const userDataSchema = userSchema
    .extend({
      _id: idSchema,
    })
    .omit({ hashedPassword: true });

  const { data: session } = useSession();
  const currentUser = session?.user;
  const [userData, setUserData] = useState<z.infer<typeof userDataSchema>>();

  // useEffect(() => {
  //   if (!session) {
  //     router.push("/");
  //   }
  // }, [session]);

  useEffect(() => {
    if (currentUser) {
      getUserData();
    }
  }, [currentUser]);

  // useEffect(() => {
  //   if (userData && userData.label !== "administrator") {
  //     router.push("/");
  //   }
  // }, [userData]);

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
      if (!response.ok) {
        setError("Failed to fetch game");
      }
      const data = await response.json();
      setGameData(data);
      setName(data.name);
      setThemes(data.themes);
      setTags(data.tags);
      setDescription(data.description);
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const discardChanges = async () => {
    router.push(`/games/${gameID}`);
  };

  const saveChanges = async () => {
    const themeIds = themes?.map((theme) => {
      return theme._id;
    });
    const tagIds = tags?.map((tag) => {
      return tag._id;
    });

    const changes = {
      name: name,
      description: description,
      themes: themeIds,
      tags: tagIds,
    };

    await fetch(`/api/games/${gameID}`, {
      method: "PUT",
      body: JSON.stringify(changes),
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
          onChange={(e) => setName(e.target.value)}
        />
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
