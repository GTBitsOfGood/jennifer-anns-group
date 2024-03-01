import {
  ChakraProvider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import styles from "@/styles/tabs.module.css";
import { populatedGame } from "@/server/db/models/GameModel";
import theme from "../ui/tabsTheme";

interface Props {
  gameData: populatedGame;
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
