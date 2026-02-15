"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";

export function CopyButton({ data }: { data: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="btn-gold flex items-center gap-2 py-2 px-4 text-xs"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? "Berhasil Disalin!" : "Salin Daftar WA"}
    </button>
  );
}
