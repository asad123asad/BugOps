"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { reorderTasks } from "@/app/actions/tasks";
import type { Task } from "@/lib/supabase";

function arrayMove<T>(array: T[], from: number, to: number): T[] {
  const copy = [...array];
  const element = copy[from];
  copy.splice(from, 1);
  copy.splice(to, 0, element);
  return copy;
}

function DragHandle() {
  return (
    <div
      className="touch-none cursor-grab active:cursor-grabbing p-2 text-[var(--bugops-brown-light)] select-none shrink-0"
    >
      <div className="flex flex-col gap-1">
        <div className="flex gap-1.5">
          <span className="w-1 h-1 rounded-full bg-current opacity-50" />
          <span className="w-1 h-1 rounded-full bg-current opacity-50" />
          <span className="w-1 h-1 rounded-full bg-current opacity-50" />
        </div>
        <div className="flex gap-1.5">
          <span className="w-1 h-1 rounded-full bg-current opacity-50" />
          <span className="w-1 h-1 rounded-full bg-current opacity-50" />
          <span className="w-1 h-1 rounded-full bg-current opacity-50" />
        </div>
      </div>
    </div>
  );
}

function SortableTaskItem({
  task,
  dateStr,
}: {
  task: Task;
  dateStr: string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { index: task.sort_order },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: "transform 0.2s ease",
  } as React.CSSProperties;

  const isDone = task.status === "done";

  async function handleToggle() {
    const next = !isDone;
    const { updateTaskStatus } = require("@/app/actions/tasks");
    await updateTaskStatus(task.id, next ? "done" : "start", task.date);
  }

  async function handleDelete() {
    if (!confirm("Delete this task?")) return;
    const { deleteTask } = require("@/app/actions/tasks");
    await deleteTask(task.id, task.date);
  }

  const createdTime = new Date(task.created_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-start gap-3 p-4 rounded-xl border transition-all duration-300 ${
        isDragging
          ? "z-50 shadow-lg scale-[1.02] border-[var(--bugops-green)] bg-[var(--bugops-bg)]"
          : task.status === "done"
          ? "border-[var(--bugops-green)]/40 bg-emerald-50/60 dark:bg-emerald-950/25 shadow-sm shadow-green-600/30"
          : task.status === "in_progress"
          ? "border-bugops-brown/40 bg-bugops-brown/5"
          : "border-bugops-brown/20 bg-[var(--bugops-bg)]"
      }`}
    >
      <DragHandle {...attributes} {...listeners} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
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
          <span
            className={`font-medium transition-all duration-300 ${
              isDone ? "line-through text-bugops-black/40" : "text-bugops-black"
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
        className="w-8 h-8 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-all"
        title="Delete"
        aria-label="Delete task"
      >
        ×
      </button>
    </div>
  );
}

export default function DayTaskList({
  tasks,
  dateStr,
}: {
  tasks: Task[];
  dateStr: string;
}) {
  const [orderedTasks, setOrderedTasks] = useState<Task[]>(tasks);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  useEffect(() => {
    setOrderedTasks(tasks);
  }, [tasks]);

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = orderedTasks.findIndex((t: Task) => t.id === active.id);
    const newIndex = orderedTasks.findIndex((t: Task) => t.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const newTasks = arrayMove(orderedTasks, oldIndex, newIndex);
    setOrderedTasks(newTasks);

    const orderedIds = newTasks.map((t) => t.id);
    try {
      await reorderTasks(orderedIds, dateStr);
    } catch (error) {
      console.error("Failed to reorder tasks", error);
      setOrderedTasks(orderedTasks);
    }
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <SortableContext
        items={orderedTasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {orderedTasks.length === 0 ? (
            <p className="text-bugops-brown/70 text-center py-8">
              No tasks for this day. Add one above.
            </p>
          ) : (
            orderedTasks.map((task: Task) => (
              <SortableTaskItem
                key={task.id}
                task={task}
                dateStr={dateStr}
              />
            ))
          )}
        </div>
      </SortableContext>
    </DndContext>
  );
}
