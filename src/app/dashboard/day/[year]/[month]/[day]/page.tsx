import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LoadRoutineButton from "@/components/LoadRoutineButton";
import type { Task } from "@/lib/supabase";
import ProgressCircle from "@/components/ProgressCircle";
import TaskItem from "@/components/TaskItem";
import AddTaskForm from "@/components/AddTaskForm";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

interface PageProps {
  params: Promise<{ year: string; month: string; day: string }>;
}

export default async function DayPage({ params }: PageProps) {
  const { year, month, day } = await params;
  const yearNum = parseInt(year, 10);
  const monthNum = parseInt(month, 10);
  const dayNum = parseInt(day, 10);
  const dateStr = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  let tasks: Task[] | null = null;
  try {
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .eq("date", dateStr)
      .order("created_at", { ascending: true });
    tasks = (data as Task[]) ?? [];
  } catch {
    tasks = [];
  }

  const total = tasks?.length ?? 0;
  const completed = tasks?.filter((t) => t.status === "done").length ?? 0;
  const progress = total > 0 ? (completed / total) * 100 : 0;
  const allDone = total > 0 && completed === total;

  const { data: routines } = await supabase
    .from("daily_routines")
    .select("id")
    .eq("user_id", user.id)
    .limit(1);
  const hasRoutines = routines && routines.length > 0;

  const dateLabel = `${MONTHS[monthNum - 1]} ${dayNum}, ${yearNum}`;

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href={`/dashboard/month/${year}/${month}`}
          className="text-bugops-brown hover:text-bugops-green transition"
        >
          ← Back to {MONTHS[monthNum - 1]}
        </Link>
      </div>

      <div className="rounded-xl border border-bugops-brown/20 bg-[var(--bugops-bg)] p-4 sm:p-6 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-bugops-black">
              {dateLabel}
            </h1>
            <span className="text-sm text-bugops-brown/70 mt-1 block sm:mt-0">
              {MONTHS[monthNum - 1]} {dayNum}, {yearNum}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ProgressCircle progress={progress} totalTasks={total} size={40} strokeWidth={4} />
            <span className="text-sm font-medium text-bugops-black">
              {completed}/{total} tasks done
            </span>
          </div>
        </div>
        {allDone && (
          <div className="mt-4 sm:mt-6 rounded-lg bg-bugops-green/10 border border-bugops-green/20 p-3 sm:p-4 flex items-center gap-3">
            <svg className="w-5 h-5 text-bugops-green" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm sm:text-base font-semibold text-bugops-green">
              All tasks completed!
            </span>
          </div>
        )}
      </div>

      {hasRoutines && (
        <LoadRoutineButton dateStr={dateStr} />
      )}

      <AddTaskForm date={dateStr} />

      <div className="space-y-3">
        {tasks && tasks.length > 0 ? (
          tasks.map((task) => <TaskItem key={task.id} task={task} />)
        ) : (
          <div className="rounded-xl border border-bugops-brown/20 bg-[var(--bugops-bg)] p-6 sm:p-8 text-center">
            <svg className="w-8 h-8 mx-auto mb-3 text-bugops-brown/20" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <h3 className="text-sm font-medium text-bugops-black mb-1">No tasks for this day</h3>
            <p className="text-xs text-bugops-brown/60">Add one above to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
