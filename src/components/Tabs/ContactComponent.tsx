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
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import chakraTheme from "@/styles/chakraTheme";
import { AlertTriangleIcon } from "lucide-react";
import { useState, useEffect } from "react";
import cn from "classnames";

interface ContactComponentProps {
  gameName: string;
  userId: string;
  firstName: string;
}

export default function ContactComponent({
  gameName,
  userId,
  firstName,
}: ContactComponentProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [message, setMessage] = useState("");
  const [valid, setValid] = useState(false);
  const [failedtoSend, setfailedtoSend] = useState(false);
  useEffect(() => {
    if (message !== "") {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [message]);
  const resetForm = () => {
    setMessage("");
    onClose();
  };
  const sendEmail = async () => {
    const result = await fetch("/api/email", {
      method: "POST",
      body: JSON.stringify({
        userId: userId,
        gameName: gameName,
        message: message,
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
          <TabPanels className="mb-12 mt-8 text-black">
            <TabPanel p="0px">
              <Flex className="justify-between bg-white p-0">
                <Flex className="mb-2  mt-2 w-full flex-col items-end">
                  <FormControl>
                    <FormLabel color="black" htmlFor="message">
                      Message
                    </FormLabel>
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
                      className="mx-[110px] mt-[90px] flex flex-col items-center justify-end"
                      height="351"
                      maxWidth="480"
                      p="8"
                    >
                      <ModalHeader className="flex flex-col items-center text-center text-[26px] font-bold leading-tight text-blue-primary">
                        <Icon
                          as={Image}
                          src={"/check_circle_outline.png"}
                          boxSize="115px"
                        />
                        <span className="mb-0 mt-1 text-[26px] font-bold leading-tight text-blue-primary">
                          Thanks, {firstName}!
                        </span>
                        <ModalCloseButton
                          color="text-blue-primary"
                          className="mx-[50px] mt-[45px]"
                        />
                      </ModalHeader>
                      <ModalBody maxWidth="482" maxHeight="100">
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
                fontSize="23px"
                type="submit"
                onClick={valid ? sendEmail : () => {}}
                className={cn(
                  valid ? " bg-blue-primary hover:bg-black" : "bg-input-border",
                  "float-right mt-12 h-[47px] w-[219px] rounded-md border border-transparent px-4 py-2 font-medium text-white focus:outline-none focus:ring-2",
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
