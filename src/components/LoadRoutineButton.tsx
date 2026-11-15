"use client";

import { useRouter } from "next/navigation";
import { applyRoutineToDate } from "@/app/actions/routines";

interface LoadRoutineButtonProps {
  dateStr: string;
}

export default function LoadRoutineButton({ dateStr }: LoadRoutineButtonProps) {
  const router = useRouter();

  async function handleLoadRoutine() {
    await applyRoutineToDate(dateStr);
    router.refresh();
  }

  return (
    <button
      onClick={handleLoadRoutine}
      className="mb-6 px-4 py-2 rounded-lg border border-bugops-brown/30 bg-white text-bugops-black font-medium hover:bg-bugops-brown/5 transition flex items-center gap-2"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      Load Daily Routine
    </button>
  );
}
