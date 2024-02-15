import { tagAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(tagAnatomy.keys);

// define custom variants
const tagVariant = definePartsStyle({
  container: {
    mr: "12px",
    px: "18px", 
    py: "8px", 
    mb: "12px", 
    borderRadius:"full",
  }
});

// export the component theme
export const tagsTheme = defineMultiStyleConfig({
  variants: {
    defaultTag: tagVariant,
  },
  defaultProps: {
    variant: 'defaultTag',
  }
});