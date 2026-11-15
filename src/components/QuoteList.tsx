"use client";

import { useState } from "react";
import { addQuote, deleteQuote } from "@/app/actions/quotes";
import { useRouter } from "next/navigation";
import type { Quote } from "@/lib/supabase";
import QuoteItem from "@/components/QuoteItem";

interface QuoteListProps {
  quotes: Quote[];
}

export default function QuoteList({ quotes }: QuoteListProps) {
  const router = useRouter();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [isAdding, setIsAdding] = useState(false);
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    await addQuote(content.trim(), author.trim() || undefined);
    setContent("");
    setAuthor("");
    setIsAdding(false);
    router.refresh();
  }

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this quote?")) return;
    await deleteQuote(id);
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-bugops-black">Quotes</h1>
        <button
          onClick={() => setIsAdding((v) => !v)}
          className="px-4 py-2 rounded-lg border border-bugops-brown/30 bg-white text-bugops-black font-medium hover:bg-bugops-brown/5 transition"
        >
          {isAdding ? "Cancel" : "+ Add Quote"}
        </button>
      </div>

      {isAdding && (
        <form
          onSubmit={handleAdd}
          className="mb-6 rounded-xl border border-bugops-brown/20 bg-white p-4 space-y-3"
        >
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Quote text (required)"
            className="w-full px-4 py-2 rounded-lg border border-bugops-brown/30 bg-white text-bugops-black focus:ring-2 focus:ring-bugops-green/50 outline-none"
            rows={3}
          />
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Author (optional)"
            className="w-full px-4 py-2 rounded-lg border border-bugops-brown/30 bg-white text-bugops-black focus:ring-2 focus:ring-bugops-green/50 outline-none"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-bugops-green text-white font-medium hover:bg-bugops-green/90 transition"
            >
              Save Quote
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-lg border border-bugops-brown/30 bg-white text-bugops-black hover:bg-bugops-brown/5 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {quotes.length === 0 && (
          <p className="text-bugops-brown/70 text-center py-8">
            No quotes saved yet. Add one above.
          </p>
        )}
        {quotes.map((quote) => (
          <QuoteItem
            key={quote.id}
            quote={quote}
            isExpanded={expandedIds.has(quote.id)}
            onToggle={() => toggleExpand(quote.id)}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
