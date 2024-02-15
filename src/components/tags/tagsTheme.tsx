import { extendTheme } from '@chakra-ui/react'
import { tagsTheme } from './tagsDefaultVariant';

const theme = extendTheme({
    colors: {
        brand: {
            400: "#A9CBEB",
            500: "#F2F2F2",
        }
    }, 
    components: {
        Tag: tagsTheme,
    },
});

export default theme;