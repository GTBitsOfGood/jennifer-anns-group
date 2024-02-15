import styles from "@/styles/game.module.css";
import { ChakraProvider, Tag } from '@chakra-ui/react';
import theme from './tagsTheme';
import { gameSchema } from '@/utils/types';
import { z } from "zod";

interface Props {
    gameData: z.infer<typeof gameSchema>;
}

export default function TagsComponent({ gameData }: Props) {
    return (
        <ChakraProvider theme={theme}>
            <div className={styles.tags}>
                <Tag mr="12px" px="18px" py="8px" mb="12px" borderRadius="full" bg="brand.400">{gameData.theme}</Tag> 
                {gameData.tags ? gameData.tags.map(tag => (
                    <Tag mr="12px" px="18px" py="8px" mb="12px" borderRadius="full" bg="brand.500">{tag}</Tag>)
                ) : null}
            </div>
        </ChakraProvider>
    )
}