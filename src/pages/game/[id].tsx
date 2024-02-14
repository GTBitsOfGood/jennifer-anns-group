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
            <div>Hi</div>
        )
    }

    return (
        <div>
            <ChakraProvider theme={theme}>
                <h1 className={styles.name}>{gameData.name}</h1>

                <Tabs className={styles.tabs}>
                    <TabList className={styles.tabTitle}>
                        <Tab color='brand.100' _selected={{color: 'brand.200'}}>Description</Tab>
                        {gameData.parentingGuide ? <Tab color='brand.100' _selected={{color: 'brand.200'}}>Parenting Guide</Tab> : null}
                        {gameData.lesson ? <Tab color='brand.100' _selected={{color: 'brand.200'}}>Lesson Plan</Tab> : null}
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
                    <Tag>{gameData.theme}</Tag> 
                    {/* {
                        gameData.tags.forEach((element) => {
                            return <Tag>{element}</Tag>
                        })
                    } */}
                </div>
            </ChakraProvider>
        </div>
    );
}