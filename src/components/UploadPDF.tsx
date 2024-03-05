interface Props {
  formNameKey: string;
}

function UploadPDF({ formNameKey }: Props) {
  return <input name={formNameKey} type="file" accept=".pdf" />;
}

export default UploadPDF;
