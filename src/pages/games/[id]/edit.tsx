import { useRouter } from "next/compat/router";
import { ChangeEvent, useEffect, useState } from "react";
import TagsComponent from "@/components/Tags/TagsComponent";
import TabsComponent from "@/components/Tabs/TabsComponent";
import React from "react";
import pageAccessHOC from "@/components/HOC/PageAccess";
import AddEditWebGLComponent from "@/components/GameScreen/WebGL/AddEditWebGLComponent";
import { useDisclosure } from "@chakra-ui/react";
import DiscardChanges from "@/components/GameScreen/DiscardChanges";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { uploadApplicationFile } from "@/utils/file";
import { v4 as uuidv4 } from "uuid";
import { GameDataState } from "@/components/GameScreen/GamePage";
import { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { getGameById } from "@/server/db/actions/GameAction";
import EditImage from "@/components/GameScreen/WebGL/EditImage";

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
  const gameID = router?.query.id;
  const [curData, setCurData] = useState<GameDataState>(gameData);
  const [name, setName] = useState(gameData?.name);

  const { mutateAsync: getDirectUpload } = useMutation({
    mutationFn: (file: File) => fetch("/api/file").then((res) => res.json()),
  });

  useEffect(() => {
    if (!gameData) {
      router?.replace("/");
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
      "parentingGuide" | "answerKey" | "lesson" | "image",
      string | undefined
    > = {
      parentingGuide: curData?.parentingGuide,
      answerKey: curData?.answerKey,
      lesson: curData?.lesson,
      image: curData?.image,
    };
    const fileInputs: Record<
      "parentingGuide" | "answerKey" | "lesson" | "image",
      File | undefined
    > = {
      parentingGuide: curData?.parentingGuideFile,
      answerKey: curData?.answerKeyFile,
      lesson: curData?.lessonFile,
      image: curData?.imageFile,
    };

    const fileInputsKeys = Object.keys(fileInputs);

    const nonNullFileInputsKeys = fileInputsKeys.filter(
      (k) => fileInputs[k as keyof typeof fileInputs],
    );

    const directUploadUrls = await Promise.all(
      nonNullFileInputsKeys.map((k) =>
        getDirectUpload(fileInputs[k as keyof typeof fileInputs] as File),
      ),
    );

    const fieldDirectUploadUrls: Record<
      string,
      { uploadUrl: string; uploadAuthToken: string }
    > = nonNullFileInputsKeys.reduce((acc, cur, i) => {
      return { ...acc, [cur]: directUploadUrls[i] };
    }, {});

    const storedUrls = await Promise.all(
      nonNullFileInputsKeys.map((key) =>
        uploadApplicationFile(
          fieldDirectUploadUrls[key].uploadUrl,
          fileInputs[key as keyof typeof fileInputs] as File,
          fieldDirectUploadUrls[key].uploadAuthToken,
          uuidv4(),
        ),
      ),
    );

    const fieldStoredUrls: Record<string, string> =
      nonNullFileInputsKeys.reduce((acc, cur, i) => {
        return { ...acc, [cur as keyof typeof fileInputs]: storedUrls[i] };
      }, {});

    const nullFileInputsKeys = Object.keys(fieldInputs).filter(
      (k) => !fieldInputs[k as keyof typeof fieldInputs],
    );
    const nullFileInputsNewValues = nullFileInputsKeys.reduce((acc, cur) => {
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
      ...nullFileInputsNewValues,
      ...fieldStoredUrls,
    };

    await fetch(`/api/games/${gameID}`, {
      method: "PUT",
      body: JSON.stringify(putData),
    });

    if (curData?.preview) {
      router?.push(`/games/${gameID}/preview`);
    } else {
      router?.push(`/games/${gameID}`);
    }
  };

  return (
    <div className="mx-18 my-14 flex flex-col gap-14">
      <div className="flex items-center justify-center gap-3">
        <div className="flex-1"></div>
        <input
          className="flex-1 rounded-2xl border border-solid border-unselected bg-input-bg px-8 py-3 text-center font-sans text-5.5xl font-semibold text-font-1000 !outline-none"
          type="text"
          value={name}
          onChange={changeName}
        />
        <div className="relative flex flex-1 justify-end">
          <EditImage
            imageURL={gameData?.image}
            gameData={curData}
            setGameData={setCurData}
          />
        </div>
      </div>

      <div>
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
      <div className="mb-14 flex justify-end">
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
