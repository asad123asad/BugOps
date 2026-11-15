"use client";

import { useState } from "react";
import { deleteGoal } from "@/app/actions/goals";
import { useRouter } from "next/navigation";
import GoalForm from "@/components/GoalForm";
import GoalItem from "@/components/GoalItem";
import type { Goal } from "@/lib/supabase";

interface GoalWithStats extends Goal {
  completedSteps: number;
  totalSteps: number;
}

interface GoalListProps {
  goals: GoalWithStats[];
}

export default function GoalList({ goals }: GoalListProps) {
  const router = useRouter();
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  async function handleDelete(goalId: string) {
    if (!confirm("Delete this goal and all its steps?")) return;
    await deleteGoal(goalId);
    setDeletedIds((prev) => {
      const next = new Set(prev);
      next.add(goalId);
      return next;
    });
    router.refresh();
  }

  return (
    <div>
      <GoalForm onGoalAdded={() => router.refresh()} />

      <div className="space-y-3">
        {goals.length === 0 && (
          <p className="text-bugops-brown/70 text-center py-8">
            No goals yet. Create your first one above.
          </p>
        )}
        {goals
          .filter((g) => !deletedIds.has(g.id))
          .map((goal) => (
            <GoalItem
              key={goal.id}
              goal={goal}
              completedSteps={goal.completedSteps}
              totalSteps={goal.totalSteps}
              onDelete={() => handleDelete(goal.id)}
            />
          ))}
      </div>
    </div>
  );
}
