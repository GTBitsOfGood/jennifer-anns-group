import { extendTheme } from "@chakra-ui/react";
import { tabsAnatomy, tagAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";
const {
  definePartsStyle: definePartsStyleTabs,
  defineMultiStyleConfig: defineMultiStyleConfigTabs,
} = createMultiStyleConfigHelpers(tabsAnatomy.keys);
const {
  definePartsStyle: definePartsStyleTags,
  defineMultiStyleConfig: defineMultiStyleConfigTags,
} = createMultiStyleConfigHelpers(tagAnatomy.keys);

const tabVariant = definePartsStyleTabs({
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

const tabsTheme = defineMultiStyleConfigTabs({
  variants: {
    defaultTab: tabVariant,
  },
  defaultProps: {
    variant: "defaultTab",
  },
});

const tagVariant = definePartsStyleTags({
  container: {
    mr: "12px",
    px: "18px",
    py: "8px",
    mb: "12px",
    borderRadius: "full",
  },
});

const tagsTheme = defineMultiStyleConfigTags({
  variants: {
    defaultTag: tagVariant,
  },
  defaultProps: {
    variant: "defaultTag",
  },
});

const theme = extendTheme({
  colors: {
    brand: {
      300: "#FDD299",
      400: "#A9CBEB",
      500: "#F2F2F2",
      600: "#2352A0",
    },
  },
  components: {
    Tag: tagsTheme,
    Tabs: tabsTheme,
  },
});

export default theme;
