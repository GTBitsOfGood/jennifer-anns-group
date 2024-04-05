import HtmlToReact from "html-to-react";

const htmlToReactParser = HtmlToReact.Parser();

interface MarkdownRendererProps {
  markdown: string;
  parse: (markdown: string) => string;
}

export default function MarkdownRenderer({
  markdown,
  parse,
}: MarkdownRendererProps) {
  const html = parse(markdown);
  const reactElement = htmlToReactParser.parse(html);

  return <div className="prose">{reactElement}</div>;
}
