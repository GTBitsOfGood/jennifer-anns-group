import React, { PropsWithChildren } from "react";
import { Image } from "@chakra-ui/react";

interface Props {
  containerClassName?: string;
}

function HeroImage(props: PropsWithChildren<Props>) {
  return (
    <div className="flex h-dvh w-dvw flex-row bg-gradient-to-b from-[#fdd299] to-[#fc9000]">
      <div className="flex h-full w-[45%] max-w-[45%] flex-col items-center justify-center p-5">
        <div>
          <h1 className="mb-6 w-[6em] font-open-sans-cond text-6xl font-extrabold uppercase text-white">
            Jennifer Ann&apos;s Group
          </h1>
          <div className="flex h-[3rem] flex-row">
            <h3 className="pr-4 font-open-sans-cond text-5xl font-extralight uppercase italic text-white">
              Life. Love.
            </h3>
            <Image
              src="/logo.png"
              className="max-h-full max-w-full"
              alt="Logo"
            />
          </div>
        </div>
      </div>
      <div
        style={{
          borderTopLeftRadius: "35% 100%",
          borderBottomLeftRadius: "35% 100%",
        }}
        className={`h-full w-[55%] max-w-[55%] bg-white ${
          props.containerClassName ?? ""
        }`}
      >
        {props.children}
      </div>
    </div>
  );
}

export default HeroImage;
