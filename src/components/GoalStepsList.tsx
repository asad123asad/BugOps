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
import { reorderGoalSteps, toggleGoalStep, deleteGoalStep } from "@/app/actions/goals";

function arrayMove<T>(array: T[], from: number, to: number): T[] {
  const copy = [...array];
  const element = copy[from];
  copy.splice(from, 1);
  copy.splice(to, 0, element);
  return copy;
}

const sensors = [
  {
    sensor: MouseSensor,
    options: {
      activationConstraint: {
        distance: 5,
      },
    },
  },
  {
    sensor: TouchSensor,
    options: {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    },
  },
];

interface GoalStep {
  id: string;
  title: string;
  is_completed: boolean;
  sort_order: number;
  created_at: string;
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

function SortableGoalStepItem({
  step,
  goalId,
  onStepChanged,
}: {
  step: GoalStep;
  goalId: string;
  onStepChanged: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useSortable({
    id: step.id,
    data: { index: step.sort_order },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: "transform 0.2s ease",
  } as React.CSSProperties;

  const isDone = step.is_completed;

  async function handleToggle() {
    await toggleGoalStep(step.id, !isDone);
    onStepChanged();
  }

  async function handleDelete() {
    if (!confirm("Delete this step?")) return;
    await deleteGoalStep(step.id);
    onStepChanged();
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 rounded-lg border border-bugops-brown/20 bg-white transition-all duration-300 ${
        isDragging
          ? "z-50 shadow-lg scale-[1.02] border-[var(--bugops-green)] bg-[var(--bugops-bg)]"
          : ""
      }`}
    >
      <DragHandle {...attributes} {...listeners} />
      <input
        type="checkbox"
        checked={isDone}
        onChange={handleToggle}
        className="w-4 h-4 text-bugops-green border-bugops-brown/30 rounded focus:ring-bugops-green/50 shrink-0"
      />
      <span
        className={`flex-1 text-sm ${isDone ? "line-through text-bugops-black/40" : "text-bugops-black"}`}
      >
        {step.title}
      </span>
      <button
        onClick={handleDelete}
        className="text-xs text-red-600 hover:text-red-700"
        title="Delete step"
        aria-label="Delete step"
      >
        ×
      </button>
    </div>
  );
}

export default function GoalStepsList({
  steps,
  goalId,
  onStepChanged,
}: {
  steps: GoalStep[];
  goalId: string;
  onStepChanged: () => void;
}) {
  const [orderedSteps, setOrderedSteps] = useState<GoalStep[]>(steps);

  const activeSensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  useEffect(() => {
    setOrderedSteps(steps);
  }, [steps]);

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = orderedSteps.findIndex((s: GoalStep) => s.id === active.id);
    const newIndex = orderedSteps.findIndex((s: GoalStep) => s.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const newSteps = arrayMove(orderedSteps, oldIndex, newIndex);
    setOrderedSteps(newSteps);

    const orderedIds = newSteps.map((s) => s.id);
    try {
      await reorderGoalSteps(goalId, orderedIds);
    } catch (error) {
      console.error("Failed to reorder goal steps", error);
      setOrderedSteps(orderedSteps);
    }
  }

  return (
    <DndContext sensors={activeSensors} onDragEnd={handleDragEnd}>
      <SortableContext
        items={orderedSteps.map((s) => s.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {orderedSteps.length === 0 ? (
            <p className="text-bugops-brown/70 text-center py-8">
              No steps yet. Add your first step above.
            </p>
          ) : (
            orderedSteps.map((step: GoalStep) => (
              <SortableGoalStepItem
                key={step.id}
                step={step}
                goalId={goalId}
                onStepChanged={onStepChanged}
              />
            ))
          )}
        </div>
      </SortableContext>
    </DndContext>
  );
}
