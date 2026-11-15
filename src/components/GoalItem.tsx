"use client";

import Link from "next/link";
import { deleteGoal } from "@/app/actions/goals";
import { useRouter } from "next/navigation";
import type { Goal } from "@/lib/supabase";

interface GoalItemProps {
  goal: Goal;
  completedSteps: number;
  totalSteps: number;
  onDelete: () => void;
}

export default function GoalItem({
  goal,
  completedSteps,
  totalSteps,
  onDelete,
}: GoalItemProps) {
  const router = useRouter();
  const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  const statusColors: Record<string, string> = {
    active: "text-bugops-green bg-bugops-green/10 border-bugops-green/20",
    completed: "text-bugops-brown bg-bugops-brown/10 border-bugops-brown/20",
    paused: "text-bugops-brown/60 bg-bugops-brown/5 border-bugops-brown/30",
  };

  async function handleDelete() {
    if (!confirm("Delete this goal and all its steps?")) return;
    await deleteGoal(goal.id);
    onDelete();
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-bugops-brown/20 bg-white p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold text-bugops-black">{goal.title}</h3>
          {goal.description && (
            <p className="text-sm text-bugops-black/70 mt-1">{goal.description}</p>
          )}
        </div>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded border ${statusColors[goal.status] ?? statusColors.active}`}
        >
          {goal.status}
        </span>
      </div>

      <div className="flex items-center gap-4 mb-3">
        <span className="text-sm text-bugops-brown/70">
          {completedSteps}/{totalSteps} steps done
        </span>
        <span className="text-xs font-bold text-bugops-black">{progress}%</span>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href={`/dashboard/config/goals/${goal.id}`}
          className="text-sm text-bugops-green hover:text-bugops-green/90 font-medium flex items-center gap-1"
        >
          View Roadmap →
        </Link>
        <button
          onClick={handleDelete}
          className="text-xs text-red-600 hover:text-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
