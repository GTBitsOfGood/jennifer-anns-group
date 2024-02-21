import { getBuildFileUrl } from "@/utils/file";
import { Unity, useUnityContext } from "react-unity-webgl";

export default function EmbeddedGame() {
  const { unityProvider } = useUnityContext({
    loaderUrl: getBuildFileUrl("1", "loader"),
    dataUrl: getBuildFileUrl("1", "data"),
    frameworkUrl: getBuildFileUrl("1", "framework"),
    codeUrl: getBuildFileUrl("1", "code"),
  });

  return (
    <>
      <Unity unityProvider={unityProvider} />
    </>
  );
}
