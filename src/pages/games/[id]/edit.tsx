import { useRouter } from "next/router";
import { useState } from "react";
import { gameSchema } from "@/utils/types";
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
            <h1 className="font-sans font-semibold text-[56px] text-center mt-[126px]">{gameData.name}</h1>
            <div className="flex justify-end w-[80vw] mx-auto">
                <DeleteGameComponent gameData={gameData}/>
            </div>
            <TabsComponent gameData={gameData} />
            <TagsComponent gameData={gameData} />
            <div className="flex justify-end w-[80vw] mx-auto">
                <Link href={`/games/${gameID}`}>
                    <button className="bg-input-border rounded-xl py-3 px-6 font-sans font-medium text-2xl text-blue-primary">Discard changes</button>
                </Link>
                <Link href="#">
                    <button className="bg-blue-primary rounded-xl py-3 px-6 font-sans font-medium text-2xl text-white ml-8">Save changes</button>
                </Link>
            </div>
        </div>
    );
}

export default EditGamePage;