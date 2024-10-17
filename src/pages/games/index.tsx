import { userDataSchema } from "@/components/ProfileModal/ProfileModal";
import { useSession } from "next-auth/react";
import { Suspense, useEffect, useState } from "react";
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
import { Search2Icon } from "@chakra-ui/icons";
import { Input } from "@chakra-ui/react";
import FilterBody from "@/components/GameGallery/FilterBody";
import chakraTheme from "@/styles/chakraTheme";
import { useRouter } from "next/router";
import ThemeSidebar from "@/components/GameGallery/ThemeSidebar";
import SelectedFilters from "@/components/GameGallery/SelectedFilters";
import GameCardView from "@/components/GameGallery/GameCardView";
import GamesPagination from "@/components/GameGallery/GamesPagination";
import { PageRequiredGameQuery } from "@/components/Admin/ThemesTags/GamesSection";
import { Filter, ChevronsUpDown } from "lucide-react";
import cx from "classnames";

enum SortType {
  AtoZ = "A-Z",
  MostPopular = "Most Popular",
  LastCreated = "Last Created",
  FirstCreated = "First Created",
}

export default function Games() {
  const { data: session } = useSession();
  const currentUser = session?.user;
  const [userData, setUserData] = useState<z.infer<typeof userDataSchema>>();
  const router = useRouter();
  const {
    isOpen: isOpenFilterModal,
    onOpen: onOpenFilterModal,
    onClose: onCloseFilterModal,
  } = useDisclosure();
  const {
    isOpen: isOpenSortModal,
    onOpen: onOpenSortModal,
    onClose: onCloseSortModal,
  } = useDisclosure();

  const [currPage, setCurrPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [filters, setFilters] = useState<PageRequiredGameQuery>({
    page: 1,
    theme: [],
  });
  const [name, setName] = useState("");
  const [selectedSort, setSelectedSort] = useState<SortType>(
    SortType.MostPopular,
  );

  useEffect(() => {
    if (currentUser) {
      getUserData();
    }
  }, [currentUser, userData?.label]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (name.length > 0) {
        setFilters({
          ...filters,
          name: name,
          page: 1,
        });
      } else {
        const { name, ...rest } = filters;
        setFilters(rest);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [name, 500]);

  function getUserData() {
    setUserData(currentUser);
  }

  const hasFilters =
    (filters.accessibility?.length ?? 0) > 0 ||
    (filters.tags?.length ?? 0) > 0 ||
    (filters.gameContent?.length ?? 0) > 0 ||
    (filters.gameBuilds?.length ?? 0) > 0 ||
    (filters.theme?.length ?? 0) > 0;

  return (
    <div>
      <ChakraProvider theme={chakraTheme} resetCSS={false}>
        <h1 className="mb-16 mt-10 text-center font-sans text-6xl font-semibold">
          Game Gallery
        </h1>

        <div className="m-auto mb-6 flex w-[85vw] flex-row justify-between">
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
                onChange={(e) => setName(e.target.value)}
                borderColor="gray.500"
                bg="gray.50"
                color="gray.500"
                placeholder="Filter by name"
                minW="200px"
              />
            </InputGroup>
            {/* filter button and popover */}
            <Popover
              placement="bottom-start"
              onOpen={onOpenFilterModal}
              onClose={onCloseFilterModal}
              isOpen={isOpenFilterModal}
            >
              <PopoverTrigger>
                <Button
                  className={cx(
                    "mx-5 flex h-9 items-center justify-center space-x-1 rounded-full border",
                    {
                      "bg-brand-800 border-blue-bg": hasFilters,
                      "border-gray-300 bg-white hover:bg-light-gray":
                        !hasFilters,
                    },
                  )}
                >
                  <Text
                    className={cx(
                      "select-none font-inter text-sm font-bold text-black",
                      {
                        "text-blue-primary": hasFilters,
                      },
                    )}
                  >
                    Filter
                  </Text>
                  <Filter
                    className={cx("h-4 text-black", {
                      "text-blue-primary": hasFilters,
                    })}
                  />
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
                    setFilters={setFilters}
                    filters={filters}
                    userLabel={userData?.label}
                    onClose={onCloseFilterModal}
                  />
                </PopoverBody>
              </PopoverContent>
            </Popover>
            {/* sort button and popover */}
            <Popover
              placement="bottom-start"
              onOpen={onOpenSortModal}
              onClose={onCloseSortModal}
              isOpen={isOpenSortModal}
            >
              <PopoverTrigger>
                <Button className="bg-brand-800 flex h-9 items-center justify-center space-x-1 rounded-full border border-blue-bg">
                  <Text className="select-none font-inter text-sm font-bold text-blue-primary">
                    {selectedSort}
                  </Text>
                  <ChevronsUpDown className="h-4 text-blue-primary" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-fit">
                <PopoverBody>
                  <div className="m-2 flex flex-col">
                    {Object.values(SortType).map((item, index) => {
                      return (
                        <button
                          key={index}
                          className={cx("mb-2 text-left text-black", {
                            "text-blue-primary": selectedSort === item,
                          })}
                          onClick={() => {
                            setSelectedSort(item as SortType);
                            onCloseSortModal();
                          }}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </PopoverBody>
              </PopoverContent>
            </Popover>
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
        {hasFilters && (
          <div className="m-auto mb-6 flex h-9 w-[85vw] flex-row flex-wrap justify-between">
            <SelectedFilters setFilters={setFilters} filters={filters} />
          </div>
        )}

        <div className="m-auto w-[85vw]">
          <Divider borderColor="brand.700" borderWidth="1px" />
        </div>

        <div>
          <div className="m-auto flex flex-row justify-center">
            <div className="m-auto mt-[60px] flex w-[85vw] flex-row">
              <ThemeSidebar filters={filters} setFilters={setFilters} />
              <Suspense
                fallback={
                  <div className="flex h-96 w-full items-center justify-center">
                    <div className="h-14 w-14 animate-ping rounded-full bg-orange-primary"></div>
                  </div>
                }
              >
                <GameCardView
                  filters={filters}
                  setCurrPage={setCurrPage}
                  setNumPages={setNumPages}
                  numPages={numPages}
                  currPage={currPage}
                />
              </Suspense>
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
