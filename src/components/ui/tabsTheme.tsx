import { extendTheme } from "@chakra-ui/react";
import { tabsAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tabsAnatomy.keys);

// define custom variants
const tabVariant = definePartsStyle({
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
});

// export the component theme
const tabsTheme = defineMultiStyleConfig({
  variants: {
    defaultTab: tabVariant,
  },
  defaultProps: {
    variant: "defaultTab",
  },
});

const theme = extendTheme({
  components: {
    Tabs: tabsTheme,
  },
});

export default theme;
