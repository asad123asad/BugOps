import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function ConfigPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let quoteCount = 0;
  let routineCount = 0;
  let goalCount = 0;

  if (user) {
    const { count: qCount } = await supabase
      .from("quotes")
      .select("*", { head: true, count: "exact" })
      .eq("user_id", user.id);
    quoteCount = qCount ?? 0;

    const { count: rCount } = await supabase
      .from("daily_routines")
      .select("*", { head: true, count: "exact" })
      .eq("user_id", user.id);
    routineCount = rCount ?? 0;

    const { count: gCount } = await supabase
      .from("goals")
      .select("*", { head: true, count: "exact" })
      .eq("user_id", user.id);
    goalCount = gCount ?? 0;
  }

  return (
    <div className="min-h-screen bg-[var(--bugops-bg)]">
      <Link
        href="/dashboard"
        className="text-bugops-brown hover:text-bugops-green transition inline-block mb-6"
      >
        ← Back to Dashboard
      </Link>
      <h1 className="text-2xl font-bold text-bugops-black mb-8">
        Configuration
      </h1>
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        <section className="rounded-2xl shadow-lg p-8 border border-bugops-brown/20 bg-[var(--bugops-bg)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-bugops-black">
                Quotes
              </h2>
              <p className="text-sm text-bugops-brown/70 mt-1">
                Save and browse your favorite quotes.
              </p>
            </div>
            <span className="text-2xl font-bold text-bugops-green">
              {quoteCount}
            </span>
          </div>
          <Link
            href="/dashboard/config/quotes"
            className="w-full py-3 rounded-lg border border-bugops-brown/30 bg-white text-bugops-black font-medium hover:bg-bugops-brown/5 transition text-center"
          >
            Manage Quotes
          </Link>
        </section>
        <section className="rounded-2xl shadow-lg p-8 border border-bugops-brown/20 bg-[var(--bugops-bg)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-bugops-black">
                Daily Routine
              </h2>
              <p className="text-sm text-bugops-brown/70 mt-1">
                Configure recurring daily tasks to import any day.
              </p>
            </div>
            <span className="text-2xl font-bold text-bugops-green">
              {routineCount}
            </span>
          </div>
          <Link
            href="/dashboard/config/routine"
            className="w-full py-3 rounded-lg border border-bugops-brown/30 bg-white text-bugops-black font-medium hover:bg-bugops-brown/5 transition text-center"
          >
            Manage Routine
          </Link>
        </section>
        <section className="rounded-2xl shadow-lg p-8 border border-bugops-brown/20 bg-[var(--bugops-bg)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-bugops-black">
                Goals
              </h2>
              <p className="text-sm text-bugops-brown/70 mt-1">
                Track long-term goals with step-by-step roadmaps.
              </p>
            </div>
            <span className="text-2xl font-bold text-bugops-green">
              {goalCount}
            </span>
          </div>
          <Link
            href="/dashboard/config/goals"
            className="w-full py-3 rounded-lg border border-bugops-brown/30 bg-white text-bugops-black font-medium hover:bg-bugops-brown/5 transition text-center"
          >
            Manage Goals
          </Link>
        </section>
      </div>
    </div>
  );
}
