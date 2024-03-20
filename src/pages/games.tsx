import { Footer } from "@/components/Navigation/Footer";
import Header from "@/components/Navigation/Header";
import { userDataSchema } from "@/components/ProfileModal/ProfileModal";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { z } from "zod";
import {
  Box,
  ChakraProvider,
  Divider,
  InputGroup,
  InputLeftElement,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import GameCard from "@/components/GameComponent/GameCard";
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
  const [filterOpen, setFilterOpen] = useState(false);
  const router = useRouter();
  const [empty, setEmpty] = useState(false);

  interface QueryParams {
    page: number;
    gameBuilds?: string;
    name?: string;
    theme?: string;
    gameContent?: string;
    accessibility?: string;
    tags?: string;
  }

  useEffect(() => {
    getGames();
    getThemes();
  }, []);

  useEffect(() => {
    getGames();
  }, [selectedTheme, gameBuilds, gameContent, accessibility, tags, name]);

  async function getGames() {
    const queryParams: QueryParams = {
      page: 1,
      theme: selectedTheme,
    };

    if (gameBuilds.length > 0) {
      setGameBuilds(
        gameBuilds.map((gb) => {
          if (gb === "Amazon") {
            return "amazon";
          } else if (gb === "Android") {
            return "android";
          } else if (gb === "App Store") {
            return "appstore";
          } else if (gb === "Linux") {
            return "linux";
          } else if (gb === "Mac") {
            return "mac";
          } else if (gb === "WebGL") {
            return "webgl";
          } else {
            return "windows";
          }
        }),
      );
      queryParams.gameBuilds = gameBuilds.join(",");
    }

    if (gameContent.length > 0) {
      setGameContent(
        gameContent.map((gc) => {
          if (gc === "Parenting guide") {
            return "parentingGuide";
          } else if (gc === "Lesson plan") {
            return "lessonPlan";
          } else if (gc === "Video trailer") {
            return "videoTrailer";
          } else {
            return "answerKey";
          }
        }),
      );
      queryParams.gameContent = gameContent.join(",");
    }

    if (accessibility.length > 0) {
      queryParams.accessibility = accessibility.join(",");
    }

    if (tags.length > 0) {
      queryParams.tags = tags.join(",");
    }

    if (name.length >= 3) {
      queryParams.name = name;
    }

    if (selectedTheme === "All Games") {
      delete queryParams.theme;
    }

    const queryString = new URLSearchParams(queryParams).toString();

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
                onChange={handleInputChange}
                borderColor="gray.500"
                bg="gray.50"
                color="gray.500"
                placeholder="Filter by name"
              />
            </InputGroup>
            <Popover isOpen={filterOpen} onClose={() => setFilterOpen(false)}>
              <PopoverTrigger>
                <Box
                  onClick={() => {
                    setFilterOpen(!filterOpen);
                  }}
                  className="ml-5 flex w-24 cursor-pointer flex-row items-center justify-center space-x-1 rounded-full border border-[#A9CBEB] bg-blue-50"
                >
                  <p className="select-none	py-2.5 font-inter text-sm font-bold text-[#2352A0]">
                    Filter
                  </p>
                  {filterOpen ? (
                    <TriangleUpIcon color="brand.600" height="9px" />
                  ) : (
                    <TriangleDownIcon color="brand.600" height="9px" />
                  )}
                </Box>
              </PopoverTrigger>
              <PopoverContent mt="10px" ml="32vw" w="750px" h="800px">
                <PopoverBody>
                  {
                    <FilterBody
                      setAcccessibility={setAccessibility}
                      setGameBuilds={setGameBuilds}
                      setGameContent={setGameContent}
                      setTags={setTags}
                      userLabel={userData?.label}
                    />
                  }
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </div>
          {userData?.label === "administrator" ? (
            <button
              onClick={() => {
                router.push("/games/create");
              }}
              className="rounded-md bg-blue-primary px-5 font-sans font-semibold text-[#FAFBFC]"
            >
              Create Game
            </button>
          ) : null}
        </div>

        <div className="m-auto ml-[10vw] w-[80vw]">
          <Divider borderColor="brand.700" borderWidth="1px" />
        </div>

        <div className="m-auto mt-[60px] flex w-[90vw] flex-row">
          <ThemeSidebar
            themes={themes}
            selectedTheme={selectedTheme}
            setSelectedTheme={setSelectedTheme}
          />

          <div className="ml-6 flex w-full flex-row flex-wrap">
            {!empty ? (
              games.map((game) => {
                return (
                  <div className="mb-6 mr-6">
                    <GameCard game={game} />
                  </div>
                );
              })
            ) : (
              <div className="flex w-full flex-row justify-center">
                <p className="mt-40 w-[360px]	text-center font-sans text-[34px] font-medium text-blue-primary">
                  Oops! No games match this search
                </p>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </ChakraProvider>
  );
}
