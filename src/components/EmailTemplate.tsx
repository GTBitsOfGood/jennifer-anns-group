import { Html } from "@react-email/html";

interface Props {
  url: string;
}
export function Email(props: Props) {
  const { url } = props;
  return <Html lang="en">Hello!</Html>;
}
