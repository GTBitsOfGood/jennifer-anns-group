import Image from "next/image";

export default function ErrorNotification({
  errorMessage,
  onClick,
}: {
  errorMessage: string;
  onClick: () => void;
}) {
  return (
    <div className="absolute top-[-18vh] flex w-[20%] min-w-[20em] items-center gap-2 rounded-md border-2 border-solid border-red-400 p-3">
      <img className="h-5 w-5" src="/error.svg" alt="Error Icon" />
      <div className="flex min-w-[90%] items-start justify-between">
        <span className="text-xs">{errorMessage}</span>
        <Image
          src="/cross.svg"
          alt="Cross Icon"
          width={15}
          height={15}
          role="button"
          onClick={onClick}
        />
      </div>
    </div>
  );
}
