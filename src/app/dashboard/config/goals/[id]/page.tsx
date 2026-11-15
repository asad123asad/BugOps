import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import GoalDetail from "@/components/GoalDetail";
import type { Goal } from "@/lib/supabase";

export default async function GoalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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

  const { data: goal } = await supabase
    .from("goals")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!goal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bugops-bg)] px-4">
        <div className="text-center max-w-md">
          <h1 className="text-xl font-semibold text-bugops-black mb-2">
            Goal not found
          </h1>
          <Link
            href="/dashboard/config/goals"
            className="px-4 py-2 rounded-lg bg-bugops-green text-white font-medium hover:bg-bugops-green/90"
          >
            Back to Goals
          </Link>
        </div>
      </div>
    );
  }

  const { data: steps = [] } = await supabase
    .from("goal_steps")
    .select("id, title, is_completed, sort_order, created_at")
    .eq("goal_id", id)
    .eq("user_id", user.id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  return (
    <GoalDetail
      goal={goal as Goal}
      steps={steps as {
        id: string;
        title: string;
        is_completed: boolean;
        sort_order: number;
        created_at: string;
      }[]}
    />
  );
}
