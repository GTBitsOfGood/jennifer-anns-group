import { extendTheme } from '@chakra-ui/react'
import { tabsTheme } from '../tabs/customTheme'

const colors = {
    brand: {
        100: "#98A2B3",
        200: "#164C96",
    }
}

const theme = extendTheme({ colors })

export default theme;