import {
  ChakraProvider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import theme from "../ui/tabsTheme";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import { CheckIcon, EditIcon, TrashIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { INote } from "@/server/db/models/UserModel";
import { IGame } from "@/server/db/models/GameModel";
import { TextArea } from "../ui/textarea";

function formatDate(date: Date) {
  let day = date.getDate().toString().padStart(2, "0");
  let month = (date.getMonth() + 1).toString().padStart(2, "0");
  let year = date.getFullYear();
  return month + " - " + day + " - " + year;
}

interface NotesComponentProps {
  userId: string;
  gameData: IGame & { _id: string };
}

export default function NotesComponent({
  gameData,
  userId,
}: NotesComponentProps) {
  const [newNote, setNewNote] = useState("");
  const [editNoteId, setEditNoteId] = useState("");
  const [editNote, setEditNote] = useState("");

  const { data: notes, refetch } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const response = await fetch(
        `/api/users/${userId}/notes?gameId=${gameData._id}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }
      const data = await response.json();
      return data;
    },
  });

  async function handleAddNote() {
    await axios.post(
      `/api/users/${userId}/notes`,
      JSON.stringify({
        date: new Date(),
        description: newNote,
        gameId: gameData._id,
      }),
      {
        headers: {
          "Content-Type": "text",
        },
      },
    );

    setNewNote("");
    await refetch();
  }

  async function handleDeleteNote(noteId: string) {
    await axios.delete(`/api/users/${userId}/notes/${noteId}`, {
      headers: {
        "Content-Type": "text",
      },
    });

    await refetch();
  }

  async function handleEditNote() {
    await axios.put(
      `/api/users/${userId}/notes/${editNoteId}`,
      JSON.stringify({
        date: new Date(),
        description: editNote,
        gameId: gameData._id,
      }),
      {
        headers: {
          "Content-Type": "text",
        },
      },
    );

    await refetch();
    setEditNoteId("");
  }

  return (
    <ChakraProvider theme={theme}>
      <Tabs colorScheme="brand" className="m-auto w-5/6 font-sans">
        <TabList>
          <Tab>Notes</Tab>
        </TabList>
        <TabPanels className="my-6 text-gray-500">
          <TabPanel p="0px">
            <Input
              className="border-input-border focus:border-blue-primary"
              onChange={(e) => {
                setNewNote(e.target.value);
              }}
              value={newNote}
              placeholder="Add a note..."
            />
            <div className="mb-4 flex flex-col items-end">
              <Button
                className="mt-4 block bg-blue-primary"
                size="sm"
                onClick={handleAddNote}
              >
                Post
              </Button>
            </div>
            <div className="flex flex-col items-stretch">
              {notes?.data
                ?.map((note: INote & { _id: string; date: string }) =>
                  editNoteId !== note._id ? (
                    <div key={note._id} className="mb-4 flex flex-row">
                      <div className="mr-6 whitespace-nowrap text-blue-primary">
                        {formatDate(new Date(note.date))}
                      </div>
                      <div className="grow">{note.description}</div>
                      <EditIcon
                        className="ml-6 inline-block shrink-0 cursor-pointer self-center"
                        onClick={() => {
                          setEditNoteId(note._id);
                          setEditNote(note.description);
                        }}
                      />
                      <TrashIcon
                        className="ml-4 inline-block shrink-0 cursor-pointer self-center"
                        onClick={() => handleDeleteNote(note._id)}
                      />
                    </div>
                  ) : (
                    <div key={note._id} className="mb-4 flex flex-row">
                      <div className="mr-6 whitespace-nowrap text-blue-primary">
                        {formatDate(new Date(note.date))}
                      </div>
                      <div className="w-full">
                        <TextArea
                          defaultValue={note.description}
                          className="h-24 text-base"
                          onChange={(e) => {
                            setEditNote(e.target.value);
                          }}
                        />
                      </div>
                      <CheckIcon
                        className="ml-6 inline-block shrink-0 cursor-pointer self-center"
                        onClick={() => handleEditNote()}
                      />
                      <TrashIcon
                        className="ml-4 inline-block shrink-0 cursor-pointer self-center"
                        onClick={() => handleDeleteNote(note._id)}
                      />
                    </div>
                  ),
                )
                .reverse()}
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </ChakraProvider>
  );
}
