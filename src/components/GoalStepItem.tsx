"use client";

import { useState } from "react";
import { toggleGoalStep, deleteGoalStep } from "@/app/actions/goals";
import { useRouter } from "next/navigation";

interface GoalStepItemProps {
  step: {
    id: string;
    title: string;
    is_completed: boolean;
    sort_order: number;
    created_at: string;
  };
  onStepChanged: () => void;
}

export default function GoalStepItem({
  step,
  onStepChanged,
}: GoalStepItemProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleToggle() {
    await toggleGoalStep(step.id, !step.is_completed);
    onStepChanged();
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Delete this step?")) return;
    setIsDeleting(true);
    await deleteGoalStep(step.id);
    setIsDeleting(false);
    onStepChanged();
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-bugops-brown/20 bg-white">
      <input
        type="checkbox"
        checked={step.is_completed}
        onChange={handleToggle}
        className="w-4 h-4 text-bugops-green border-bugops-brown/30 rounded focus:ring-bugops-green/50"
      />
      <span
        className={`flex-1 text-sm ${step.is_completed ? "line-through text-bugops-black/40" : "text-bugops-black"}`}
      >
        {step.title}
      </span>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-xs text-red-600 hover:text-red-700 disabled:opacity-50"
        title="Delete step"
      >
        ×
      </button>
    </div>
  );
}
