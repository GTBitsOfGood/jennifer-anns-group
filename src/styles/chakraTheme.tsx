import { extendTheme } from "@chakra-ui/react";
import { tabsAnatomy, tagAnatomy, checkboxAnatomy } from "@chakra-ui/anatomy";
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
  variants: {
    filter: {
      container: {
        color: "#535353",
        bg: "#F6F6F6",
      },
    },
    filter_selected: {
      container: {
        color: "#535353",
        bg: "#B0CAE8",
      },
    },
  },
});

const checkboxHelper = createMultiStyleConfigHelpers(checkboxAnatomy.keys);

const Checkbox = checkboxHelper.defineMultiStyleConfig({
  variants: {
    filter: {
      container: {
        fontWeight: "medium",
        color: "#6C757D",
        colorScheme: "brand.600",
        _checked: {
          color: "#2352A0",
        },
      },
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
      700: "#E1E4ED",
    },
  },
  components: {
    Tag,
    Tabs,
    Checkbox,
  },
});

export default chakraTheme;
