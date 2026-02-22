"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bugops-white px-4">
      <div className="text-center max-w-md">
        <h1 className="text-xl font-semibold text-bugops-black mb-2">
          Something went wrong
        </h1>
        <p className="text-bugops-brown/80 mb-6 text-sm">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 rounded-lg bg-bugops-green text-white font-medium hover:bg-bugops-green/90"
          >
            Try again
          </button>
          <Link
            href="/auth/login"
            className="px-4 py-2 rounded-lg border border-bugops-brown/30 text-bugops-black font-medium hover:bg-bugops-brown/5"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
