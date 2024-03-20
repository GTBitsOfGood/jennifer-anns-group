import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  useDisclosure,
  ChakraProvider,
  FormControl,
  Input,
  FormLabel,
  Flex,
} from "@chakra-ui/react";
import chakraTheme from "@/styles/chakraTheme";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { populatedGameWithId } from "@/server/db/models/GameModel";

interface Props {
  gameData: populatedGameWithId;
}

export default function EditVideoTrailer({ gameData }: Props) {
  const router = useRouter();
  const gameID = router.query.id;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const [url, setUrl] = useState(gameData.videoTrailer);
  const [issue, setIssue] = useState(false);
  async function editVideoTrailer() {
    //The themes is populated and cant be send to the endpoint
    //TODO: Add capability to
    gameData.videoTrailer = url;
    const { themes, ...gameDatawithoutTheme } = gameData; //Themes is populated, so messes up the post API.
    console.log("GameData", gameData);
    const response = await fetch(`/api/games/${gameID}`, {
      method: "PUT",
      body: JSON.stringify(gameDatawithoutTheme),
    });
    console.log(response.status);
    if (response.status === 200) {
      onClose();
      router.push(`/games/${gameID}/edit`);
    } else {
      setIssue(true);
    }
  }

  return (
    <ChakraProvider theme={chakraTheme}>
      <div>
        <button
          onClick={onOpen}
          className="m-5 rounded-md border border-black bg-white px-[17px] py-2 font-sans text-xl font-semibold text-black"
        >
          Edit Trailer
        </button>
        <AlertDialog
          motionPreset="slideInBottom"
          leastDestructiveRef={cancelRef}
          onClose={onClose}
          isOpen={isOpen}
          isCentered
        >
          <AlertDialogOverlay />

          <AlertDialogContent
            border="4px"
            borderColor="brand.600"
            height="444"
            maxWidth="585"
          >
            <div>
              <AlertDialogCloseButton mr="50px" mt="50px" color="brand.600" />
            </div>
            <AlertDialogHeader p="0">
              <div className="mx-[110px] mt-[100px] text-center text-[26px] font-bold leading-tight text-blue-primary">
                Edit Trailer
              </div>
            </AlertDialogHeader>
            <AlertDialogBody p="0" mt="50px">
              <div className="text-center font-sans text-base font-normal">
                <FormControl className="flex flex-col justify-center">
                  <Flex className="flex-row items-center">
                    <FormLabel htmlFor="url">URL</FormLabel>
                    <Input
                      id="url"
                      type="text"
                      value={url}
                      onChange={(event) => {
                        setUrl(event.target.value);
                      }}
                      placeholder="https://www.youtube.com/trailer/aB3sv3-?24"
                    />
                  </Flex>
                  {issue === true ? (
                    <FormLabel htmlFor="url" className="text-delete-red">
                      Invalid URL
                    </FormLabel>
                  ) : null}
                </FormControl>
              </div>
            </AlertDialogBody>
            <AlertDialogFooter p="0" justifyContent="center">
              <button
                onClick={onClose}
                className="mb-24 mr-[22px] h-[47px] w-[198px] rounded-[10px] bg-delete-red font-sans font-semibold text-white"
              >
                Cancel
              </button>
              <button
                ref={cancelRef}
                onClick={editVideoTrailer}
                className="mb-24 ml-[22px] h-[47px] w-[198px] rounded-[10px] border-[1px] border-solid border-black font-sans font-semibold"
              >
                Done
              </button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ChakraProvider>
  );
}

//TODO: Clean up tailwind css of EditVideTrailer
