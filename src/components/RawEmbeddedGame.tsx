import { ChakraProvider, Spinner } from "@chakra-ui/react";
import chakraTheme from "@/styles/chakraTheme";
import { useEffect, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { CLOUDFLARE_URL } from "@/utils/consts";
import { BuildFileType, buildFileTypes } from "@/pages/upload-build";

function getBuildFileUrl(gameId: string, type: BuildFileType) {
  const fileName = `${gameId}/${
    buildFileTypes[type as keyof typeof buildFileTypes]
  }`;

  return `${CLOUDFLARE_URL}/webgl-builds/${fileName}`;
}

interface RawEmbeddedGameProps {
  gameId: string;
}

export default function RawEmbeddedGame({ gameId }: RawEmbeddedGameProps) {
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
    <ChakraProvider theme={chakraTheme}>
      <div className="relative">
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
        <Unity
          unityProvider={unityProvider}
          devicePixelRatio={devicePixelRatio}
          className="w-full"
          tabIndex={1}
        />
      </div>
    </ChakraProvider>
  );
}
