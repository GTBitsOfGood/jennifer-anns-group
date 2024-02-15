import { extendTheme } from '@chakra-ui/react';
import { tabsTheme } from './tabsDefaultVariant';

const theme = extendTheme({
  components: {
    Tabs: tabsTheme,
  },
});

export default theme;