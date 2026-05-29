import ReactMarkdown from "react-markdown";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export function MarkdownContent({ content, className = "" }: MarkdownContentProps) {
  return (
    <div className={`legal-markdown ${className}`.trim()}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
