"use client";

import Link from "next/link";
import ProgressCircle from "./ProgressCircle";

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
}

export default function YearCalendar({ year, monthProgress }: YearCalendarProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-bugops-black mb-2">
        {year} Calendar
      </h1>
      <p className="text-bugops-brown/80 text-sm mb-6">
        Track your monthly progress at a glance. Click a month to view days and manage tasks. Green = all done, Brown = in progress.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {MONTHS.map((month, index) => {
          const stats = monthProgress[index] ?? { progress: 0, totalTasks: 0 };
          return (
            <Link
              key={month}
              href={`/dashboard/month/${year}/${index + 1}`}
              className="block p-4 rounded-xl border border-bugops-brown/20 bg-white hover:border-bugops-green/50 hover:shadow-md transition text-center"
            >
              <span className="block font-medium text-bugops-black mb-2">{month}</span>
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
