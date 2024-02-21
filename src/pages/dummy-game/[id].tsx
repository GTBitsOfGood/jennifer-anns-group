import BuildUpload from "@/components/BuildUpload";
import EmbeddedGame from "@/components/EmbeddedGame";
import { useRouter } from "next/router";

export default function Game({}) {
  const router = useRouter();
  const { id } = router.query;

  if (!id) {
    return <></>;
  }

  return (
    <div>
      <h1>Game</h1>
      <EmbeddedGame gameId={id as string} />
      <BuildUpload />
    </div>
  );
}
