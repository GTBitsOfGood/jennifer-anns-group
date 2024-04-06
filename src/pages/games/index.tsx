import { userDataSchema } from "@/components/ProfileModal/ProfileModal";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { z } from "zod";
import {
  ChakraProvider,
  Divider,
  InputGroup,
  InputLeftElement,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
  Text,
  Button,
  PopoverCloseButton,
} from "@chakra-ui/react";
import { themeSchema } from "@/utils/types";
import {
  Search2Icon,
  TriangleDownIcon,
  TriangleUpIcon,
} from "@chakra-ui/icons";
import { Input } from "@chakra-ui/react";
import FilterBody from "@/components/GameGallery/FilterBody";
import chakraTheme from "@/styles/chakraTheme";
import { useRouter } from "next/router";
import ThemeSidebar from "@/components/GameGallery/ThemeSidebar";
import SelectedFilters from "@/components/GameGallery/SelectedFilters";
import GameCardView from "@/components/GameGallery/GameCardView";
import GamesPagination from "@/components/GameGallery/GamesPagination";
import { PageRequiredGameQuery } from "@/components/ThemesTags/GamesSection";

export default function Games() {
  const { data: session } = useSession();
  const currentUser = session?.user;
  const [userData, setUserData] = useState<z.infer<typeof userDataSchema>>();
  const [themes, setThemes] = useState<string[]>([]);
  const [selectedTheme, setSelectedTheme] = useState("All Games");
  const [gameBuilds, setGameBuilds] = useState<string[]>([]);
  const [gameContent, setGameContent] = useState<string[]>([]);
  const [accessibility, setAccessibility] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [name, setName] = useState("");
  const router = useRouter();
  const [filtersApplied, setFiltersApplied] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [currPage, setCurrPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [filters, setFilters] = useState<PageRequiredGameQuery>({
    page: 1,
  });

  useEffect(() => {
    getThemes();
  }, []);

  async function getThemes() {
    const response = await fetch(`/api/themes`);
    const data = await response.json();
    const themesString = data.map((theme: z.infer<typeof themeSchema>) => {
      return theme.name;
    });
    themesString.sort();
    setThemes(themesString);
  }

  useEffect(() => {
    if (currentUser) {
      getUserData();
    }
  }, [currentUser, userData?.label]);

  async function getUserData() {
    try {
      const response = await fetch(`/api/users/${currentUser?._id}`);
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error getting user:", error);
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    setFiltersApplied(true);
  };

  return (
    <div>
      <ChakraProvider theme={chakraTheme}>
        <h1 className="mb-16 mt-10 text-center font-sans text-6xl font-semibold">
          Game Gallery
        </h1>

        <div className="m-auto mb-11 flex w-[80vw] flex-row justify-between">
          <div className="flex flex-row">
            <InputGroup w="200px">
              <InputLeftElement pointerEvents="none">
                <Search2Icon
                  style={{ transform: "translateY(-2px)" }}
                  color="gray.500"
                />
              </InputLeftElement>
              <Input
                height="36px"
                onChange={handleInputChange}
                borderColor="gray.500"
                bg="gray.50"
                color="gray.500"
                placeholder="Filter by name"
                minW="200px"
              />
            </InputGroup>
            <Popover
              placement="bottom-start"
              onOpen={onOpen}
              onClose={onClose}
              isOpen={isOpen}
            >
              <PopoverTrigger>
                <Button
                  borderRadius="100px"
                  bg="brand.800"
                  _hover={{ bg: "brand.800" }}
                  minW="96px"
                  height="36px"
                  className="ml-5 mr-5 flex flex-row items-center justify-center space-x-1 border border-[#A9CBEB]"
                >
                  <Text className="select-none font-inter text-sm font-bold text-[#2352A0]">
                    Filter
                  </Text>
                  {isOpen ? (
                    <TriangleUpIcon color="brand.600" height="9px" />
                  ) : (
                    <TriangleDownIcon color="brand.600" height="9px" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent mt="10px" w="750px" minH="870px">
                <PopoverCloseButton
                  size="md"
                  mr="52px"
                  mt="38px"
                  color="brand.600"
                />
                <PopoverBody>
                  <FilterBody
                    setAcccessibility={setAccessibility}
                    setGameBuilds={setGameBuilds}
                    setGameContent={setGameContent}
                    setTags={setTags}
                    setFiltersApplied={setFiltersApplied}
                    userLabel={userData?.label}
                    onClose={onClose}
                  />
                </PopoverBody>
              </PopoverContent>
            </Popover>
            <div className="flex flex-row flex-wrap">
              <SelectedFilters
                gameBuilds={gameBuilds}
                gameContent={gameContent}
                accessibility={accessibility}
                tags={tags}
              />
            </div>
          </div>
          {userData?.label === "administrator" ? (
            <button
              onClick={() => {
                router.push("/games/create");
              }}
              className="ml-5 h-10 min-w-[150px] rounded-md bg-blue-primary	font-sans font-semibold text-[#FAFBFC]"
            >
              Create Game
            </button>
          ) : null}
        </div>

        <div className="m-auto w-[85vw]">
          <Divider borderColor="brand.700" borderWidth="1px" />
        </div>

        <div>
          <div className="m-auto flex flex-row justify-center">
            <div className="m-auto mt-[60px] flex w-[85vw] flex-row">
              <ThemeSidebar
                themes={themes}
                selectedTheme={selectedTheme}
                setSelectedTheme={setSelectedTheme}
                setFiltersApplied={setFiltersApplied}
              />
              <GameCardView
                filtersApplied={filtersApplied}
                setFiltersApplied={setFiltersApplied}
                gameBuilds={gameBuilds}
                gameContent={gameContent}
                accessibility={accessibility}
                tags={tags}
                name={name}
                selectedTheme={selectedTheme}
                currPage={currPage}
                setNumPages={setNumPages}
                filters={filters}
                setFilters={setFilters}
              />
            </div>
          </div>
          {numPages ? (
            <div className="mb-32 mt-20">
              <GamesPagination
                setCurrPage={setCurrPage}
                numPages={numPages}
                filters={filters}
                setFilters={setFilters}
              />
            </div>
          ) : null}
        </div>
      </ChakraProvider>
    </div>
  );
}
