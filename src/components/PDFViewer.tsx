import { useEffect, useState } from "react";

interface Props {
  fileId: string;
}

export default function PDFViewer({ fileId }: Props) {
  const [pdfData, setPdfData] = useState<Blob | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/dummy-pdf/${fileId}`);
        const data = await response.blob();
        console.log(data);
        setPdfData(data);
      } catch (error) {
        console.error("Error fetching PDF:", error);
      }
    }
    fetchData();
  }, [fileId]);

  return (
    <div>
      {pdfData && (
        <iframe
          src={URL.createObjectURL(pdfData)}
          width="100%"
          height="600px"
          frameBorder="0"
          title="PDF Viewer"
        />
      )}
    </div>
  );
}
