"use client";

import ReactMarkdown from "react-markdown";

interface MarkdownPreviewProps {
  content: string;
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <div className="legal-markdown min-h-[12rem] rounded-sm border border-border bg-soft-white p-4 text-sm">
      <ReactMarkdown>{content || "_Nothing to preview yet._"}</ReactMarkdown>
    </div>
  );
}
