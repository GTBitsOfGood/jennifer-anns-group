import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import TabsComponent from "../../../components/Tabs/TabsComponent";
import TagsComponent from "../../../components/Tags/TagsComponent";
import ContactComponent from "../../../components/Tabs/ContactComponent";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { userSchema } from "@/utils/types";
import EmbeddedGame from "@/components/EmbeddedGame";
import NotesComponent from "@/components/Tabs/NotesComponent";
import { populatedGameWithId } from "@/server/db/models/GameModel";
import AdminEditButton from "@/components/GameScreen/AdminEditButton";
import { Button } from "@/components/ui/button";
import { es } from "@faker-js/faker";
import { X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  useDisclosure,
  ChakraProvider,
} from "@chakra-ui/react";
import chakraTheme from "@/styles/chakraTheme";

const GamePreviewPage = () => {
  const gameId = useRouter().query.id as string;
  const [gameData, setGameData] = useState<populatedGameWithId>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session } = useSession();
  const idSchema = z.string().length(24);
  const [visibleAnswer, setVisibleAnswer] = useState(false);
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

  const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    if (userData && userData.label !== "student") {
      setVisibleAnswer(true);
    } else {
      setVisibleAnswer(false);
    }
  }, [userData]);
  useEffect(() => {
    if (currentUser) {
      getUserData();
    }
  }, [currentUser]);

  async function getUserData() {
    try {
      const response = await fetch(`/api/users/${currentUser?._id}`);
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error getting user:", error);
    }
  }

  const getGame = async () => {
    try {
      const response = await fetch(`/api/games/${gameId}`);
      if (!response.ok) {
        setError("Failed to fetch game");
        router.push("/");
      }
      const data = await response.json();
      setGameData(data);
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (gameId && loading) {
    getGame();
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (loading) {
    return <></>;
  }

  if (!gameData) {
    return <div>Game does not exist</div>;
  }

  const loaded = userData && userId;

  const publishGame = async () => {
    try {
      const themeIds = gameData?.themes.map((theme) => {
        return theme._id;
      });
      const tagIds = gameData?.tags.map((tag) => {
        return tag._id;
      });

      const putData = {
        tags: tagIds,
        themes: themeIds,
        description: gameData?.description,
        name: gameData?.name,
        builds: gameData?.builds,
        videoTrailer: gameData?.videoTrailer,
        preview: false,
      };

      const response = await fetch(`/api/games/${gameId}`, {
        method: "PUT",
        body: JSON.stringify(putData),
      });

      if (!response.ok) {
        setError("Failed to publish game.");
      } else {
        router.replace(`/games/${gameId}`);
      }
    } catch (error) {
      console.error("Error setting game as preview:", error);
    }
  };

  const handleCancel = async () => {
    try {
      const response = await fetch(`/api/games/${gameId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        setError("Failed to delete game.");
      } else {
        router.replace("/games");
      }
    } catch (error) {
      console.error("Error deleting game:", error);
    }
  };

  return (
    <div>
      <div className="flex h-10 w-full items-center justify-center bg-blue-bg font-sans font-bold">
        <p>🔍 You are in preview mode.</p>
      </div>
      <h1 className="mt-[32px] text-center font-sans text-[56px] font-semibold">
        {gameData.name}
      </h1>
      {loaded && (
        <>
          {userData.label === "administrator" && (
            <AdminEditButton gameId={gameId} />
          )}
        </>
      )}
      <EmbeddedGame gameId={gameId as string} />
      <TabsComponent
        mode="view"
        gameData={gameData}
        authorized={visibleAnswer}
      />
      {loaded && userData.label !== "administrator" && (
        <NotesComponent gameId={gameId} userId={userId} />
      )}
      {loaded && userData.label !== "administrator" && <ContactComponent />}
      <TagsComponent mode="view" gameData={gameData} admin={visibleAnswer} />
      {loaded && (
        <div className="relative my-10 flex w-11/12 justify-end gap-6 font-sans">
          <ChakraProvider theme={chakraTheme}>
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
                      disabled={deleting}
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
                        onClick={handleCancel}
                        className="rounded-xl bg-delete-red px-6 py-3 font-sans font-semibold text-white"
                        disabled={deleting}
                      >
                        Yes, cancel
                      </button>
                      <button
                        ref={cancelRef}
                        onClick={onClose}
                        disabled={deleting}
                        className="rounded-xl border-[1px] border-solid border-black px-6 py-3 font-sans font-semibold"
                      >
                        No, return
                      </button>
                    </div>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </ChakraProvider>

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
  );
};

export default GamePreviewPage;
