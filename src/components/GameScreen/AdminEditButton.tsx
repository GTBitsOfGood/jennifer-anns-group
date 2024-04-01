import Link from "next/link";
import Image from "next/image";

interface AdminEditButtonProps {
  gameId: String;
}

export default function AdminEditButton({ gameId }: AdminEditButtonProps) {
  return (
    <div className="mx-auto flex w-[80vw] justify-end">
      <Link href={`/games/${gameId}/edit`}>
        <button className="rounded-full bg-input-border">
          <div className="flex flex-row py-2 pl-3.5 pr-4">
            <Image
              width={24}
              height={24}
              src={`/editIcon.png`}
              alt="edit-icon"
            />
            <p className="ml-1 font-sans text-base font-medium text-blue-primary">
              Edit
            </p>
          </div>
        </button>
      </Link>
    </div>
  );
}
