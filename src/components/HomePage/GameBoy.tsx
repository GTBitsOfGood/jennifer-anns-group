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
      <div className="absolute left-[50%] top-[28%] -translate-x-1/2 -translate-y-1/2 transform">
        {imageUrl && (
          <img
            src={imageUrl}
            className="h-auto w-full scale-[.95] transform rounded-3xl border-2 border-orange-primary md:border-4"
            alt="Overlay Image"
          />
        )}
      </div>
    </div>
  );
};

export default GameBoy;
