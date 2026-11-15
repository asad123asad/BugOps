import { createClient } from "@/lib/supabase/server";
import QuoteList from "@/components/QuoteList";
import type { Quote } from "@/lib/supabase";

export default async function QuotesPage() {
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

  const { data } = await supabase
    .from("quotes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return <QuoteList quotes={(data as Quote[]) ?? []} />;
}
