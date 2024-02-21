import { uploadBuildFiles } from "@/utils/file";
import { useState } from "react";

export default function BuildUpload() {
  const [loaderFile, setLoaderFile] = useState<null | File>(null);
  const [dataFile, setDataFile] = useState<null | File>(null);
  const [codeFile, setCodeFile] = useState<null | File>(null);
  const [frameworkFile, setFrameworkFile] = useState<null | File>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null || event.target.files.length === 0) return;

    const file = event.target.files[0];
    const name = event.target.name;

    switch (name) {
      case "loader":
        setLoaderFile(file);
        break;
      case "data":
        setDataFile(file);
        break;
      case "code":
        setCodeFile(file);
        break;
      case "framework":
        setFrameworkFile(file);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      loaderFile === null ||
      dataFile === null ||
      codeFile === null ||
      frameworkFile === null
    ) {
      alert("Please select all files");
      return;
    }

    const files = new Map([
      ["loader", loaderFile],
      ["data", dataFile],
      ["code", codeFile],
      ["framework", frameworkFile],
    ]);

    await uploadBuildFiles("1", files);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h1 className="font-bold">Upload Build (id=1)</h1>
        <h1>Loader</h1>
        <input type="file" name="loader" onChange={handleFileChange} />
        <h1>Data</h1>
        <input type="file" name="data" onChange={handleFileChange} />
        <h1>Code</h1>
        <input type="file" name="code" onChange={handleFileChange} />
        <h1>Framework</h1>
        <input type="file" name="framework" onChange={handleFileChange} />
        <button type="submit" className="block cursor-pointer font-bold">
          submit
        </button>
      </form>
    </>
  );
}
