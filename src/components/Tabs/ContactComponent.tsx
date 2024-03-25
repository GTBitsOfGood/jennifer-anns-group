import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  ChakraProvider,
  Flex,
  Button,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Icon,
  Image,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import chakraTheme from "@/styles/chakraTheme";
import { useState, useEffect } from "react";
export default function ContactComponent() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [firstName, setfirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [valid, setValid] = useState(false);
  const colors = { true: "#2352A0", false: "#D9D9D9" };
  const emailRegex = /^\S+@\S+\.\S+$/;
  useEffect(() => {
    if (
      firstName !== "" &&
      lastName !== "" &&
      email !== "" &&
      message !== "" &&
      emailRegex.test(email)
    ) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [firstName, lastName, email, message]);
  const onCloseFeatured = () => {
    setfirstName("");
    setLastName("");
    setEmail("");
    setMessage("");
    onClose();
  };

  return (
    <ChakraProvider theme={chakraTheme}>
      <div className="m-2">
        <Tabs colorScheme="brand" className="m-auto w-5/6 font-sans">
          <TabList>
            <Tab className="hover:bg-transparent">
              Contact Jennifer Ann&apos;s
            </Tab>
          </TabList>
          <TabPanels className="mb-12 mt-8 text-gray-500">
            <TabPanel p="0px">
              <Flex className="justify-between bg-white p-6">
                <Flex className="m-2 flex-col">
                  <Flex className="flex-row">
                    <FormControl className="mb-6 mr-3">
                      <FormLabel htmlFor="first-name">First Name</FormLabel>
                      <Input
                        className="space-x-4"
                        value={firstName}
                        id="first-name"
                        type="text"
                        placeholder="John"
                        borderColor="black"
                        width="195px"
                        height="43px"
                        onChange={(event) => setfirstName(event.target.value)}
                      />
                    </FormControl>
                    <FormControl className="mb-6 ml-4">
                      <FormLabel htmlFor="last-name">Last Name</FormLabel>
                      <Input
                        borderColor="black"
                        value={lastName}
                        id="last-name"
                        type="text"
                        placeholder="Doe"
                        width="195px"
                        height="43px"
                        onChange={(event) => setLastName(event.target.value)}
                      />
                    </FormControl>
                  </Flex>
                  <FormControl className="mb-2">
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      placeholder="johndoe@email.com"
                      borderColor="black"
                      width="418px"
                      height="43px"
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </FormControl>
                </Flex>
                <Flex className="mx-4 mb-2 mt-2 w-full flex-col items-end md:mx-8 lg:mx-16">
                  <FormControl>
                    <FormLabel htmlFor="message">Message</FormLabel>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      placeholder="Enter your message"
                      borderColor="black"
                      width="100%"
                      height="154px"
                    />
                  </FormControl>
                  <Button
                    type="submit"
                    width="219px"
                    height="47px"
                    color="white"
                    bg={colors[`${valid}`]}
                    _hover={{ bg: colors[`${valid}`] }}
                    onClick={valid ? onOpen : () => {}}
                    className="mt-8 rounded-md border border-transparent px-4 py-2 text-sm font-medium   focus:outline-none focus:ring-2"
                  >
                    Send Message
                  </Button>
                  <Modal isOpen={isOpen} onClose={onCloseFeatured}>
                    <ModalOverlay />
                    <ModalContent
                      className="mx-[110px] mt-[100px] flex flex-col items-center"
                      border="4px"
                      borderColor="brand.600"
                      height="436"
                      maxWidth="590"
                      p="10"
                    >
                      <ModalHeader className="flex flex-col items-center text-center text-[26px] font-bold leading-tight text-blue-primary">
                        <Icon
                          as={Image}
                          src={"/check-circle-fillcheckmark.svg"}
                          boxSize="115px"
                        />
                        <span className="mb-8 mt-6 text-[26px] font-bold leading-tight text-blue-primary">
                          Thanks, {firstName}!
                        </span>
                        <ModalCloseButton
                          color="blue-primary"
                          className="mx-[50px] mt-[45px]"
                        />
                      </ModalHeader>
                      <ModalBody maxWidth="400">
                        <span className="font-medium">
                          Your message has been sent. Someone from out team will
                          reply to your question shortly.
                        </span>
                      </ModalBody>
                    </ModalContent>
                  </Modal>
                </Flex>
              </Flex>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </ChakraProvider>
  );
}
