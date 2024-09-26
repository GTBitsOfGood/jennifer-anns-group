import GamePage from "@/components/GameScreen/GamePage";
import React, { Suspense } from "react";

function ViewGame() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="h-24 w-24 animate-ping rounded-full bg-orange-primary"></div>
        </div>
      }
    >
      <GamePage mode="view" />
    </Suspense>
  );
}

export default ViewGame;
