import { getBuildFileUrl } from "@/utils/file";
import { Unity, useUnityContext } from "react-unity-webgl";

interface EmbeddedGameProps {
  gameId: string;
}

export default function EmbeddedGame({ gameId }: EmbeddedGameProps) {
  const { unityProvider } = useUnityContext({
    loaderUrl: getBuildFileUrl(gameId, "loader"),
    dataUrl: getBuildFileUrl(gameId, "data"),
    frameworkUrl: getBuildFileUrl(gameId, "framework"),
    codeUrl: getBuildFileUrl(gameId, "code"),
  });

  return (
    <>
      <Unity unityProvider={unityProvider} className="w-full" />
    </>
  );
}
