import Image from "next/image";
import type { MutableRefObject } from "react";
import { useRouter } from "next/router";

interface AdminEditButtonProps {
  gameId: String;
  deleteOnRouteChange: MutableRefObject<boolean>;
}

export default function AdminEditButton({
  gameId,
  deleteOnRouteChange,
}: AdminEditButtonProps) {
  const router = useRouter();

  const handleEditClick = () => {
    deleteOnRouteChange.current = false;
    router.push(`/games/${gameId}/edit`);
  };

  return (
    <div className="mx-auto flex w-[80vw] justify-end">
      <button
        className="rounded-full bg-input-border"
        onClick={handleEditClick}
      >
        <div className="flex flex-row py-2 pl-3.5 pr-4">
          <Image width={24} height={24} src={`/editIcon.png`} alt="edit-icon" />
          <p className="ml-1 font-sans text-base font-medium text-blue-primary">
            Edit
          </p>
        </div>
      </button>
    </div>
  );
}
