import { extendTheme } from "@chakra-ui/react";
import { tabsAnatomy, tagAnatomy, checkboxAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const tabsHelper = createMultiStyleConfigHelpers(tabsAnatomy.keys);

const Tabs = tabsHelper.defineMultiStyleConfig({
  baseStyle: {
    tab: {
      borderBottom: "4px solid",
      color: "#A3AED0",
      borderColor: "#EAECF0",
      mb: "-4px",
      fontWeight: "400",
      _selected: {
        color: "#164C96",
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
      px: "16px",
      py: "8px",
      mb: "12px",
      borderRadius: "full",
      fontSize: "14px",
      fontFamily: "Inter",
      fontWeight: "normal",
      color: "#38414B",
    },
  },
  variants: {
    filter: {
      container: {
        bg: "#F1F3F7",
      },
    },
    filter_selected_theme: {
      container: {
        bg: "#E2EFFF",
      },
    },
    filter_selected_accessibility: {
      container: {
        bg: "#FEE9CC",
      },
    },
    filter_selected_other: {
      container: {
        bg: "#E2DED5",
      },
    },
    filter_selected_game: {
      container: {
        bg: "#E1E4ED",
      },
    },
  },
});

const checkboxHelper = createMultiStyleConfigHelpers(checkboxAnatomy.keys);

const Checkbox = checkboxHelper.defineMultiStyleConfig({
  baseStyle: {
    control: {
      _checked: {
        bg: "#2352A0",
        border: "#00FFFFFF",
      },
    },
  },
  variants: {
    filter: {
      container: {
        fontWeight: "medium",
        color: "#6C757D",
        _checked: {
          color: "#2352A0",
        },
      },
    },
  },
});

const chakraTheme = extendTheme({
  styles: {
    global: {
      ":root": {
        "--tabs-color": "#A3AED0",
      },
    },
  },
  colors: {
    brand: {
      300: "#FDD299",
      400: "#A9CBEB",
      500: "#F2F2F2",
      600: "#2352A0",
      700: "#E1E4ED",
      800: "#eff6ff",
    },
  },
  components: {
    Tag,
    Tabs,
    Checkbox,
  },
});

export default chakraTheme;
