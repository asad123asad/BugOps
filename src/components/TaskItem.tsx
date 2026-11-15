"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Task, TaskStatus } from "@/lib/supabase";
import { updateTaskStatus, deleteTask } from "@/app/actions/tasks";

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const router = useRouter();
  const [isDone, setIsDone] = useState(task.status === "done");
  const [isOptimistic, setIsOptimistic] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const statusColors: Record<string, string> = {
    start: "border-bugops-brown/20 bg-[var(--bugops-bg)]",
    in_progress: "border-bugops-brown/40 bg-bugops-brown/5",
    done: "border-[var(--bugops-green)]/40 bg-emerald-50/60 dark:bg-emerald-950/25 shadow-sm shadow-green-600/30",
  };

  async function handleToggle() {
    const next = !isDone;
    setIsDone(next);
    setIsOptimistic(true);
    const prevStatus = task.status;
    await updateTaskStatus(task.id, next ? "done" : "start", task.date);
    setIsOptimistic(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Delete this task?")) return;
    setIsDeleting(true);
    await deleteTask(task.id, task.date);
    router.refresh();
  }

  const createdTime = new Date(task.created_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border transition-all duration-300 ${
        statusColors[task.status]
      } ${isOptimistic ? "scale-95" : ""}`}
    >
      <button
        onClick={handleToggle}
        className={`w-7 h-7 min-w-[28px] rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 active:scale-75 border-2 ${
          isDone
            ? "bg-[var(--bugops-green)] text-white border-[var(--bugops-green)] shadow-sm shadow-green-600/30"
            : "border-bugops-brown/30 bg-[var(--bugops-bg)] text-bugops-brown/40 hover:border-bugops-green/50"
        }`}
        aria-label={isDone ? "Mark as incomplete" : "Mark as done"}
      >
        {isDone ? (
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="white"
            strokeWidth={3}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : null}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span
            className={`font-medium transition-all duration-300 ${
              isDone
                ? "line-through text-bugops-black/40"
                : "text-bugops-black"
            }`}
          >
            {task.title}
          </span>
          {task.status === "in_progress" && !isDone && (
            <span className="text-[10px] font-bold bg-bugops-brown/10 text-bugops-brown px-1.5 py-0.5 rounded">
              In Progress
            </span>
          )}
        </div>
        {task.description && (
          <p
            className={`mt-1 text-sm transition-all duration-300 ${
              isDone ? "line-through text-bugops-black/30" : "text-bugops-black/70"
            }`}
          >
            {task.description}
          </p>
        )}
        <span className="text-xs text-bugops-brown/50 mt-1 block">
          {createdTime}
        </span>
      </div>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className={`w-8 h-8 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-all disabled:opacity-50`}
        title="Delete"
        aria-label="Delete task"
      >
        ×
      </button>
    </div>
  );
}
