import { useRouter } from "next/router";
import PDF from "@/components/PDF";
import UploadPage from "@/components/UploadPDF";
import PDFViewer from "@/components/PDFViewer";

function DummyPdfPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <h2>
        <b>Upload Lesson Plan PDF</b>
      </h2>
      <UploadPage fileType="lessonPlan" />
      <h2>
        <b>Upload Parenting Guide PDF</b>
      </h2>
      <UploadPage fileType="parentingGuide" />
      <PDFViewer fileId="65cffd8d1788415e0f7da11d" />
    </div>
  );
}

export default DummyPdfPage;
