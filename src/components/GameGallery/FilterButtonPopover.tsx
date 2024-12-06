import {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  Button,
  PopoverCloseButton,
} from "@chakra-ui/react";
import FilterBody from "@/components/GameGallery/FilterBody";
import React from "react";
import { UserLabel } from "@/utils/types";
import { PageRequiredGameQuery } from "../Admin/ThemesTags/GamesSection";
import { Filter } from "lucide-react";
import cx from "classnames";

type FilterButtonPopoverProps = {
  filters: PageRequiredGameQuery;
  hasFilters: boolean;
  setFilters: any;
  userData: any;
  onCloseFilterModal: () => void;
  onOpenFilterModal: () => void;
  isOpenFilterModal: boolean;
};

const FilterButtonPopover: React.FC<FilterButtonPopoverProps> = ({
  filters,
  hasFilters,
  setFilters,
  userData,
  onCloseFilterModal,
  onOpenFilterModal,
  isOpenFilterModal,
}) => {
  return (
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
      <PopoverContent className="min-h-[500px] w-[100vw] rounded-lg md:w-[730px]">
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
  );
};

export default FilterButtonPopover;
