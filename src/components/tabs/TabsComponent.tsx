import { ChakraProvider, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import styles from "@/styles/game.module.css";
import { gameSchema } from '@/utils/types';
import { z } from "zod";
import theme from './tabsTheme';

interface Props {
    gameData: z.infer<typeof gameSchema>;
}

export default function TabsComponent({ gameData }: Props) {
    return (
        <ChakraProvider theme={theme}>
            <Tabs colorScheme="brand" className={styles.tabs}>
                <TabList borderBottomWidth="4px" className={styles.tabTitle}>
                    <Tab marginBottom="-4px" borderBottomWidth="4px">Description</Tab>
                    {gameData.parentingGuide ? <Tab marginBottom="-4px" borderBottomWidth="4px">Parenting Guide</Tab> : null}
                    {gameData.lesson ? <Tab marginBottom="-4px" borderBottomWidth="4px">Lesson Plan</Tab> : null}
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