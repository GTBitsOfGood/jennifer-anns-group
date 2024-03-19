import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  ChakraProvider,
  Flex,
} from "@chakra-ui/react";
import chakraTheme from "@/styles/chakraTheme";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Textarea,
} from "@chakra-ui/react";

export default function TabsComponent() {
  return (
    <ChakraProvider theme={chakraTheme}>
      <div>
        <Tabs colorScheme="brand" className="m-auto w-5/6 font-sans">
          <TabList>
            <Tab className="hover:bg-transparent">
              Contact Jennifer Ann&apos;s
            </Tab>
          </TabList>
          <TabPanels className="mb-12 mt-8 text-gray-500">
            <TabPanel p="0px">
              <Flex className="justify-between bg-white p-6">
                <Flex className="flex-col">
                  <Flex className="flex-row">
                    <FormControl>
                      <FormLabel htmlFor="first-name">First Name</FormLabel>
                      <Input
                        className="space-x-4"
                        id="first-name"
                        type="text"
                        placeholder="Jennifer"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel htmlFor="last-name">Last Name</FormLabel>
                      <Input id="last-name" type="text" placeholder="Ann" />
                    </FormControl>
                  </Flex>
                  <FormControl>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="johndoe@email.com"
                    />
                  </FormControl>
                </Flex>
                <Flex className="flex-col">
                  <FormControl>
                    <FormLabel htmlFor="message">Message</FormLabel>
                    <Textarea id="message" placeholder="Enter your message" />
                  </FormControl>
                  <button
                    type="submit"
                    className="w-219 h-47 mt-4 rounded-md border border-transparent bg-blue-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2"
                  >
                    Send Message
                  </button>
                </Flex>
              </Flex>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </ChakraProvider>
  );
}
