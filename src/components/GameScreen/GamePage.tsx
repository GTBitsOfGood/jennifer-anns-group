import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import TabsComponent from "../Tabs/TabsComponent";
import TagsComponent from "../Tags/TagsComponent";
import ContactComponent from "../Tabs/ContactComponent";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { userSchema } from "@/utils/types";
import EmbeddedGame from "@/components/GameScreen/WebGL/EmbeddedGame";
import NotesComponent from "@/components/Tabs/NotesComponent";
import AdminEditButton from "@/components/GameScreen/AdminEditButton";
import { populatedGameWithId } from "@/server/db/models/GameModel";
import {
  AlertDialog,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  useDisclosure,
  ChakraProvider,
} from "@chakra-ui/react";
import chakraTheme from "@/styles/chakraTheme";
import { Button } from "@/components/ui/button";
import wrapPromise from "../wrapPromise";

// Fetch game data and wrap the promise for Suspense
function fetchGameData(gameId: string) {
  if (!gameId) {
    return wrapPromise(
      new Promise<void>((resolve) => {
        resolve();
      }),
    );
  }
  const promise = fetch(`/api/games/${gameId}`).then((res) => {
    return res.json();
  });
  return wrapPromise(promise);
}

let gameDataResource: { [key: string]: ReturnType<typeof wrapPromise> } = {};

export type GameDataState = populatedGameWithId & {
  parentingGuideFile: File | undefined;
  answerKeyFile: File | undefined;
  lessonFile: File | undefined;
  _id: string;
  preview: boolean;
};

interface Props {
  mode: "view" | "preview";
  gameData: GameDataState;
}

const GamePage = ({ mode, gameData }: Props) => {
  const router = useRouter();
  const [curData, setCurData] = useState<GameDataState | undefined>(gameData);
  const [error, setError] = useState("");
  const [visibleAnswer, setVisibleAnswer] = useState(false);
  const { data: session } = useSession();
  const idSchema = z.string().length(24);
  const userDataSchema = userSchema
    .extend({
      _id: idSchema,
    })
    .omit({ hashedPassword: true });
  const currentUser = session?.user;
  const [userData, setUserData] = useState<z.infer<typeof userDataSchema>>();
  const userId = currentUser?._id as string | undefined;

  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const deleteOnRouteChange = useRef<boolean>(true);

  useEffect(() => {
    if (currentUser) {
      setUserData(currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    if (userData && userData.label !== "student") {
      setVisibleAnswer(true);
    } else {
      setVisibleAnswer(false);
    }
  }, [userData]);

  const publishGame = async () => {
    try {
      const themeIds = curData?.themes.map((theme) => theme._id);
      const tagIds = curData?.tags.map((tag) => tag._id);

      const putData = {
        tags: tagIds,
        themes: themeIds,
        description: curData?.description,
        name: curData?.name,
        builds: curData?.builds,
        videoTrailer: curData?.videoTrailer,
        preview: false,
      };

      const response = await fetch(`/api/games/${gameData._id}`, {
        method: "PUT",
        body: JSON.stringify(putData),
      });

      if (!response.ok) {
        setError("Failed to publish game.");
      } else {
        deleteOnRouteChange.current = false;
        router.replace(`/games/${gameData._id}`);
      }
    } catch (error) {
      console.error("Error publishing game:", error);
    }
  };

  const handleCancel = async () => {
    try {
      const response = await fetch(`/api/games/${gameData._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        keepalive: deleteOnRouteChange.current,
      });
      if (!response.ok) {
        setError("Failed to delete game.");
      }
    } catch (error) {
      console.error("Error deleting game:", error);
    }
  };

  useEffect(() => {
    if (mode === "preview") {
      const routeChangeStart = (url: string) => {
        if (deleteOnRouteChange.current) handleCancel();
        router.events.off("routeChangeStart", routeChangeStart);
      };

      const beforeunload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
      };

      const onunload = () => {
        void handleCancel();
      };

      window.addEventListener("beforeunload", beforeunload);
      window.addEventListener("unload", onunload);

      router.events.on("routeChangeStart", routeChangeStart);

      return () => {
        window.removeEventListener("beforeunload", beforeunload);
        window.addEventListener("unload", onunload);
        router.events.off("routeChangeStart", routeChangeStart);
      };
    }
  }, []);

  const loaded = userData && userId;

  // useEffect(() => {
  //   gameDataResource[gameId] = fetchGameData(gameId);
  // }, [gameId]);

  // const data = gameDataResource[gameId]?.read();
  // if (!curData && data) {
  //   if (!data.name) {
  //     deleteOnRouteChange.current = false;
  //     router.replace("/");
  //   }
  //   if (!data.preview && mode == "preview") {
  //     deleteOnRouteChange.current = false;
  //     router.replace(`/games/${gameId}`);
  //   } else {
  //     setCurData(data);
  //   }
  // }

  useEffect(() => {
    console.log(gameData);
    if (!gameData) {
      deleteOnRouteChange.current = false;
      router.replace("/");
    }
    if (!gameData.preview && mode == "preview") {
      deleteOnRouteChange.current = false;
      router.replace(`/games/${gameData._id}`);
    } else {
      setCurData(gameData);
    }
  }, [gameData]);

  if (!curData) {
    return null;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <ChakraProvider theme={chakraTheme}>
      <div>
        {mode === "preview" && (
          <div className="flex h-fit w-full flex-col items-center justify-center bg-blue-bg py-2 font-sans">
            <p className="font-bold">🔍 You are in preview mode.</p>
            <p>Note: Leaving this page will discard your progress.</p>
          </div>
        )}
        <h1 className="mt-[32px] text-center font-sans text-[56px] font-semibold">
          {curData.name}
        </h1>
        {loaded && (
          <>
            {userData.label === "administrator" && (
              <AdminEditButton
                gameId={gameData._id}
                deleteOnRouteChange={deleteOnRouteChange}
              />
            )}
          </>
        )}
        <EmbeddedGame
          gameId={gameData._id as string}
          userData={currentUser}
          gameName={curData.name}
        />
        <TabsComponent
          mode="view"
          gameData={curData}
          setGameData={setCurData}
          authorized={visibleAnswer}
          userData={currentUser}
        />
        {loaded && userData.label !== "administrator" && (
          <NotesComponent gameId={gameData._id} userId={userId} />
        )}
        {loaded && userData.label !== "administrator" && (
          <ContactComponent
            gameName={curData.name}
            userId={userId}
            firstName={userData.firstName}
          />
        )}
        <TagsComponent
          mode="view"
          gameData={curData}
          setGameData={setCurData}
          admin={visibleAnswer}
        />
        {loaded && mode === "preview" && (
          <div className="relative my-10 flex w-11/12 justify-end gap-6 font-sans">
            <div>
              <Button
                type="button"
                onClick={onOpen}
                variant="outline2"
                className="px-6 py-6 text-2xl font-semibold"
              >
                Cancel
              </Button>
              <AlertDialog
                motionPreset="slideInBottom"
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isOpen={isOpen}
                isCentered
              >
                <AlertDialogOverlay />

                <AlertDialogContent
                  border="4px"
                  borderColor="brand.600"
                  height="350"
                  width="450"
                >
                  <div>
                    <AlertDialogCloseButton
                      mr="12px"
                      mt="12px"
                      color="brand.600"
                    />
                  </div>
                  <AlertDialogHeader p="0">
                    <div className="mx-auto flex w-4/5 flex-col items-center">
                      <div className="mt-16 text-center font-sans text-[26px] font-bold leading-tight text-blue-primary">
                        Are you sure you want to cancel?{" "}
                      </div>
                      <div className="mb-6 mt-6 text-center font-sans text-sm font-normal">
                        If you cancel, your uploaded information will be lost.
                        You can edit the page by clicking the edit button.{" "}
                      </div>
                    </div>
                  </AlertDialogHeader>

                  <AlertDialogFooter p="0" justifyContent="center">
                    <div className="mt-4 flex flex-row items-center gap-4">
                      <button
                        onClick={() => router.replace("/games")}
                        className="rounded-xl bg-delete-red px-6 py-3 font-sans font-semibold text-white"
                      >
                        Yes, cancel
                      </button>
                      <button
                        ref={cancelRef}
                        onClick={onClose}
                        className="rounded-xl border-[1px] border-solid border-black px-6 py-3 font-sans font-semibold"
                      >
                        No, return
                      </button>
                    </div>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <Button
              type="button"
              variant="mainblue"
              className="px-6 py-6 text-2xl font-semibold"
              onClick={publishGame}
            >
              Publish
            </Button>
          </div>
        )}
      </div>
    </ChakraProvider>
  );
};

export default GamePage;
