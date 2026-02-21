"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bugops-white px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-bugops-green">
            Bugops
          </Link>
        </div>
        <div className="rounded-2xl shadow-lg p-8 border border-bugops-brown/20 bg-white">
          <h1 className="text-xl font-semibold text-bugops-black mb-6">
            Create account
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-bugops-black mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-bugops-brown/30 bg-white text-bugops-black focus:ring-2 focus:ring-bugops-green/50 focus:border-bugops-green outline-none transition"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-bugops-black mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2 rounded-lg border border-bugops-brown/30 bg-white text-bugops-black focus:ring-2 focus:ring-bugops-green/50 focus:border-bugops-green outline-none transition"
                placeholder="Min 6 characters"
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-bugops-green text-white font-medium hover:bg-bugops-green/90 disabled:opacity-60 transition"
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-bugops-black/70">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-bugops-green font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
