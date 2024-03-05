import { useRouter } from "next/router";
import PDF from "@/components/PDF";
import UploadPage from "@/components/UploadPDF";
import PDFViewer from "@/components/PDFViewer";
import { useQuery } from "@tanstack/react-query";
import { ExtendId } from "@/utils/types";
import { IGame } from "@/server/db/models/GameModel";

function DummyPdfPage() {
  const router = useRouter();
  const { id } = router.query;

  const { data: gameData } = useQuery({
    queryKey: ["game", id],
    queryFn: () =>
      fetch(`/api/games/${id}`).then((res) => res.json()) as Promise<
        ExtendId<IGame>
      >,
  });

  if (!gameData?.lesson) {
    return <div>An error occurred</div>;
  }

  return (
    <div>
      <PDFViewer fileUrl={gameData?.lesson} />
    </div>
  );
}

export default DummyPdfPage;
