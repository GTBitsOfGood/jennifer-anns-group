// pages/games/[id]/raw.tsx

import { useEffect } from "react";
import RawEmbeddedGame from "@/components/GameScreen/WebGL/RawEmbeddedGame";
import { GetServerSideProps } from "next";

interface GamePageProps {
  gameId: string;
}

const GamePage: React.FC<GamePageProps> = ({ gameId }) => {
  useEffect(() => {
    const body = document.querySelector("body");
    if (body) {
      body.classList.add("overflow-hidden");
    }
  }, []);

  return <RawEmbeddedGame gameId={gameId} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as any;

  if (!id || Array.isArray(id)) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      gameId: id,
    },
  };
};

export default GamePage;
