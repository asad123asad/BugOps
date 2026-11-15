"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addTask } from "@/app/actions/tasks";

interface AddTaskFormProps {
  date: string;
}

export default function AddTaskForm({ date }: AddTaskFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await addTask(date, title.trim(), description.trim() || undefined);
      setTitle("");
      setDescription("");
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="rounded-xl border border-bugops-brown/20 bg-[var(--bugops-bg)] p-4 space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title (required)"
          required
          className="w-full px-4 py-2.5 text-base rounded-lg border border-bugops-brown/30 bg-[var(--bugops-bg)] text-[var(--bugops-text)] focus:ring-2 focus:ring-bugops-green/50 focus:border-bugops-green outline-none"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          className="w-full px-4 py-2.5 text-base rounded-lg border border-bugops-brown/30 bg-[var(--bugops-bg)] text-[var(--bugops-text)] focus:ring-2 focus:ring-bugops-green/50 focus:border-bugops-green outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full min-h-[44px] px-4 py-2.5 text-base rounded-lg bg-bugops-green text-white font-medium hover:bg-bugops-green/90 disabled:opacity-60 transition"
        >
          {loading ? "Adding..." : "Add Task"}
        </button>
      </div>
    </form>
  );
}
