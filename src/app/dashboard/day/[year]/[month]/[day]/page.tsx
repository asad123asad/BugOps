import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
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

      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-bugops-black">{dateLabel}</h1>
        <ProgressCircle progress={progress} totalTasks={total} size={40} strokeWidth={4} />
        <span className="text-sm text-bugops-brown">
          {completed}/{total} tasks done
        </span>
      </div>

      <AddTaskForm date={dateStr} />

      <div className="space-y-3">
        {tasks && tasks.length > 0 ? (
          tasks.map((task) => <TaskItem key={task.id} task={task} />)
        ) : (
          <p className="text-bugops-brown/70 text-center py-8">
            No tasks for this day. Add one above.
          </p>
        )}
      </div>
    </div>
  );
}
