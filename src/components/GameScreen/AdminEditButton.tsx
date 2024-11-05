import type { MutableRefObject } from "react";
import { useRouter } from "next/compat/router";

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
    router?.push(`/games/${gameId}/edit`);
  };

  return (
    <button
      onClick={handleEditClick}
      className="rounded-md bg-blue-primary px-4 py-3 font-sans text-xl font-medium text-white hover:bg-blue-hover"
    >
      Edit Game
    </button>
  );
}
