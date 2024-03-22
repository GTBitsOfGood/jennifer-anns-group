import cn from "classnames";
import { useEffect, useRef, useState } from "react";

interface EmbeddedGameProps {
  gameId: string;
}

export default function EmbeddedGame({ gameId }: EmbeddedGameProps) {
  const ref = useRef<HTMLIFrameElement | null>(null);
  const [height, setHeight] = useState("0px");

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

    const observer = new MutationObserver(updateHeight);

    if (iframe.contentWindow?.document.body) {
      observer.observe(iframe.contentWindow.document.body, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      observer.disconnect();
    };
  };

  useEffect(() => {
    window.addEventListener("resize", updateHeight);
    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  return (
    <iframe
      ref={ref}
      onLoad={handleLoad}
      height={height}
      src={`/games/raw/${gameId}`}
      className={cn("m-auto my-6 w-10/12", {
        "border-2 border-solid border-black": height !== "0px",
      })}
    />
  );
}
