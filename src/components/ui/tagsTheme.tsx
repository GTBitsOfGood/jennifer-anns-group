import { extendTheme } from "@chakra-ui/react";
import { tagAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tagAnatomy.keys);

// define custom variants
const tagVariant = definePartsStyle({
  container: {
    mr: "12px",
    px: "18px",
    py: "8px",
    mb: "12px",
    borderRadius: "full",
  },
});

// export the component theme
const tagsTheme = defineMultiStyleConfig({
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
  },
});

export default theme;
