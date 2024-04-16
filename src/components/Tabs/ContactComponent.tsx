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
import { AlertTriangleIcon } from "lucide-react";
import { useState, useEffect } from "react";
import cn from "classnames";
interface Props {
  gameName: string;
}

export default function ContactComponent({ gameName }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [firstName, setfirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [valid, setValid] = useState(false);
  const [failedtoSend, setfailedtoSend] = useState(false);
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
  const resetForm = () => {
    setfirstName("");
    setLastName("");
    setEmail("");
    setMessage("");
    onClose();
  };
  const sendEmail = async () => {
    const result = await fetch("/api/email", {
      method: "POST",
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
        message: message,
        gameName: gameName,
      }),
    });
    if (result.status === 200) {
      setfailedtoSend(false);
      onOpen();
    } else {
      setfailedtoSend(true);
    }
  };

  return (
    <ChakraProvider theme={chakraTheme}>
      <div className="m-2">
        <Tabs colorScheme="brand" className="m-auto w-5/6 min-w-max font-sans">
          <TabList>
            <Tab className="hover:bg-transparent">
              Contact Jennifer Ann&apos;s
            </Tab>
          </TabList>
          <TabPanels className="mb-12 mt-8 text-gray-500">
            <TabPanel p="0px">
              <Flex className="justify-between bg-white p-0">
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
                <Flex className="mb-2 ml-4 mt-2 w-full flex-col items-end md:ml-8 lg:ml-16">
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
                  <Modal isOpen={isOpen} onClose={resetForm}>
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
                        <div className="text-center font-sans font-medium">
                          Your message has been sent. Someone from our team will
                          reply to your question shortly.
                        </div>
                      </ModalBody>
                    </ModalContent>
                  </Modal>
                </Flex>
              </Flex>
              {failedtoSend && (
                <div className="mt-4 flex h-14 w-full items-center gap-2 rounded-sm bg-red-100 px-4 text-sm text-red-500">
                  <AlertTriangleIcon className="h-5 w-5" />
                  <p className="font-semibold">
                    Sending failed. Please try again.
                  </p>
                </div>
              )}

              <Button
                type="submit"
                onClick={valid ? sendEmail : () => {}}
                className={cn(
                  valid ? " bg-blue-primary hover:bg-black" : "bg-input-border",
                  "float-right mt-8 h-[47px] w-[219px] rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2",
                )}
              >
                Send Message
              </Button>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </ChakraProvider>
  );
}
