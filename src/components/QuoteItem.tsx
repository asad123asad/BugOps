"use client";

import { useState } from "react";
import type { Quote } from "@/lib/supabase";

interface QuoteItemProps {
  quote: Quote;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: (id: string) => void;
}

export default function QuoteItem({
  quote,
  isExpanded,
  onToggle,
  onDelete,
}: QuoteItemProps) {
  const [isCopying, setIsCopying] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(quote.content);
    setIsCopying(true);
    setTimeout(() => setIsCopying(false), 1500);
  }

  function handleDelete() {
    onDelete(quote.id);
  }

  return (
    <div
      className="rounded-xl border border-bugops-brown/20 bg-white p-4 hover:border-bugops-green/50 transition cursor-pointer group"
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") onToggle();
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <p
          className={`text-bugops-black line-clamp-1 ${
            isExpanded ? "line-clamp-none mt-1" : ""
          }`}
        >
          {quote.content}
        </p>
        <span
          className={`text-bugops-brown transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
        >
          ▾
        </span>
      </div>

      {quote.author && (
        <p className="text-xs text-bugops-brown/60 mb-2">— {quote.author}</p>
      )}

      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-bugops-brown/10 flex items-center justify-between gap-2">
          <span className="text-xs text-bugops-brown/50">
            {new Date(quote.created_at).toLocaleDateString()}
          </span>
          <button
            onClick={handleCopy}
            className="text-xs text-bugops-green hover:text-bugops-green/90 flex items-center gap-1"
          >
            {isCopying ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={handleDelete}
            className="text-xs text-red-600 hover:text-red-700"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
