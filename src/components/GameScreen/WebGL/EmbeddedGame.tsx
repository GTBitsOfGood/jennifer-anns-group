import cn from "classnames";
import { useEffect, useRef, useState } from "react";
import { useAnalytics } from "@/context/AnalyticsContext";
import { userDataSchema } from "@/components/ProfileModal/ProfileModal";
import { z } from "zod";

interface EmbeddedGameProps {
  gameId: string;
  userData: z.infer<typeof userDataSchema>;
  gameName: string;
}

export default function EmbeddedGame({
  gameId,
  userData,
  gameName,
}: EmbeddedGameProps) {
  const ref = useRef<HTMLIFrameElement | null>(null);
  const [height, setHeight] = useState("725px");
  // const [loadGame, setLoadGame] = useState(false);
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
    //Analytics stuff
    const properties = {
      userId: userData._id,
      userGroup: userData.label,
      createdDate: Date(),
      gameName: gameName,
      resourceName: "webgl",
      resourceUrl: "",
      downloadSrc: window.location.href,
    };
    analyticsLogger.logCustomEvent("Download", "game", properties);
    return () => {
      observer.disconnect();
    };
  };

  useEffect(() => {
    if (iframeLoaded) {
      updateHeight();
    }
  }, [iframeLoaded]);

  useEffect(() => {
    const iframeWidth = ref.current?.offsetWidth;
    if (iframeWidth) {
      setHeight(`${iframeWidth / 2}px`);
    }
    window.addEventListener("resize", updateHeight);
    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  // const RunGame = () => (
  //   <div className="m-auto my-6 flex aspect-video w-10/12 items-center justify-center border-2 border-solid border-black">
  //     <Button
  //       type="button"
  //       variant="mainblue"
  //       className="flex h-12 rounded-xl text-lg font-semibold text-white"
  //       onClick={() => {
  //         setLoadGame(true);
  //       }}
  //     >
  //       <div className="flex items-center gap-2 font-sans">
  //         <p>Run Game</p>
  //         <Play />
  //       </div>
  //     </Button>
  //   </div>
  // );

  return (
    <iframe
      ref={ref}
      onLoad={handleLoad}
      height={height}
      src={`/games/${gameId}/raw`}
      className={cn("m-auto my-6 w-10/12", {
        "border-2 border-solid border-black": height !== "0px",
      })}
    />
  );
}
