import HtmlToReact from "html-to-react";

const htmlToReactParser = HtmlToReact.Parser();

interface MarkdownRendererProps {
  markdown: string;
  parse: (markdown: string) => string;
  className: string;
}

export default function MarkdownRenderer({
  markdown,
  parse,
  className,
}: MarkdownRendererProps) {
  const html = parse(markdown);
  const reactElement = htmlToReactParser.parse(html);

  return <div className={className}>{reactElement}</div>;
}
