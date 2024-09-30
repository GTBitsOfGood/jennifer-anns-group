import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
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
import { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { getGameById } from "@/server/db/actions/GameAction";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const data = await getGameById(ctx.query.id as string);
    const gameData = JSON.parse(JSON.stringify(data));
    return {
      props: {
        gameData,
      },
    };
  } catch (error) {
    console.error("Error fetching game data:", error);
    return {
      props: {
        gameData: null,
      },
    };
  }
};

const EditGamePage = ({
  gameData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const gameID = router.query.id;
  const [curData, setCurData] = useState<GameDataState>(gameData);
  const [name, setName] = useState(gameData.name);

  const { mutateAsync: getDirectUpload } = useMutation({
    mutationFn: (file: File) => fetch("/api/file").then((res) => res.json()),
  });

  useEffect(() => {
    if (!gameData) {
      router.replace("/");
    }
    setCurData(gameData);
  }, [gameData]);

  const changeName = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setName(newValue);
    if (curData) {
      setCurData({
        ...curData,
        name: newValue,
      });
    }
  };

  const saveChanges = async () => {
    const fieldInputs: Record<
      "parentingGuide" | "answerKey" | "lesson",
      string | undefined
    > = {
      parentingGuide: curData?.parentingGuide,
      answerKey: curData?.answerKey,
      lesson: curData?.lesson,
    };
    const pdfInputs: Record<
      "parentingGuide" | "answerKey" | "lesson",
      File | undefined
    > = {
      parentingGuide: curData?.parentingGuideFile,
      answerKey: curData?.answerKeyFile,
      lesson: curData?.lessonFile,
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

    const themeIds = curData?.themes.map((theme) => {
      return theme._id;
    });
    const tagIds = curData?.tags.map((tag) => {
      return tag._id;
    });

    const putData = {
      tags: tagIds,
      themes: themeIds,
      description: curData?.description,
      name: curData?.name,
      builds: curData?.builds,
      videoTrailer: curData?.videoTrailer,
      ...nullPdfInputsNewValues,
      ...fieldStoredUrls,
    };

    await fetch(`/api/games/${gameID}`, {
      method: "PUT",
      body: JSON.stringify(putData),
    });

    if (curData?.preview) {
      router.push(`/games/${gameID}/preview`);
    } else {
      router.push(`/games/${gameID}`);
    }
  };

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
      {!curData.preview && (
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
            gameData={curData}
            setGameData={setCurData}
          />
        </div>
      )}

      <div className="mx-auto my-8 h-[75vh] w-[75vw]">
        <AddEditWebGLComponent gameData={curData} />
      </div>
      <TabsComponent
        mode="edit"
        gameData={curData}
        setGameData={setCurData}
        authorized={true}
        userData={undefined}
      />
      {curData.tags && curData.themes ? (
        <TagsComponent
          mode="edit"
          gameData={curData}
          setGameData={setCurData}
          admin={true}
        />
      ) : null}
      <div className="mx-auto mb-40 mt-24 flex w-[80vw] justify-end">
        <div className="absolute flex flex-row gap-10">
          <DiscardChanges gameID={gameID} preview={curData.preview} />
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
