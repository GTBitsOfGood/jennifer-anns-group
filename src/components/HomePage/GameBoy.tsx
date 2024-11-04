import React from "react";

interface Props {
  imageUrl: string | null;
}

const GameBoy: React.FC<Props> = ({ imageUrl }) => {
  return (
    <div className="relative">
      <img
        src="/gameboy-template.png"
        className="h-auto w-full"
        alt="Gameboy"
      />
      <div className="absolute left-[50%] top-[28%] h-[30%] w-[48%] -translate-x-1/2 -translate-y-1/2 transform overflow-hidden rounded-3xl border-2 border-orange-primary md:border-[3.5px]">
        <div className="flex h-full w-full">
          {imageUrl && (
            <img
              src={imageUrl}
              className="h-full w-full object-cover"
              alt="Overlay Image"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GameBoy;
