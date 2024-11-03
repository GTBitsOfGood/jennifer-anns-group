import cn from "classnames";
import { useEffect, useRef, useState } from "react";
import { useAnalytics } from "@/context/AnalyticsContext";
import { userDataSchema } from "@/components/ProfileModal/ProfileModal";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { GameDataState } from "@/components/GameScreen/GamePage";
import Image from "next/image";

interface EmbeddedGameProps {
  gameId: string;
  userData: z.infer<typeof userDataSchema>;
  gameData: GameDataState;
}

export default function EmbeddedGame({
  gameId,
  userData,
  gameData,
}: EmbeddedGameProps) {
  const ref = useRef<HTMLIFrameElement | null>(null);
  const [height, setHeight] = useState("725px");
  const { data: session, status: sessionStatus } = useSession();
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const { analyticsLogger } = useAnalytics();
  const updateHeight = () => {
    const iframe = ref.current;
    if (!iframe) return;

    const frameHeight = iframe.contentWindow?.document.body.scrollHeight;
    if (frameHeight) {
      setHeight(frameHeight + "px");
    }
  };

  const handleLoad = () => {
    const iframe = ref.current;
    if (!iframe) return;

    setIframeLoaded(true);

    const observer = new MutationObserver(updateHeight);

    if (iframe.contentWindow?.document) {
      observer.observe(iframe.contentWindow.document, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      observer.disconnect();
    };
  };

  useEffect(() => {
    if (iframeLoaded && sessionStatus == "authenticated" && userData?.tracked) {
      // Analytics stuff
      const properties = {
        userId: userData?._id ?? "Unauthenticated",
        userGroup: userData?.label ?? "None",
        createdDate: Date(),
        gameName: gameData.name,
      };
      analyticsLogger.logCustomEvent("Visit", "game", properties);
    }
  }, [iframeLoaded, sessionStatus]);

  useEffect(() => {
    if (iframeLoaded) {
      updateHeight();
    }
  }, [iframeLoaded]);

  useEffect(() => {
    if (gameData.remoteUrl) return;
    const iframeWidth = ref.current?.offsetWidth;
    if (iframeWidth) {
      setHeight(`${iframeWidth / 2}px`);
    }
    window.addEventListener("resize", updateHeight);
    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  const renderContent = () => {
    switch (true) {
      case gameData.webGLBuild:
        return (
          <iframe
            ref={ref}
            onLoad={handleLoad}
            height={height}
            src={`/games/${gameId}/raw`}
            className={cn("", {
              "border-2 border-solid border-black": height !== "0px",
            })}
          />
        );

      case gameData.remoteUrl:
        return (
          <iframe
            ref={ref}
            // onLoad={handleLoad}
            height={height}
            src={gameData.builds?.find((build) => build.type == "remote")?.link}
            className={cn("", {
              "border-2 border-solid border-black": height !== "0px",
            })}
          />
        );

      default:
        return (
          <div className="flex h-game flex-col items-center justify-center border-2 border-solid border-black">
            <Image
              src={`/orange_heart.svg`}
              alt="No data"
              width={90}
              height={70}
            />
            <div className="mt-4 text-center text-2xl font-semibold text-orange-primary">
              This game is not playable from the browser.
            </div>
            <div className="text-center text-gray-text">
              Find download files in the <b>Game Builds</b> tab below.
            </div>
          </div>
        );
    }
  };

  return renderContent();
}
