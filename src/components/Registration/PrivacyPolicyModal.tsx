import React from "react";
import Image from "next/image";

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex h-[500px] w-[512px] flex-col items-start rounded-lg bg-white pb-6">
        <div className="flex justify-between self-stretch border-b-[1px] border-gray-200 p-6">
          <h1 className="text-lg font-semibold text-blue-primary">
            Privacy Policy
          </h1>
          <Image
            src={"/cross.svg"}
            alt="No views"
            width={24}
            height={24}
            onClick={onClose}
          />
        </div>
        <div className="flex flex-col items-start gap-3 overflow-auto p-6">
          <div className="flex flex-col items-start self-stretch">
            <h2 className="pb-3 font-semibold text-gray-500">
              1. Section Title
            </h2>
            <p className="text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur.
            </p>
          </div>
          <div className="flex flex-col items-start self-stretch">
            <h2 className="pb-3 font-semibold text-gray-500">
              2. Section Title
            </h2>
            <p className="text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur.
            </p>
          </div>
          <div className="flex flex-col items-start self-stretch">
            <h2 className="pb-3 font-semibold text-gray-500">
              3. Section Title
            </h2>
            <p className="text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
