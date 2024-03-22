interface Props {
  fileUrl: string;
  height?: string | number | undefined;
}

export default function PDFViewer({ fileUrl, height = "600px" }: Props) {
  return <iframe src={fileUrl} width="100%" height={height} />;
}
