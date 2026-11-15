"use client";

import Link from "next/link";
import ProgressCircle from "./ProgressCircle";
import type { Quote } from "@/lib/supabase";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

interface MonthProgress {
  month: number;
  progress: number;
  totalTasks: number;
}

interface YearCalendarProps {
  year: number;
  monthProgress: MonthProgress[];
  currentMonth?: number;
  quoteOfTheDay?: Quote | null;
}

export default function YearCalendar({ year, monthProgress, currentMonth, quoteOfTheDay }: YearCalendarProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-bugops-black mb-2">
        {year} Calendar
      </h1>
      {quoteOfTheDay && (
        <section className="mb-6 rounded-xl border border-bugops-green/30 bg-bugops-green/5 p-4 flex items-center gap-3">
          <span className="text-xs font-bold text-bugops-green uppercase tracking-wider">Quote of the Day</span>
          <p className="flex-1 text-bugops-black text-sm italic">
            &quot;{quoteOfTheDay.content}&quot;
          </p>
          {quoteOfTheDay.author && (
            <span className="text-xs text-bugops-brown/70">— {quoteOfTheDay.author}</span>
          )}
        </section>
      )}
      <p className="text-bugops-brown/80 text-sm mb-6">
        Track your monthly progress at a glance. Click a month to view days and manage tasks. Green = all done, Brown = in progress.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {MONTHS.map((month, index) => {
          const stats = monthProgress[index] ?? { progress: 0, totalTasks: 0 };
          const isCurrent = currentMonth === index + 1;
          return (
            <Link
              key={month}
              href={`/dashboard/month/${year}/${index + 1}`}
              className={`block p-4 rounded-xl transition text-center ${isCurrent
                ? "border-2 border-bugops-green bg-bugops-green/5 shadow-sm"
                : "border border-bugops-brown/20 bg-white hover:border-bugops-green/50 hover:shadow-md"}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="block font-medium text-bugops-black">{month}</span>
                {isCurrent && (
                  <span className="text-[10px] font-bold bg-bugops-green text-white px-1.5 py-0.5 rounded">Current</span>
                )}
              </div>
              <div className="flex justify-center mb-1">
                <ProgressCircle
                  progress={stats.progress}
                  totalTasks={stats.totalTasks}
                  size={36}
                  strokeWidth={4}
                />
              </div>
              <span className="text-[10px] text-bugops-brown/80">
                {stats.totalTasks > 0 ? `${Math.round(stats.progress)}%` : "—"}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
