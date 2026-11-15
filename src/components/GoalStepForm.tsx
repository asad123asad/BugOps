"use client";

import { useState } from "react";
import { addGoalStep, toggleGoalStep, deleteGoalStep } from "@/app/actions/goals";
import { useRouter } from "next/navigation";
import GoalStepItem from "@/components/GoalStepItem";

interface GoalStepFormProps {
  goalId: string;
  onStepAdded: () => void;
}

export default function GoalStepForm({ goalId, onStepAdded }: GoalStepFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    await addGoalStep(goalId, title.trim());
    setTitle("");
    onStepAdded();
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 flex gap-2 rounded-xl border border-bugops-brown/20 bg-white p-3"
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add next step..."
        className="flex-1 px-4 py-2 rounded-lg border border-bugops-brown/30 bg-white text-bugops-black focus:ring-2 focus:ring-bugops-green/50 outline-none"
      />
      <button
        type="submit"
        className="px-4 py-2 rounded-lg bg-bugops-green text-white font-medium hover:bg-bugops-green/90 transition"
      >
        Add Step
      </button>
    </form>
  );
}
