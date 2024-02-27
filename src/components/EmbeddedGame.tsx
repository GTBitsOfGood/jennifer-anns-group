import { getBuildFileUrl } from "@/utils/file";
import { Spinner } from "@chakra-ui/spinner";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

interface EmbeddedGameProps {
  gameId: string;
}

export default function EmbeddedGame({ gameId }: EmbeddedGameProps) {
  const { unityProvider, loadingProgression, isLoaded, initialisationError } =
    useUnityContext({
      loaderUrl: getBuildFileUrl(gameId, "loader"),
      dataUrl: getBuildFileUrl(gameId, "data"),
      frameworkUrl: getBuildFileUrl(gameId, "framework"),
      codeUrl: getBuildFileUrl(gameId, "code"),
    });
  const [devicePixelRatio, setDevicePixelRatio] = useState(
    window.devicePixelRatio,
  );

  // Update devicePixelRatio when it changes
  useEffect(() => {
    const updateDevicePixelRatio = () => {
      setDevicePixelRatio(window.devicePixelRatio);
    };
    const mediaMatcher = window.matchMedia(
      `screen and (resolution: ${devicePixelRatio}dppx)`,
    );
    mediaMatcher.addEventListener("change", updateDevicePixelRatio);
    return () => {
      mediaMatcher.removeEventListener("change", updateDevicePixelRatio);
    };
  }, [devicePixelRatio]);

  return (
    <div className="relative m-auto my-6 grid w-10/12 border-2 border-solid border-black">
      {!isLoaded && (
        <div className="absolute top-1/2 flex w-full -translate-y-1/2 transform flex-col items-center">
          <Spinner
            className="mb-5 h-10 w-10"
            thickness="4px"
            emptyColor="#98A2B3"
            color="#164C96"
          />
          <p className="text-xl">
            Loading Game... {Math.round(loadingProgression * 100)}%
          </p>
        </div>
      )}
      {initialisationError && (
        <div className="absolute top-1/2 flex w-full -translate-y-1/2 transform flex-col items-center">
          <p className="text-xl">Failed to load game</p>
        </div>
      )}
      <div
        className={classNames("w-full", {
          invisible: !isLoaded,
        })}
      >
        <Unity
          unityProvider={unityProvider}
          devicePixelRatio={devicePixelRatio}
          className="w-full"
        />
      </div>
    </div>
  );
}
