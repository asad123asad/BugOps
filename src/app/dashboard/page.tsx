import { createClient } from "@/lib/supabase/server";
import YearCalendar from "@/components/YearCalendar";
import type { Quote } from "@/lib/supabase";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const year = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const monthStats = Array.from({ length: 12 }, () => ({ completed: 0, total: 0 }));

  let quoteOfTheDay: Quote | null = null;

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

    const { data: quotes } = await supabase
      .from("quotes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1);

    if (quotes && quotes.length > 0) {
      quoteOfTheDay = quotes[0] as Quote;
    }
  }

  const monthProgress = monthStats.map((s, i) => ({
    month: i + 1,
    progress: s.total > 0 ? (s.completed / s.total) * 100 : 0,
    totalTasks: s.total,
  }));

  return (
    <YearCalendar
      year={year}
      monthProgress={monthProgress}
      currentMonth={currentMonth}
      quoteOfTheDay={quoteOfTheDay}
    />
  );
}
