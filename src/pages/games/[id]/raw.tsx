import { useRouter } from "next/router";
import { useEffect } from "react";
import RawEmbeddedGame from "@/components/GameScreen/WebGL/RawEmbeddedGame";

const GamePage = () => {
  const gameId = useRouter().query.id;

  useEffect(() => {
    const body = document.querySelector("body");
    if (body === null) {
      return;
    }

    body.classList.add("overflow-hidden");
  }, []);

  if (!gameId || typeof window === "undefined") {
    console.log("gameId", gameId);
    console.log("window", typeof window);
    return <></>;
  }

  return <RawEmbeddedGame gameId={gameId as string} />;
};

export default GamePage;
