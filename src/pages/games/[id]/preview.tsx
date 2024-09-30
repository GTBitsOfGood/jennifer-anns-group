import GamePage from "@/components/GameScreen/GamePage";
import React from "react";
import { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { getGameById } from "@/server/db/actions/GameAction";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const data = await getGameById(ctx.query.id as string);
    const gameData = JSON.parse(JSON.stringify(data));
    return {
      props: {
        gameData,
      },
    };
  } catch (error) {
    console.error("Error fetching game data:", error);
    return {
      props: {
        gameData: null,
      },
    };
  }
};

function PreviewGame({
  gameData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <GamePage mode="preview" gameData={gameData} />;
}

export default PreviewGame;
