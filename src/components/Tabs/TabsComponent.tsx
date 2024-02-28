import {
  ChakraProvider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import styles from "@/styles/tabs.module.css";
import { gameSchema } from "@/utils/types";
import { z } from "zod";
import theme from "../ui/tabsTheme";
import { Dispatch, SetStateAction } from "react";

interface Props {
  mode: string;
  description: string;
  setDescription: Dispatch<SetStateAction<string>>;
  gameData: z.infer<typeof gameSchema>;
}

export default function TabsComponent({
  mode,
  description,
  setDescription,
  gameData,
}: Props) {
  return (
    <ChakraProvider theme={theme}>
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
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            ) : (
              <p>{gameData.description}</p>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </ChakraProvider>
  );
}
