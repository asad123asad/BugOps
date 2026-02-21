"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  }

  return (
    <header className="border-b border-bugops-brown/20 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-xl font-bold text-bugops-green">
          Bugops
        </Link>
        <button
          onClick={handleLogout}
          className="text-sm text-bugops-brown hover:text-bugops-black transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
