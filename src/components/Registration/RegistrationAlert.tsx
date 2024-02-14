import React, { PropsWithChildren } from "react";

interface Props {
  title: string;
  setIsAlertShowing: React.Dispatch<React.SetStateAction<boolean>>;
}

const RegistrationAlert = (props: PropsWithChildren<Props>) => {
  return (
    <div className="relative bg-white border border-red-500 rounded-md p-3 mb-4 w-[20em]">
      <button
        className="absolute top-1 right-2 text-red-500 cursor-pointer text-xs"
        onClick={() => props.setIsAlertShowing(false)}
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
      <p className="text-red-500 text-xs mb-2">{props.title}</p>
      <p className="text-grey text-xs">{props.children}</p>
    </div>
  );
};

export default RegistrationAlert;
