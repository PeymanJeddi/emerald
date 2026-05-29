"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

const ACCEPTED =
  ".pdf,.doc,.docx,.ppt,.pptx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation";

interface FileUploadBoxProps {
  id: string;
  label: string;
  optional?: boolean;
  onFileSelect?: (file: File | null) => void;
}

export function FileUploadBox({
  id,
  label,
  optional,
  onFileSelect,
}: FileUploadBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-navy">
        {label}
        {optional && (
          <span className="ml-1 font-normal text-gray-500">(optional)</span>
        )}
      </label>
      <div
        className={cn(
          "mt-2 border border-dashed border-border bg-ivory px-4 py-8 text-center transition-colors",
          "hover:border-navy/40"
        )}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={ACCEPTED}
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null;
            setFileName(file?.name ?? null);
            onFileSelect?.(file);
          }}
        />
        <p className="text-sm text-gray-600">
          Drag and drop or{" "}
          <button
            type="button"
            className="font-medium text-navy underline"
            onClick={() => inputRef.current?.click()}
          >
            browse files
          </button>
        </p>
        <p className="mt-2 text-xs text-gray-500">
          PDF, DOC, DOCX, PPT, PPTX — max 10 MB per file (placeholder)
        </p>
        {fileName && (
          <p className="mt-3 text-sm font-medium text-navy">{fileName}</p>
        )}
      </div>
    </div>
  );
}
