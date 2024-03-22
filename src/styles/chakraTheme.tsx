import { extendTheme } from "@chakra-ui/react";
import { tabsAnatomy, tagAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const tabsHelper = createMultiStyleConfigHelpers(tabsAnatomy.keys);

const Tabs = tabsHelper.defineMultiStyleConfig({
  baseStyle: {
    tab: {
      borderBottom: "4px solid",
      color: "#98A2B3",
      borderColor: "#EAECF0",
      mb: "-4px",
      fontWeight: "400",
      _selected: {
        color: "#164C96",
        fontWeight: "600",
        borderColor: "#164C96",
        borderBottomWidth: "4px",
        mb: "-4px",
      },
    },
    tablist: {
      borderBottomWidth: "4px",
    },
  },
});

const tagHelper = createMultiStyleConfigHelpers(tagAnatomy.keys);

const Tag = tagHelper.defineMultiStyleConfig({
  baseStyle: {
    container: {
      mr: "12px",
      px: "18px",
      py: "8px",
      mb: "12px",
      borderRadius: "full",
    },
  },
});

const chakraTheme = extendTheme({
  colors: {
    brand: {
      300: "#FDD299",
      400: "#A9CBEB",
      500: "#F2F2F2",
      600: "#2352A0",
    },
  },
  components: {
    Tag,
    Tabs,
  },
});

export default chakraTheme;
