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

export default function TabsComponent({ mode, description, setDescription, gameData }: Props) {
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
            { mode === "edit"
              ? <textarea className="!resize-none h-40 px-5 py-5 rounded-[20px] border-solid border bg-input-bg !outline-none border-grey font-sans w-full" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} />
              : <p>{gameData.description}</p>
            }
          </TabPanel>
        </TabPanels>
      </Tabs>
    </ChakraProvider>
  );
}
