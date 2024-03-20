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
import { useRef, useState, useEffect } from "react";
import { populatedGameWithId } from "@/server/db/models/GameModel";

const URL_REGEX =
  /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
interface Props {
  gameData: populatedGameWithId;
}

export default function AddVideoTrailer({ gameData }: Props) {
  const router = useRouter();
  const gameID = router.query.id;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const [url, setUrl] = useState("");
  const [issue, setIssue] = useState(false);

  useEffect(() => {
    setIssue(false);
  }, [isOpen]);
  async function addVideoTrailer() {
    //The themes is populated and cant be send to the endpoint
    //TODO: Add capability to
    if (URL_REGEX.test(url)) {
      gameData.videoTrailer = url;
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
          Add Trailer
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
                Add Trailer
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
                onClick={addVideoTrailer}
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

//TODO: Clean up tailwind css of AddVideoTrailer, first clean up EditVideoTrailer then copy and paste
//TODO: AddTrailer doesn't properly work right now.
