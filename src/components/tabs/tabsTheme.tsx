import { extendTheme } from '@chakra-ui/react'
import { tabsTheme } from '../tabs/customTheme'

const theme = extendTheme({
    colors: {
        brand: {
            400: "#A9CBEB",
            500: "#EAECF0",
            600: "#164C96",
        }
    }
});

export default theme;