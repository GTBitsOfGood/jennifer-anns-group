import React, { PropsWithChildren } from "react";

interface Props {
  title: string;
  setIsAlertShowing: React.Dispatch<React.SetStateAction<boolean>>;
}

const RegistrationAlert = (props: PropsWithChildren<Props>) => {
  return (
    <div className="relative mb-4 w-[20em] rounded-md border border-red-500 bg-white p-3">
      <button
        className="absolute right-2 top-1 cursor-pointer text-xs text-red-500"
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
      <p className="mb-2 text-xs text-red-500">{props.title}</p>
      <div className="text-xs text-grey">{props.children}</div>
    </div>
  );
};

export default RegistrationAlert;
