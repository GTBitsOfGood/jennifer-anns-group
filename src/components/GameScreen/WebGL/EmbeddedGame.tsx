import { Button } from "@/components/ui/button";
import cn from "classnames";
import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";

interface EmbeddedGameProps {
  gameId: string;
}

export default function EmbeddedGame({ gameId }: EmbeddedGameProps) {
  const ref = useRef<HTMLIFrameElement | null>(null);
  const [height, setHeight] = useState("0px");
  // const [loadGame, setLoadGame] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

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
    if (iframeLoaded) {
      updateHeight();
    }
  }, [iframeLoaded]);

  useEffect(() => {
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
