import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Button,
  Text,
} from "@chakra-ui/react";
import { ChevronsUpDown, Check } from "lucide-react";
import cx from "classnames";
import { SortType } from "@/utils/types";

type SortButtonPopoverProps = {
  filters: any;
  setFilters: (filters: any) => void;
  selectedSort: SortType;
  setSelectedSort: (sort: SortType) => void;
  isOpenSortModal: boolean;
  onOpenSortModal: () => void;
  onCloseSortModal: () => void;
};

const SortButtonPopover: React.FC<SortButtonPopoverProps> = ({
  filters,
  setFilters,
  selectedSort,
  setSelectedSort,
  isOpenSortModal,
  onOpenSortModal,
  onCloseSortModal,
}) => {
  return (
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
            {Object.values(SortType).map((item, index) => (
              <button
                key={index}
                className={cx(
                  "flex flex-row justify-between px-4 py-2 text-left font-inter text-sm text-black hover:bg-menu-item-hover",
                  {
                    "text-blue-primary": selectedSort === item,
                  },
                )}
                onClick={() => {
                  setFilters({ ...filters, sort: item });
                  setSelectedSort(item);
                  onCloseSortModal();
                }}
              >
                {item}
                <Check
                  className={cx("flex justify-end", {
                    "text-blue-primary": selectedSort === item,
                  })}
                  size="16"
                />
              </button>
            ))}
          </div>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default SortButtonPopover;
