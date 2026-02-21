"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Task, TaskStatus } from "@/lib/supabase";
import { updateTaskStatus, deleteTask } from "@/app/actions/tasks";

interface TaskItemProps {
  task: Task;
}

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "start", label: "Start" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

export default function TaskItem({ task }: TaskItemProps) {
  const router = useRouter();
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [isDeleting, setIsDeleting] = useState(false);

  const isDone = status === "done";

  async function handleStatusChange(newStatus: TaskStatus) {
    setStatus(newStatus);
    await updateTaskStatus(task.id, newStatus, task.date);
    router.refresh();
  }

  async function handleDelete() {
    if (confirm("Delete this task?")) {
      setIsDeleting(true);
      await deleteTask(task.id, task.date);
      router.refresh();
    }
  }

  const createdTime = new Date(task.created_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border transition ${
        status === "in_progress"
          ? "border-bugops-brown/40 bg-bugops-brown/5"
          : "border-bugops-brown/20 bg-white"
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          {isDone && (
            <span className="text-bugops-green text-lg" title="Done">
              ✓
            </span>
          )}
          <span
            className={`font-medium ${
              isDone
                ? "line-through text-bugops-green"
                : "text-bugops-black"
            }`}
          >
            {task.title}
          </span>
          <span className="text-xs text-bugops-brown/70">{createdTime}</span>
        </div>
        {task.description && (
          <p
            className={`mt-1 text-sm ${
              isDone ? "line-through text-bugops-brown/60" : "text-bugops-black/70"
            }`}
          >
            {task.description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
          disabled={isDone}
          className="text-sm rounded-lg border border-bugops-brown/30 bg-white text-bugops-black px-2 py-1 focus:ring-2 focus:ring-bugops-green/50 outline-none"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-red-600 hover:text-red-700 text-sm px-2"
          title="Delete"
        >
          ×
        </button>
      </div>
    </div>
  );
}
