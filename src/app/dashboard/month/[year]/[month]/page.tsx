import { createClient } from "@/lib/supabase/server";
import MonthCalendar from "@/components/MonthCalendar";

interface PageProps {
  params: Promise<{ year: string; month: string }>;
}

export default async function MonthPage({ params }: PageProps) {
  const { year, month } = await params;
  const yearNum = parseInt(year, 10);
  const monthNum = parseInt(month, 10);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const startDate = new Date(yearNum, monthNum - 1, 1).toISOString().split("T")[0];
  const endDate = new Date(yearNum, monthNum, 0).toISOString().split("T")[0];

  const { data: tasks } = await supabase
    .from("tasks")
    .select("date, status")
    .eq("user_id", user.id)
    .gte("date", startDate)
    .lte("date", endDate);

  const dayStats = new Map<
    number,
    { completed: number; total: number }
  >();

  const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    dayStats.set(d, { completed: 0, total: 0 });
  }

  tasks?.forEach((t) => {
    const dateNum = parseInt(t.date.split("-")[2], 10);
    const curr = dayStats.get(dateNum) ?? { completed: 0, total: 0 };
    curr.total += 1;
    if (t.status === "done") curr.completed += 1;
    dayStats.set(dateNum, curr);
  });

  const dayProgress = Array.from(dayStats.entries()).map(
    ([date, { completed, total }]) => ({
      date,
      progress: total > 0 ? (completed / total) * 100 : 0,
      totalTasks: total,
      completedTasks: completed,
    })
  );

  return (
    <MonthCalendar year={yearNum} month={monthNum} dayProgress={dayProgress} />
  );
}
