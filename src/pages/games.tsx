//Initial commit message.
import { Footer } from "@/components/Navigation/Footer";
import Header from "@/components/Navigation/Header";
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
} from "@chakra-ui/react";
import { gameSchema, themeSchema } from "@/utils/types";
import {
  Search2Icon,
  TriangleDownIcon,
  TriangleUpIcon,
} from "@chakra-ui/icons";
import { Input } from "@chakra-ui/react";
import FilterBody from "@/components/GameComponent/FilterBody";
import chakraTheme from "@/styles/chakraTheme";
import { useRouter } from "next/router";
import ThemeSidebar from "@/components/GameComponent/ThemeSidebar";
import SelectedFilters from "@/components/GameComponent/SelectedFilters";
import GameCardView from "@/components/GameComponent/GameCardView";

export default function Games() {
  const { data: session } = useSession();
  const currentUser = session?.user;
  const [userData, setUserData] = useState<z.infer<typeof userDataSchema>>();
  const [games, setGames] = useState<z.infer<typeof gameSchema>[]>([]);
  const [themes, setThemes] = useState<string[]>([]);
  const [selectedTheme, setSelectedTheme] = useState("All Games");
  const [gameBuilds, setGameBuilds] = useState<string[]>([]);
  const [gameContent, setGameContent] = useState<string[]>([]);
  const [accessibility, setAccessibility] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [name, setName] = useState("");
  const router = useRouter();
  const [empty, setEmpty] = useState(false);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const gameBuildsMap: Record<string, string> = {
    Amazon: "amazon",
    Android: "android",
    "App Store": "appstore",
    Linux: "linux",
    Mac: "mac",
    WebGL: "webgl",
    Windows: "windows",
  };
  const gameContentMap: Record<string, string> = {
    "Parenting guide": "parentingGuide",
    "Lesson plan": "lessonPlan",
    "Video trailer": "videoTrailer",
    "Answer key": "answerKey",
  };

  useEffect(() => {
    getGames();
    getThemes();
  }, []);

  useEffect(() => {
    if (filtersApplied) {
      getGames();
      setFiltersApplied(false);
    }
  }, [filtersApplied]);

  async function getGames() {
    const params = new URLSearchParams();
    params.append("page", "1");

    if (gameBuilds.length > 0) {
      gameBuilds.forEach((gb) => {
        params.append("gameBuilds", gameBuildsMap[gb]);
      });
    }

    if (gameContent.length > 0) {
      gameContent.forEach((gc) => {
        params.append("gameContent", gameContentMap[gc]);
      });
    }

    if (accessibility.length > 0) {
      accessibility.forEach((acc) => {
        params.append("accessibility", acc);
      });
    }

    if (tags.length > 0) {
      tags.forEach((tag) => {
        params.append("tags", tag);
      });
    }

    if (name.length >= 3) {
      params.append("name", name);
    }

    if (selectedTheme !== "All Games") {
      params.append("theme", selectedTheme);
    }

    const queryString = params.toString();

    try {
      const response = await fetch(`/api/games/?${queryString}`);
      if (response.ok) {
        const data = await response.json();
        setGames(data.games);
        setEmpty(false);
      } else {
        const message = await response.text();
        if (message === "No Games found at this page") {
          setEmpty(true);
        }
      }
    } catch (e: any) {
      console.log(e.message);
    }
  }

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
    <ChakraProvider theme={chakraTheme}>
      <div>
        <Header
          label={userData?.label}
          userData={userData}
          setUserData={setUserData}
        />
        <br></br>

        <h1 className="mb-16 mt-10 text-center font-sans text-6xl font-semibold">
          Game Gallery
        </h1>

        <div className="m-auto mb-11 flex w-[80vw] flex-row justify-between">
          <div className="flex flex-row">
            <InputGroup w="200px">
              <InputLeftElement pointerEvents="none">
                <Search2Icon color="gray.500" />
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
              <PopoverContent mt="10px" w="750px" minH="800px">
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

        <div className="m-auto ml-[10vw] w-[80vw]">
          <Divider borderColor="brand.700" borderWidth="1px" />
        </div>

        <div className="m-auto flex flex-row justify-center">
          <div className="m-auto mt-[60px] flex w-[85vw] flex-row">
            <ThemeSidebar
              themes={themes}
              selectedTheme={selectedTheme}
              setSelectedTheme={setSelectedTheme}
              setFiltersApplied={setFiltersApplied}
            />
            <GameCardView empty={empty} games={games} />
          </div>
        </div>

        <Footer />
      </div>
    </ChakraProvider>
  );
}
