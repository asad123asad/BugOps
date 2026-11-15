"use client";

import { useState } from "react";
import Link from "next/link";
import { updateGoalStatus } from "@/app/actions/goals";
import { useRouter } from "next/navigation";
import GoalStepForm from "@/components/GoalStepForm";
import GoalStepItem from "@/components/GoalStepItem";
import type { Goal } from "@/lib/supabase";

interface GoalStep {
  id: string;
  title: string;
  is_completed: boolean;
  sort_order: number;
  created_at: string;
}

interface GoalDetailProps {
  goal: Goal;
  steps: GoalStep[];
}

export default function GoalDetail({ goal, steps }: GoalDetailProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const completedSteps = steps.filter((s) => s.is_completed).length;
  const totalSteps = steps.length;
  const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  async function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setIsLoading(true);
    await updateGoalStatus(goal.id, e.target.value as "active" | "completed" | "paused");
    setIsLoading(false);
    router.refresh();
  }

  function handleStepAdded() {
    router.refresh();
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard/config/goals"
          className="text-bugops-brown hover:text-bugops-green transition flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          ← Back to Goals
        </Link>
        <h1 className="text-2xl font-bold text-bugops-black">{goal.title}</h1>
      </div>

      {goal.description && (
        <p className="text-bugops-black/70 text-lg mb-6">{goal.description}</p>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium text-bugops-black mb-2">
          Status
        </label>
        <select
          value={goal.status}
          onChange={handleStatusChange}
          disabled={isLoading}
          className="w-full px-4 py-2 rounded-lg border border-bugops-brown/30 bg-white text-bugops-black focus:ring-2 focus:ring-bugops-green/50 outline-none"
        >
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="paused">Paused</option>
        </select>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-bugops-black">Roadmap</h2>
          <span className="text-sm text-bugops-brown/70">
            {completedSteps}/{totalSteps} steps done
          </span>
        </div>
        <div className="w-full bg-bugops-brown/10 rounded-lg h-2 mb-3 overflow-hidden">
          <div
            className="bg-bugops-green h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <GoalStepForm goalId={goal.id} onStepAdded={handleStepAdded} />

      <div className="space-y-2">
        {steps.length === 0 && (
          <p className="text-bugops-brown/70 text-center py-8">
            No steps yet. Add your first step above.
          </p>
        )}
        {steps.map((step) => (
          <GoalStepItem
            key={step.id}
            step={step}
            onStepChanged={() => router.refresh()}
          />
        ))}
      </div>
    </div>
  );
}
