import { createClient } from "@/lib/supabase/server";
import GoalList from "@/components/GoalList";
import type { Goal } from "@/lib/supabase";

interface GoalWithStats extends Goal {
  completedSteps: number;
  totalSteps: number;
}

export default async function GoalsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bugops-bg)] px-4">
        <div className="text-center max-w-md">
          <h1 className="text-xl font-semibold text-bugops-black mb-2">
            Not authenticated
          </h1>
          <a
            href="/auth/login"
            className="px-4 py-2 rounded-lg bg-bugops-green text-white font-medium hover:bg-bugops-green/90"
          >
            Sign in
          </a>
        </div>
      </div>
    );
  }

  const { data: goals = [] } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: steps = [] } = await supabase
    .from("goal_steps")
    .select("goal_id, is_completed")
    .eq("user_id", user.id);

  const stepStats = new Map<string, { completed: number; total: number }>();
  (steps as any[]).forEach((s) => {
    const gid = s.goal_id;
    const current = stepStats.get(gid) ?? { completed: 0, total: 0 };
    current.total += 1;
    if (s.is_completed) current.completed += 1;
    stepStats.set(gid, current);
  });

  const goalsWithStats: GoalWithStats[] = (goals as Goal[]).map((g) => {
    const stats = stepStats.get(g.id) ?? { completed: 0, total: 0 };
    return {
      ...g,
      completedSteps: stats.completed,
      totalSteps: stats.total,
    };
  });

  return <GoalList goals={goalsWithStats} />;
}
