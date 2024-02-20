import React, { PropsWithChildren } from "react";

interface Props {
  containerClassName?: string;
}

function HeroImage(props: PropsWithChildren<Props>) {
  return (
    <div className="flex h-dvh w-dvw flex-row bg-gradient-to-b from-[#fdd299] to-[#fc9000]">
      <div className="flex h-full w-[45%] max-w-[45%] justify-center flex-col p-5 items-center">
        <div>
          <h1 className="font-open-sans-cond uppercase font-extrabold text-6xl text-white mb-6 w-[6em]">
            Jennifer Ann&apos;s Group
          </h1>
          <div className="flex flex-row h-[3rem]">
            <h3 className="font-open-sans-cond uppercase font-extralight text-5xl text-white italic pr-4">
              Life. Love.
            </h3>
            <img src="/logo.png" className="max-w-full max-h-full" alt="Logo" />
          </div>
        </div>
      </div>
      <div
        style={{
          borderTopLeftRadius: "35% 100%",
          borderBottomLeftRadius: "35% 100%",
        }}
        className={`h-full max-w-[55%] w-[55%] bg-white ${
          props.containerClassName ?? ""
        }`}
      >
        {props.children}
      </div>
    </div>
  );
}

export default HeroImage;
