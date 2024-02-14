import styles from "@/styles/game.module.css";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Tag, ChakraProvider, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import theme from '../../components/tabs/tabsTheme';
import { gameSchema } from '@/utils/types';
import { z } from "zod";

export default function gamePage() {
    const gameID = useRouter().query.id;
    const [gameData, setGameData] = useState<z.infer<typeof gameSchema>>();

    useEffect(() => {
        if (gameID) {
            getGame();
        }
    }, [gameID]);

    async function getGame() {
        const response = await fetch("../api/games/" + gameID + "?id=" + gameID);
        const data = await response.json();
        setGameData(data.data);
    }

    if (!gameData) {
        return (
            <div></div>
        )
    }

    return (
        <div>
            <ChakraProvider theme={theme}>
                <h1 className={styles.name}>{gameData.name}</h1>

                <Tabs colorScheme="brand" textColor="#667085" className={styles.tabs}>
                    <TabList borderColor="brand.500" borderBottomWidth="4px" className={styles.tabTitle}>
                        <Tab marginBottom="-4px" borderBottomWidth="4px">Description</Tab>
                        {gameData.parentingGuide ? <Tab marginBottom="-4px" borderBottomWidth="4px">Parenting Guide</Tab> : null}
                        {gameData.lesson ? <Tab marginBottom="-4px" borderBottomWidth="4px">Lesson Plan</Tab> : null}
                    </TabList>
                    <TabPanels className={styles.tabContent}>
                        <TabPanel>
                            <p>{gameData.description}</p>
                        </TabPanel>
                        <TabPanel>
                            <p>two!</p>
                        </TabPanel>
                        <TabPanel>
                            <p>{gameData.lesson}</p>
                        </TabPanel>
                    </TabPanels>
                </Tabs>

                <div className={styles.tags}>
                    <Tag px="18px" py="8px" borderRadius="full" bg="brand.400">{gameData.theme}</Tag> 
                    {gameData.tags ? gameData.tags.map(tag => (
                        <Tag ml="12px" px="18px" py="8px" borderRadius="full">{tag}</Tag>)
                    ) : null}
                </div>
            </ChakraProvider>
        </div>
    );
}