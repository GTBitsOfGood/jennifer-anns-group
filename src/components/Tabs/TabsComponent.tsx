import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  ChakraProvider,
} from "@chakra-ui/react";
import chakraTheme from "@/styles/chakraTheme";
import { populatedGameWithId } from "@/server/db/models/GameModel";
import { ChangeEvent, Dispatch, useState } from "react";
import Image from "next/image";
import { buildSchema } from "@/utils/types";
import { z } from "zod";
import { Download } from "lucide-react";

interface Props {
  mode: string;
  gameData: populatedGameWithId;
  setGameData?: Dispatch<populatedGameWithId>;
}

export default function TabsComponent({ mode, gameData, setGameData }: Props) {
  const [description, setDescription] = useState(gameData.description);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setDescription(newValue);
    if (setGameData) {
      setGameData({
        ...gameData,
        description: newValue,
      });
    }
  };

  return (
    <ChakraProvider theme={chakraTheme}>
      <div>
        <Tabs colorScheme="brand" className="m-auto w-5/6 font-sans">
          <TabList>
            <Tab>Description</Tab>
            {gameData.parentingGuide ? <Tab>Parenting Guide</Tab> : null}
            {gameData.lesson ? <Tab>Lesson Plan</Tab> : null}
            <Tab>Game Builds</Tab>
          </TabList>
          <TabPanels className="mb-12 mt-8 text-gray-500">
            <TabPanel p="0px">
              {mode === "edit" ? (
                <div className="rounded-[20px] border border-solid border-grey bg-input-bg">
                  <textarea
                    className="h-52 w-full !resize-none rounded-[20px] border border-[20px] border-solid border-transparent bg-input-bg font-sans !outline-none"
                    value={description}
                    onChange={handleChange}
                  />
                </div>
              ) : (
                <p>{gameData.description}</p>
              )}
            </TabPanel>
            {gameData.parentingGuide ? (
              <TabPanel>Parenting Guide</TabPanel>
            ) : null}
            {gameData.lesson ? <TabPanel>Lesson Plan</TabPanel> : null}
            <TabPanel p="0px">
              {mode === "edit" ? (
                <div>edit builds</div>
              ) : (
                <>
                  {gameData.builds &&
                    gameData?.builds.map(
                      (data: z.infer<typeof buildSchema>, key: number) => (
                        <div className="mb-10" key={-1}>
                          <div key={key} className="mb-10 flex flex-row gap-5">
                            <div className="col-span-1 flex w-14 min-w-14">
                              <Image
                                src={`/gamebuilds/${data.type}.png`}
                                height={30}
                                width={36}
                                objectFit="contain"
                                className="mx-2 self-center"
                                alt=""
                              />
                            </div>
                            <div className="flex flex-col justify-center">
                              <div
                                className="flex cursor-pointer flex-row gap-2 font-semibold text-blue-primary"
                                onClick={() => window.open(data.link, "_blank")}
                              >
                                <Download />
                                Download
                              </div>
                            </div>
                          </div>
                          {data.instructions && (
                            <div className="-mt-4 mb-6 flex flex-row">
                              <div className="min-w-[78px] max-w-[78px]"></div>
                              <div className="flex flex-col gap-2">
                                <p className="text-sm text-blue-primary">
                                  Instructions
                                </p>
                                <p className="text-sm">{data.instructions}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ),
                    )}
                </>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </ChakraProvider>
  );
}
