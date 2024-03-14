import { Footer } from "@/components/Navigation/Footer";
import Header from "@/components/Navigation/Header";
import { userDataSchema } from "@/components/ProfileModal/ProfileModal";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { z } from "zod";
import {
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

export default function Games() {
  const { data: session } = useSession();
  const currentUser = session?.user;
  const [userData, setUserData] = useState<z.infer<typeof userDataSchema>>();
  const [games, setGames] = useState<z.infer<typeof gameSchema>[]>();
  const [themes, setThemes] = useState<string[]>();
  const [selectedTheme, setSelectedTheme] = useState("All Games");
  const [gameBuilds, setGameBuilds] = useState<string[]>();
  const [gameContent, setGameContent] = useState<string[]>();
  const [accessibility, setAccessibility] = useState<string[]>();
  const [tags, setTags] = useState<string[]>();
  const [name, setName] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    getGames();
    getThemes();
  }, []);

  async function getGames() {
    const response = await fetch(`/api/games/?page=1`);
    const data = await response.json();
    setGames(data);
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

  return (
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

      <div className="m-auto mb-11 flex w-[80vw] flex-row">
        <InputGroup w="200px">
          <InputLeftElement pointerEvents="none">
            <Search2Icon color="gray.500" />
          </InputLeftElement>
          <Input
            borderColor="gray.500"
            bg="gray.50"
            color="gray.500"
            placeholder="Filter by name"
          />
        </InputGroup>
        <Popover>
          <PopoverTrigger>
            <div
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
            </div>
          </PopoverTrigger>
          <PopoverContent mt="10px" ml="32vw" w="750px" h="800px">
            <PopoverBody>
              {<FilterBody userLabel={userData?.label} />}
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </div>

      <div className="m-auto ml-[10vw] w-[80vw]">
        <Divider borderColor="brand.700" borderWidth="1px" />
      </div>

      <div className="m-auto mt-[60px] flex w-[90vw] flex-row">
        <div className="flex h-[365px] w-[260px] flex-col overflow-y-scroll">
          <p
            onClick={() => {
              setSelectedTheme("All Games");
            }}
            className={
              selectedTheme === "All Games"
                ? "mb-[26px] cursor-pointer font-sans text-2xl font-bold text-[#2352A0]"
                : "mb-[26px] cursor-pointer font-sans text-2xl text-neutral-500"
            }
          >
            All Games
          </p>
          {themes
            ? themes.map((theme) => {
                return (
                  <p
                    onClick={() => {
                      setSelectedTheme(theme);
                    }}
                    className={
                      selectedTheme === theme
                        ? "mb-[26px] cursor-pointer font-sans text-2xl font-bold text-[#2352A0]"
                        : "mb-[26px] cursor-pointer font-sans text-2xl text-neutral-500"
                    }
                  >
                    {theme}
                  </p>
                );
              })
            : null}
        </div>

        <div className="ml-6 flex flex-row flex-wrap">
          {games
            ? games.map((game) => {
                return (
                  <div className="mb-6 mr-6">
                    <GameCard game={game} />
                  </div>
                );
              })
            : null}
        </div>
      </div>

      <Footer />
    </div>
  );
}
