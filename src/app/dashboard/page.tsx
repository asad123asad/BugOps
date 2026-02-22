import { createClient } from "@/lib/supabase/server";
import YearCalendar from "@/components/YearCalendar";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const year = new Date().getFullYear();

  const monthStats = Array.from({ length: 12 }, () => ({ completed: 0, total: 0 }));

  if (user) {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;
    const { data: tasks } = await supabase
      .from("tasks")
      .select("date, status")
      .eq("user_id", user.id)
      .gte("date", startDate)
      .lte("date", endDate);

    tasks?.forEach((t) => {
      const monthNum = parseInt(t.date.split("-")[1], 10);
      const idx = monthNum - 1;
      monthStats[idx].total += 1;
      if (t.status === "done") monthStats[idx].completed += 1;
    });
  }

  const monthProgress = monthStats.map((s, i) => ({
    month: i + 1,
    progress: s.total > 0 ? (s.completed / s.total) * 100 : 0,
    totalTasks: s.total,
  }));

  return (
    <YearCalendar year={year} monthProgress={monthProgress} />
  );
}
