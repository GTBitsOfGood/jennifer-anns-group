import React from "react";
import { ADMIN_CONTACT } from "@/utils/adminConsts";

const UnauthorizedAdmin = () => {
  return (
    <div className="relative bg-white border border-red-500 rounded-md p-3 mb-4 w-[20em]">
      <button
        className="absolute top-1 right-2 text-red-500 cursor-pointer text-xs"
        onClick={() => {}}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <p className="text-red-500 text-xs mb-2">
        Your account has not been authorized
      </p>
      <p className="text-grey text-xs">
        Your account has not been granted access. This site is for Jennifer
        Ann’s Group administration only. Please contact{" "}
        <strong>
          <em>{ADMIN_CONTACT}</em>{" "}
        </strong>
        for assistance if needed.
      </p>
    </div>
  );
};

export default UnauthorizedAdmin;
