import { userDataSchema } from "@/components/ProfileModal/ProfileModal";
import { useSession } from "next-auth/react";
import { Suspense, useEffect, useState } from "react";
import { z } from "zod";
import {
  ChakraProvider,
  Divider,
  InputGroup,
  InputLeftElement,
  useDisclosure,
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import { Input } from "@chakra-ui/react";
import chakraTheme from "@/styles/chakraTheme";
import { useRouter } from "next/compat/router";
import ThemeSidebar from "@/components/GameGallery/ThemeSidebar";
import SelectedFilters from "@/components/GameGallery/SelectedFilters";
import GameCardView from "@/components/GameGallery/GameCardView";
import GamesPagination from "@/components/GameGallery/GamesPagination";
import { PageRequiredGameQuery } from "@/components/Admin/ThemesTags/GamesSection";
import { SortType } from "@/utils/types";
import FilterButtonPopover from "@/components/GameGallery/FilterButtonPopover";
import SortButtonPopover from "@/components/GameGallery/SortButtonPopover";

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
    <div className="m-[32px] md:m-[72px]">
      <ChakraProvider theme={chakraTheme} resetCSS={false}>
        <div className="flex items-center justify-center">
          <div className="flex-1"></div>
          <h1 className="mb-2 text-center font-sans text-[32px] font-semibold md:mb-16 md:mt-10 md:text-6xl">
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
        <div className="flex flex-row items-center justify-between md:mb-6">
          <div className="flex w-full flex-col items-center justify-center gap-2 md:flex-row md:justify-normal md:gap-6">
            <InputGroup className="w-full md:w-[400px]">
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
            <div className="flex w-full flex-row items-center justify-between gap-6">
              <SortButtonPopover
                filters={filters}
                setFilters={setFilters}
                selectedSort={selectedSort}
                setSelectedSort={setSelectedSort}
                isOpenSortModal={isOpenSortModal}
                onOpenSortModal={onOpenSortModal}
                onCloseSortModal={onCloseSortModal}
              />
              <FilterButtonPopover
                filters={filters}
                setFilters={setFilters}
                hasFilters={hasFilters}
                isOpenFilterModal={isOpenFilterModal}
                onOpenFilterModal={onOpenFilterModal}
                onCloseFilterModal={onCloseFilterModal}
                userData={userData}
              />
            </div>
          </div>
        </div>
        {hasFilters && (
          <SelectedFilters setFilters={setFilters} filters={filters} />
        )}

        <div className="">
          <Divider className="border border-border" />
        </div>

        <div className="mt-12">
          <div className="justify-left flex flex-row">
            <span className="mr-6 hidden md:block">
              <ThemeSidebar filters={filters} setFilters={setFilters} />
            </span>
            <Suspense
              fallback={
                <div className="flex h-96 w-full items-center justify-center">
                  <div className="h-14 w-14 animate-ping rounded-full bg-orange-primary"></div>
                </div>
              }
            >
              <GameCardView
                filters={filters}
                setNumPages={setNumPages}
                numPages={numPages}
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
