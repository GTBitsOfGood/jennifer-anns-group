import Image from "next/image";

export default function EmailSentNotification({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <div className="absolute top-[-18vh] flex w-[20%] min-w-[20em] items-center gap-2 rounded-md bg-[#C6E3F9] p-3">
      <img
        className="h-5 w-5"
        src="/check_circle_outline.png"
        alt="Check Circle Icon"
      />
      <div className="flex items-start">
        <span className="text-xs">
          A confirmation code has been sent to your email address. Please check
          your inbox.
        </span>
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
