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
import { useRouter } from "next/compat/router";
import ThemeSidebar from "@/components/GameGallery/ThemeSidebar";
import SelectedFilters from "@/components/GameGallery/SelectedFilters";
import GameCardView from "@/components/GameGallery/GameCardView";
import GamesPagination from "@/components/GameGallery/GamesPagination";
import { PageRequiredGameQuery } from "@/components/Admin/ThemesTags/GamesSection";
import { Filter, ChevronsUpDown, Check } from "lucide-react";
import cx from "classnames";
import { SortType } from "@/utils/types";

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
    (filters.gameBuilds?.length ?? 0) > 0;

  return (
    <div className="m-[72px]">
      <ChakraProvider theme={chakraTheme} resetCSS={false}>
        <div className="flex items-center justify-center">
          <div className="flex-1"></div>
          <h1 className="mb-16 mt-10 text-center font-sans text-6xl font-semibold">
            Game Gallery
          </h1>
          <div className="relative flex flex-1 justify-end">
            {userData?.label === "administrator" ? (
              <button
                onClick={() => {
                  router?.push("/games/create");
                }}
                className="rounded-md bg-blue-primary px-4 py-3 font-sans text-lg text-white hover:bg-[#4F75B3]"
              >
                Create Game
              </button>
            ) : null}
          </div>
        </div>
        <div className="mb-6 flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-6">
            <InputGroup className="w-[400px]">
              <InputLeftElement pointerEvents="none">
                <Search2Icon className="text-input-stroke" />
              </InputLeftElement>
              {/* prettier-ignore */}
              <Input
                className="border-input-stroke text-input-stroke placeholder-input-stroke h-auto rounded-md bg-input-bg py-2 pl-9 pr-3 font-inter text-base"
                onChange={(e) => setName(e.target.value)}
                placeholder="Search games"
              />
            </InputGroup>
            {/* sort button and popover */}
            <Popover
              placement="bottom-start"
              onOpen={onOpenSortModal}
              onClose={onCloseSortModal}
              isOpen={isOpenSortModal}
            >
              <PopoverTrigger>
                <Button className="flex h-9 items-center justify-center rounded-full bg-white p-0">
                  <Text className="select-none pr-1 font-inter">Sort by:</Text>
                  <Text className="select-none font-inter font-bold text-blue-primary">
                    {selectedSort}
                  </Text>
                  <ChevronsUpDown className="h-4 text-blue-primary" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-fit p-0">
                <PopoverBody className="my-2 p-0">
                  <div className="flex w-52 flex-col">
                    {Object.values(SortType).map((item, index) => {
                      return (
                        <button
                          key={index}
                          className={cx(
                            "flex flex-row justify-between px-4 py-2 text-left font-inter text-sm text-black hover:bg-menu-item-hover",
                            {
                              "text-blue-primary": selectedSort === item,
                            },
                          )}
                          onClick={() => {
                            setFilters({ ...filters, sort: item as SortType });
                            setSelectedSort(item as SortType);
                            onCloseSortModal();
                          }}
                        >
                          {item}
                          <Check className="flex justify-end" size="16" />
                        </button>
                      );
                    })}
                  </div>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </div>
          {/* filter button and popover */}
          <Popover
            placement="bottom-end"
            onOpen={onOpenFilterModal}
            onClose={onCloseFilterModal}
            isOpen={isOpenFilterModal}
          >
            <PopoverTrigger>
              <Button
                className={cx(
                  "mx-5 my-2.5 flex items-center justify-center rounded-full border",
                  {
                    "bg-brand-800 border-blue-bg": hasFilters,
                    "border-gray-300 bg-white hover:bg-light-gray": !hasFilters,
                  },
                )}
              >
                <Text
                  className={cx("select-none font-inter font-bold text-black", {
                    "text-blue-primary": hasFilters,
                  })}
                >
                  Filters
                </Text>
                <Filter
                  className={cx("ml-1 h-4 text-black", {
                    "text-blue-primary": hasFilters,
                  })}
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="min-h-[500px] w-[730px] rounded-lg">
              <PopoverCloseButton
                className="mr-11 mt-11 h-6 w-6 p-0 font-semibold text-blue-primary"
                size="md"
              />
              <PopoverBody className="m-12 p-0">
                <FilterBody
                  setFilters={setFilters}
                  filters={filters}
                  userLabel={userData?.label}
                  onClose={onCloseFilterModal}
                />
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </div>
        {hasFilters && (
          <SelectedFilters setFilters={setFilters} filters={filters} />
        )}

        <div>
          <Divider className="border border-border" />
        </div>

        <div className="mt-12">
          <div className="justify-left flex flex-row">
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
          {numPages ? (
            <div className="mb-14 mt-6">
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
