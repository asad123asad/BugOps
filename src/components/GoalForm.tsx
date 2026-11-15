"use client";

import { useState } from "react";
import { addGoal } from "@/app/actions/goals";
import { useRouter } from "next/navigation";

interface GoalFormProps {
  onGoalAdded: () => void;
}

export default function GoalForm({ onGoalAdded }: GoalFormProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    await addGoal(title.trim(), description.trim() || undefined);
    setTitle("");
    setDescription("");
    setIsOpen(false);
    onGoalAdded();
    router.refresh();
  }

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 rounded-lg border border-bugops-brown/30 bg-white text-bugops-black font-medium hover:bg-bugops-brown/5 transition flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        + Add Goal
      </button>

      {isOpen && (
        <form
          onSubmit={handleSubmit}
          className="mt-3 rounded-xl border border-bugops-brown/20 bg-white p-4 space-y-3"
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Goal title (required)"
            className="w-full px-4 py-2 rounded-lg border border-bugops-brown/30 bg-white text-bugops-black focus:ring-2 focus:ring-bugops-green/50 outline-none"
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="w-full px-4 py-2 rounded-lg border border-bugops-brown/30 bg-white text-bugops-black focus:ring-2 focus:ring-bugops-green/50 outline-none"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-bugops-green text-white font-medium hover:bg-bugops-green/90 transition"
            >
              Save Goal
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 rounded-lg border border-bugops-brown/30 bg-white text-bugops-black hover:bg-bugops-brown/5 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
