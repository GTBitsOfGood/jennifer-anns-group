import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import TagsComponent from "@/components/Tags/TagsComponent";
import TabsComponent from "@/components/Tabs/TabsComponent";
import React from "react";
import { populatedGameWithId } from "@/server/db/models/GameModel";
import pageAccessHOC from "@/components/HOC/PageAccess";
import AddEditWebGLComponent from "@/components/GameScreen/WebGL/AddEditWebGLComponent";
import DeleteComponentModal from "@/components/DeleteComponentModal";
import { useDisclosure } from "@chakra-ui/react";
import DiscardChanges from "@/components/GameScreen/DiscardChanges";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { uploadApplicationFile } from "@/utils/file";
import { v4 as uuidv4 } from "uuid";
import { GameDataState } from "@/components/GameScreen/GamePage";

const EditGamePage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const gameID = router.query.id;
  const [gameData, setGameData] = useState<GameDataState | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");

  const { mutateAsync: getDirectUpload } = useMutation({
    mutationFn: (file: File) => fetch("/api/file").then((res) => res.json()),
  });

  const getGame = async () => {
    try {
      const response = await fetch(`/api/games/${gameID}`);
      if (!response.ok || response.status !== 200) {
        setError("Failed to fetch game");
        router.push("/");
      }
      const data = await response.json();
      setGameData(data);
      setName(data.name);
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const changeName = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setName(newValue);
    if (gameData) {
      setGameData({
        ...gameData,
        name: newValue,
      });
    }
  };

  const saveChanges = async () => {
    const fieldInputs: Record<
      "parentingGuide" | "answerKey" | "lesson",
      string | undefined
    > = {
      parentingGuide: gameData?.parentingGuide,
      answerKey: gameData?.answerKey,
      lesson: gameData?.lesson,
    };
    const pdfInputs: Record<
      "parentingGuide" | "answerKey" | "lesson",
      File | undefined
    > = {
      parentingGuide: gameData?.parentingGuideFile,
      answerKey: gameData?.answerKeyFile,
      lesson: gameData?.lessonFile,
    };

    const pdfInputsKeys = Object.keys(pdfInputs);

    const nonNullPdfInputsKeys = pdfInputsKeys.filter(
      (k) => pdfInputs[k as keyof typeof pdfInputs],
    );

    const directUploadUrls = await Promise.all(
      nonNullPdfInputsKeys.map((k) =>
        getDirectUpload(pdfInputs[k as keyof typeof pdfInputs] as File),
      ),
    );

    const fieldDirectUploadUrls: Record<
      string,
      { uploadUrl: string; uploadAuthToken: string }
    > = nonNullPdfInputsKeys.reduce((acc, cur, i) => {
      return { ...acc, [cur]: directUploadUrls[i] };
    }, {});

    const storedUrls = await Promise.all(
      nonNullPdfInputsKeys.map((key) =>
        uploadApplicationFile(
          fieldDirectUploadUrls[key].uploadUrl,
          pdfInputs[key as keyof typeof pdfInputs] as File,
          fieldDirectUploadUrls[key].uploadAuthToken,
          uuidv4(),
        ),
      ),
    );

    const fieldStoredUrls: Record<string, string> = nonNullPdfInputsKeys.reduce(
      (acc, cur, i) => {
        return { ...acc, [cur as keyof typeof pdfInputs]: storedUrls[i] };
      },
      {},
    );

    const nullPdfInputsKeys = Object.keys(fieldInputs).filter(
      (k) => !fieldInputs[k as keyof typeof fieldInputs],
    );
    const nullPdfInputsNewValues = nullPdfInputsKeys.reduce((acc, cur) => {
      return {
        ...acc,
        [cur]: "",
      };
    }, {});

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
      ...nullPdfInputsNewValues,
      ...fieldStoredUrls,
    };

    await fetch(`/api/games/${gameID}`, {
      method: "PUT",
      body: JSON.stringify(putData),
    });

    if (gameData?.preview) {
      router.push(`/games/${gameID}/preview`);
    } else {
      router.push(`/games/${gameID}`);
    }
  };

  if (gameID && loading) {
    getGame();
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!gameData) {
    return <div>Game does not exist</div>;
  }

  return (
    <div>
      <div className="flex justify-center">
        <input
          className="mt-[126px] rounded-[20px] border border-solid border-grey bg-input-bg py-2.5 text-center font-sans text-[56px] font-semibold !outline-none"
          type="text"
          value={name}
          onChange={changeName}
        />
      </div>
      {!gameData.preview && (
        <div className="mx-auto flex w-[75vw] justify-end">
          <button
            onClick={onOpen}
            className="mt-1 rounded-md bg-delete-red px-[17px] py-2 font-sans text-xl font-semibold text-white"
          >
            Delete Page
          </button>
          <DeleteComponentModal
            deleteType="game"
            isOpen={isOpen}
            onClose={onClose}
            gameData={gameData}
            setGameData={setGameData}
          />
        </div>
      )}

      <div className="mx-auto my-8 h-[75vh] w-[75vw]">
        <AddEditWebGLComponent gameData={gameData} />
      </div>
      <TabsComponent
        mode="edit"
        gameData={gameData}
        setGameData={setGameData}
        authorized={true}
      />
      {gameData.tags && gameData.themes ? (
        <TagsComponent
          mode="edit"
          gameData={gameData}
          setGameData={setGameData}
          admin={true}
        />
      ) : null}
      <div className="mx-auto mb-40 mt-24 flex w-[80vw] justify-end">
        <div className="absolute flex flex-row gap-10">
          <DiscardChanges gameID={gameID} preview={gameData.preview} />
          <Button
            onClick={saveChanges}
            variant="mainblue"
            className="px-5 py-6 text-xl font-semibold"
          >
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default pageAccessHOC(EditGamePage);
