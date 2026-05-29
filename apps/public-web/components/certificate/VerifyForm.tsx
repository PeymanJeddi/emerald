"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { normalizeCertificateCode } from "@/lib/utils";

interface VerifyFormProps {
  compact?: boolean;
  defaultCode?: string;
}

const inputClass =
  "flex-1 border border-border bg-soft-white px-4 py-2.5 text-sm text-emerald placeholder:text-graphite/40 focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald";

export function VerifyForm({ compact = false, defaultCode = "" }: VerifyFormProps) {
  const router = useRouter();
  const [code, setCode] = useState(defaultCode);
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const normalized = normalizeCertificateCode(code);
    if (!normalized) {
      setError("Please enter a certificate verification code.");
      return;
    }
    setError("");
    router.push(`/verify/${encodeURIComponent(normalized)}`);
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? "" : "max-w-xl"}>
      <label htmlFor="certificate-code" className="block text-sm font-medium text-emerald">
        Certificate verification code
      </label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input
          id="certificate-code"
          name="code"
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            if (error) setError("");
          }}
          placeholder="ESC-2026-AI-001"
          className={inputClass}
          aria-invalid={!!error}
          aria-describedby={error ? "verify-error" : "verify-hint"}
        />
        <Button type="submit" className={compact ? "sm:shrink-0" : ""}>
          Verify
        </Button>
      </div>
      {error ? (
        <p id="verify-error" className="mt-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : (
        <p id="verify-hint" className="mt-2 text-xs text-graphite/60">
          Enter your certificate code (e.g. ESC-2026-AI-001) or submission reference
          (ESC-SUB-2026-002) after your certificate has been issued.
        </p>
      )}
    </form>
  );
}
