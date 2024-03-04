import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import styles from "@/styles/tabs.module.css";
import { populatedGameWithId } from "@/server/db/models/GameModel";
import { ChangeEvent, Dispatch, useState } from "react";

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
    <div>
      <Tabs colorScheme="brand" className={styles.tabs}>
        <TabList className={styles.tabTitle}>
          <Tab>Description</Tab>
          {gameData.parentingGuide ? <Tab>Parenting Guide</Tab> : null}
          {gameData.lesson ? <Tab>Lesson Plan</Tab> : null}
        </TabList>
        <TabPanels className={styles.tabContent}>
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
        </TabPanels>
      </Tabs>
    </div>
  );
}
