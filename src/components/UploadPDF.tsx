import { useState, ChangeEvent } from "react";
import axios from "axios";

interface UploadPageProps {
  fileType: "lessonPlan" | "parentingGuide";
}

function UploadPage({ fileType }: UploadPageProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    setSelectedFile(file || null);
  };

  const handleUpload = async () => {
    try {
      setUploading(true);
      if (!selectedFile) return;
      const formData = new FormData();
      formData.append("file", selectedFile);
      const response = await axios.post<{ fileId: string }>(
        `/api/test/65b2b48b449e5fdaef32dc0f`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setFileId(response.data.fileId);
      setUploading(false);
    } catch (error) {
      setUploadError("Failed to upload file.");
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <br></br>
      <button onClick={handleUpload} disabled={!selectedFile || uploading}>
        Upload
      </button>
      <br></br>
      <br></br>
      {uploading && <p>Uploading...</p>}
      {fileId && <p>File uploaded successfully. File ID: {fileId}</p>}
      {uploadError && <p>{uploadError}</p>}
    </div>
  );
}

export default UploadPage;
