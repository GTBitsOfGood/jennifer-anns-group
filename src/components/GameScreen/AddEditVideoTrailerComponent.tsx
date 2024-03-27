import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  ChakraProvider,
  FormControl,
  Input,
  FormLabel,
  Button,
  Icon,
  Image,
  Flex,
} from "@chakra-ui/react";
import chakraTheme from "@/styles/chakraTheme";
import { useRouter } from "next/router";
import { useRef, useState, useEffect } from "react";
import { populatedGameWithId } from "@/server/db/models/GameModel";

const youtubeREGEX =
  /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)([\w\-]+)(\S+)?$/;
const vimeoREGEX =
  /(http|https)?:\/\/(www\.|player\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|video\/|)(\d+)(?:|\/\?)/;
interface Props {
  gameData: populatedGameWithId;
  deleted: boolean;
}

//TODO: Condense into both add and edit  video trailer components.
export default function AddEditVideoTrailer({ gameData, deleted }: Props) {
  const router = useRouter();
  const gameID = router.query.id;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const [url, setUrl] = useState(gameData.videoTrailer ?? "");
  const [issue, setIssue] = useState("");
  const [addButton, setAddButton] = useState(true);
  useEffect(() => {
    console.log(gameData.videoTrailer, "videoTrailer");
    if (gameData.videoTrailer === undefined || gameData.videoTrailer === "") {
      setAddButton(true);
    } else {
      setAddButton(false);
    }
  }, [gameData, isOpen, deleted]);
  useEffect(() => {
    setIssue("");
  }, [isOpen]);
  async function addVideoTrailer() {
    if (url === "") {
      setIssue("Required text field missing!");
      return;
    }
    if (youtubeREGEX.test(url) || vimeoREGEX.test(url)) {
      gameData.videoTrailer = url;
      onClose();
      router.push(`/games/${gameID}/edit`);
    } else {
      setIssue("Invalid URL (Only Youtube and Vimeo videos allowed)");
    }
  }
  async function editVideoTrailer() {
    if (url === "") {
      setIssue("Required text field missing!");
      return;
    }
    if (youtubeREGEX.test(url) || vimeoREGEX.test(url)) {
      gameData.videoTrailer = url;
      onClose();
      router.push(`/games/${gameID}/edit`);
    } else {
      setIssue("Invalid URL (Only Youtube and Vimeo videos allowed)");
    }
  }

  return (
    <ChakraProvider theme={chakraTheme}>
      <div>
        {addButton ? (
          <Button
            rightIcon={
              <Icon
                as={Image}
                src={"/octicon_upload-24upload.svg"}
                boxSize="20px"
              />
            }
            onClick={onOpen}
            bg="white"
            className="w-151 h-46 m-5 rounded-md border border-black px-[17px] py-2 font-sans text-xl font-semibold text-black"
          >
            Add Trailer
          </Button>
        ) : (
          <Button
            rightIcon={
              <Icon
                as={Image}
                src={"/pencileditIconOutline.svg"}
                boxSize="20px"
              />
            }
            onClick={onOpen}
            bg="white"
            className="w-151 h-46 m-5 rounded-md border border-black px-[17px] py-2 font-sans text-xl font-semibold text-black"
          >
            Edit Trailer
          </Button>
        )}
        <AlertDialog
          motionPreset="slideInBottom"
          leastDestructiveRef={cancelRef}
          onClose={onClose}
          isOpen={isOpen}
          isCentered
        >
          <AlertDialogOverlay />

          <AlertDialogContent height="274" maxWidth="809">
            <AlertDialogHeader p="0">
              <div className="float-left mx-[40px] mt-[20px] text-center text-[26px] font-bold leading-tight text-blue-primary">
                {addButton ? "Add Trailer" : "Edit Trailer"}
              </div>
            </AlertDialogHeader>
            <AlertDialogBody p="2" mt="20px" mx="20px">
              <div className="text-center font-sans text-base font-normal">
                <FormControl className="flex flex-col justify-center">
                  <Flex className="flex-row items-center justify-center">
                    <FormLabel
                      className="mt-5 text-center font-bold"
                      htmlFor="url"
                    >
                      URL<span className="text-delete-red">*</span>
                    </FormLabel>
                    <Input
                      id="url"
                      className="mb-2 mt-6"
                      borderColor="black"
                      borderWidth="1.5px"
                      type="text"
                      value={url}
                      onChange={(event) => {
                        setUrl(event.target.value);
                      }}
                      placeholder="https://www.youtube.com"
                    />
                  </Flex>
                  {issue !== "" ? (
                    <FormLabel htmlFor="url" className="ml-12 text-delete-red">
                      <Icon
                        as={Image}
                        className="mr-2"
                        src={"/error.svg"}
                        boxSize="20px"
                      />
                      {issue}
                    </FormLabel>
                  ) : null}
                </FormControl>
              </div>
            </AlertDialogBody>
            <AlertDialogFooter p="0" justifyContent="end">
              <button
                onClick={onClose}
                className="mb-7 mr-[22px] h-[42px] w-[94px] rounded-[5px] font-sans font-semibold text-blue-primary"
              >
                Cancel
              </button>
              <button
                ref={cancelRef}
                onClick={addButton ? addVideoTrailer : editVideoTrailer}
                className="mb-7 mr-[30px] h-[42px] w-[94px] rounded-[5px]  bg-blue-primary font-sans font-semibold text-white"
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
