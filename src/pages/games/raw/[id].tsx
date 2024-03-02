import { useRouter } from "next/router";
import { useEffect } from "react";
import RawEmbeddedGame from "@/components/RawEmbeddedGame";

const GamePage = () => {
  const gameId = useRouter().query.id;

  if (!gameId || typeof window === "undefined") {
    return <></>;
  }

  useEffect(() => {
    const body = document.querySelector("body");
    if (body === null) {
      return;
    }

    body.classList.add("overflow-hidden");
  }, []);

  return <RawEmbeddedGame gameId={gameId as string} />;
};

export default GamePage;
