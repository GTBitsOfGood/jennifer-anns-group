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

interface Props {
  gameData: z.infer<typeof gameSchema>;
}

export default function TabsComponent({ gameData }: Props) {
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
            <p>{gameData.description}</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </ChakraProvider>
  );
}
