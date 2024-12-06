import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  ChakraProvider,
  Flex,
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
  Input,
  Button,
} from "@chakra-ui/react";
import chakraTheme from "@/styles/chakraTheme";
import axios from "axios";
import { CheckIcon, EditIcon, TrashIcon } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { INote } from "@/server/db/models/UserModel";
import { TextArea } from "../ui/textarea";
import { AlertTriangleIcon } from "lucide-react";
import { useState, useEffect } from "react";
import cn from "classnames";

function formatDate(date: Date) {
  let day = date.getDate().toString().padStart(2, "0");
  let month = (date.getMonth() + 1).toString().padStart(2, "0");
  let year = date.getFullYear();
  return month + " - " + day + " - " + year;
}

interface NotesContactComponentProps {
  userId: string;
  gameId: string;
  gameName: string;
  firstName: string;
}

export default function NotesContactComponent({
  userId,
  gameId,
  gameName,
  firstName,
}: NotesContactComponentProps) {
  const [newNote, setNewNote] = useState("");
  const [editId, setEditId] = useState("");
  const [editDescription, setEditDescription] = useState("");
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

  const {
    data: notes,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const response = await fetch(
        `/api/users/${userId}/notes?gameId=${gameId}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }
      const data = await response.json();
      return data;
    },
    retry: 3,
  });

  const addNote = useMutation({
    mutationFn: () => {
      return axios.post(
        `/api/users/${userId}/notes`,
        JSON.stringify({
          date: new Date(),
          description: newNote,
          gameId,
        }),
        {
          headers: {
            "Content-Type": "text",
          },
        },
      );
    },
    onSuccess: () => {
      refetch();
      setNewNote("");
    },
  });

  const deleteNote = useMutation({
    mutationFn: (noteId: string) => {
      return axios.delete(`/api/users/${userId}/notes/${noteId}`, {
        headers: {
          "Content-Type": "text",
        },
      });
    },
    onSuccess: () => {
      refetch();
    },
  });

  const editNote = useMutation({
    mutationFn: () => {
      return axios.put(
        `/api/users/${userId}/notes/${editId}`,
        JSON.stringify({
          date: new Date(),
          description: editDescription,
          gameId,
        }),
        {
          headers: {
            "Content-Type": "text",
          },
        },
      );
    },
    onSuccess: async () => {
      await refetch();
      setEditId("");
    },
  });

  return (
    <ChakraProvider theme={chakraTheme}>
      <Tabs colorScheme="brand" className="font-sans">
        <TabList>
          <Tab>Notes</Tab>
          <Tab>Contact Jennifer Ann&apos;s</Tab>
        </TabList>
        <TabPanels className="mt-8 text-gray-500">
          <TabPanel className="p-0" display="flex" flexDir="column" gap={8}>
            <div className="flex flex-row items-center gap-4">
              <div className="flex-grow">
                <Input
                  className="h-12 border-input-border bg-input-bg px-4 py-3 text-lg text-font-600 placeholder-placeholder focus:border-blue-primary"
                  onChange={(e) => {
                    setNewNote(e.target.value);
                  }}
                  value={newNote}
                  placeholder="Add a note"
                />
              </div>
              <div className="flex flex-col items-end">
                <Button
                  className="h-12 rounded-md bg-blue-primary px-4 py-3 font-sans text-lg text-white hover:bg-blue-hover"
                  onClick={() => addNote.mutate()}
                >
                  Post
                </Button>
              </div>
            </div>
            <div className="flex flex-col items-stretch">
              {notes?.data
                ?.filter(
                  (note: INote & { _id: string; date: string }) =>
                    note.gameId == gameId,
                )
                .map((note: INote & { _id: string; date: string }) =>
                  editId !== note._id ? (
                    <div key={note._id} className="mb-4 flex flex-row">
                      <div className="mr-8 mt-0.5 whitespace-nowrap text-blue-primary">
                        {formatDate(new Date(note.date))}
                      </div>
                      <div className="grow text-lg text-input-stroke">
                        {note.description}
                      </div>
                      <EditIcon
                        className="ml-8 inline-block shrink-0 cursor-pointer self-start text-blue-primary"
                        onClick={() => {
                          setEditId(note._id);
                          setEditDescription(note.description);
                        }}
                      />
                      <TrashIcon
                        className="ml-4 inline-block shrink-0 cursor-pointer self-start text-delete-red"
                        onClick={() => deleteNote.mutate(note._id)}
                      />
                    </div>
                  ) : (
                    <div key={note._id} className="mb-4 flex flex-row">
                      <div className="mr-8 mt-0.5 whitespace-nowrap text-blue-primary">
                        {formatDate(new Date(note.date))}
                      </div>
                      <div className="w-full">
                        <TextArea
                          defaultValue={note.description}
                          className="h-24 px-4 py-3 text-lg text-input-stroke"
                          onChange={(e) => {
                            setEditDescription(e.target.value);
                          }}
                        />
                      </div>
                      <CheckIcon
                        className="ml-8 inline-block shrink-0 cursor-pointer self-start text-blue-primary"
                        onClick={() => editNote.mutate()}
                      />
                      <TrashIcon
                        className="ml-4 inline-block shrink-0 cursor-pointer self-start text-delete-red"
                        onClick={() => deleteNote.mutate(note._id)}
                      />
                    </div>
                  ),
                )
                .reverse()}
            </div>
          </TabPanel>
          <TabPanel className="p-0">
            <Flex className="justify-between bg-white p-0">
              <Flex className="w-full flex-col items-end">
                <FormControl>
                  <Textarea
                    className="border-input-border bg-input-bg px-4 py-3 text-lg text-font-600 placeholder-placeholder focus:border-blue-primary"
                    id="message"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Send a message to Jennifer Ann's."
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
              type="submit"
              onClick={valid ? sendEmail : () => {}}
              className={cn(
                valid ? " bg-blue-primary hover:bg-black" : "bg-input-border",
                "float-right mt-12 h-12 rounded-md border border-transparent bg-blue-primary px-4 py-3 font-sans text-lg font-medium text-white focus:outline-none focus:ring-2",
              )}
            >
              Send Message
            </Button>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </ChakraProvider>
  );
}
