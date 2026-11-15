"use client";

import { useState } from "react";
import { addRoutineItem, deleteRoutineItem } from "@/app/actions/routines";
import { useRouter } from "next/navigation";
import type { DailyRoutine } from "@/lib/supabase";

interface RoutineListProps {
  routines: DailyRoutine[];
}

export default function RoutineList({ routines }: RoutineListProps) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [description, setDescription] = useState("");

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    await addRoutineItem(title.trim(), description.trim() || undefined, timeSlot.trim() || undefined);
    setTitle("");
    setTimeSlot("");
    setDescription("");
    setIsAdding(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this routine item?")) return;
    await deleteRoutineItem(id);
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-bugops-black">Daily Routine</h1>
        <button
          onClick={() => setIsAdding((v) => !v)}
          className="px-4 py-2 rounded-lg border border-bugops-brown/30 bg-white text-bugops-black font-medium hover:bg-bugops-brown/5 transition"
        >
          {isAdding ? "Cancel" : "+ Add Routine"}
        </button>
      </div>

      {isAdding && (
        <form
          onSubmit={handleAdd}
          className="mb-6 rounded-xl border border-bugops-brown/20 bg-white p-4 space-y-3"
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (required)"
            className="w-full px-4 py-2 rounded-lg border border-bugops-brown/30 bg-white text-bugops-black focus:ring-2 focus:ring-bugops-green/50 outline-none"
          />
          <input
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            placeholder="Time / Label (e.g. Morning, 08:00 AM)"
            className="w-full px-4 py-2 rounded-lg border border-bugops-brown/30 bg-white text-bugops-black focus:ring-2 focus:ring-bugops-green/50 outline-none"
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="w-full px-4 py-2 rounded-lg border border-bugops-brown/30 bg-white text-bugops-black focus:ring-2 focus:ring-bugops-green/50 outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-bugops-green text-white font-medium hover:bg-bugops-green/90 transition"
          >
            Add to Routine
          </button>
        </form>
      )}

      <div className="space-y-3">
        {routines.length === 0 && (
          <p className="text-bugops-brown/70 text-center py-8">
            No routine items configured. Add one above.
          </p>
        )}
        {routines.map((routine) => (
          <div
            key={routine.id}
            className="rounded-xl border border-bugops-brown/20 bg-white p-4 flex items-start gap-3"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-bugops-black">{routine.title}</span>
                {routine.time_slot && (
                  <span className="text-xs px-1.5 py-0.5 rounded border border-bugops-brown/30 bg-bugops-brown/10 text-bugops-brown font-medium">
                    {routine.time_slot}
                  </span>
                )}
              </div>
              {routine.description && (
                <p className="text-sm text-bugops-black/70">
                  {routine.description}
                </p>
              )}
            </div>
            <button
              onClick={() => handleDelete(routine.id)}
              className="text-xs text-red-600 hover:text-red-700 px-2 py-1"
              title="Delete"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
