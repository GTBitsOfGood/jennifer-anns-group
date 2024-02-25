import { useRouter } from "next/router";
import { useState } from "react";
import { gameSchema, tagSchema, themeSchema } from "@/utils/types";
import { z } from "zod";
import TagsComponent from "@/components/Tags/TagsComponent";
import TabsComponent from "@/components/Tabs/TabsComponent";
import Link from "next/link";
import React from "react";
import DeleteGameComponent from "@/components/DeleteGameComponent/DeleteGameComponent";

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
          setDescription(data.data.descipription);
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
            <div className="flex justify-center">
                <input className="py-2.5 rounded-[20px] border-solid border bg-input-bg !outline-none border-grey font-sans font-semibold text-[56px] text-center mt-[126px]" 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex justify-end w-[80vw] mx-auto">
                <DeleteGameComponent gameName={gameData.name} />
            </div>
            <TabsComponent mode="edit" description={description} setDescription={setDescription} gameData={gameData} />
            <TagsComponent mode="edit" themes={themes} setThemes={setThemes} tags={tags} setTags={setTags} />
            {/* <div className="absolute"> */}
                <div className="flex justify-end w-[80vw] my-24 mx-auto">
                    <Link href={`/games/${gameID}`}>
                        <button className="bg-input-border rounded-xl py-3 px-6 font-sans font-medium text-2xl text-blue-primary">
                            Discard changes
                        </button>
                    </Link>
                    <button className="bg-blue-primary rounded-xl py-3 px-6 font-sans font-medium text-2xl text-white ml-8">
                        Save changes
                    </button>
                </div>
            {/* </div> */}
        </div>
    );
}

export default EditGamePage;