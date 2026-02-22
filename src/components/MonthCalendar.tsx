"use client";

import Link from "next/link";
import ProgressCircle from "./ProgressCircle";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface DayProgress {
  date: number;
  progress: number;
  totalTasks: number;
  completedTasks: number;
}

interface MonthCalendarProps {
  year: number;
  month: number;
  dayProgress: DayProgress[];
}

export default function MonthCalendar({
  year,
  month,
  dayProgress,
}: MonthCalendarProps) {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const startOffset = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const progressMap = new Map(
    dayProgress.map((d) => [d.date, { progress: d.progress, totalTasks: d.totalTasks, completedTasks: d.completedTasks }])
  );

  const blankCells = Array(startOffset).fill(null);
  const dayCells = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div>
      <div className="flex items-center gap-4 mb-2">
        <Link
          href="/dashboard"
          className="text-bugops-brown hover:text-bugops-green transition"
        >
          ← Back to year
        </Link>
        <h1 className="text-2xl font-bold text-bugops-black">
          {MONTHS[month - 1]} {year}
        </h1>
      </div>
      <p className="text-bugops-brown/80 text-sm mb-4">
        Click a date to add or manage tasks. Green circle = all done, Brown = in progress, Empty = no tasks.
      </p>

      <div className="grid grid-cols-7 gap-0.5 max-w-2xl">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-bugops-brown py-1"
          >
            {day}
          </div>
        ))}
        {blankCells.map((_, i) => (
          <div key={`blank-${i}`} className="min-h-[56px]" />
        ))}
        {dayCells.map((date) => {
          const data = progressMap.get(date);
          const progress = data?.progress ?? 0;
          const totalTasks = data?.totalTasks ?? 0;
          const completedTasks = data?.completedTasks ?? 0;
          return (
            <Link
              key={date}
              href={`/dashboard/day/${year}/${month}/${date}`}
              className="min-h-[56px] flex flex-col items-center justify-center rounded border border-bugops-brown/20 hover:border-bugops-green/50 hover:bg-bugops-green/5 transition p-1"
            >
              <span className="text-xs font-medium text-bugops-black mb-0.5">
                {date}
              </span>
              <ProgressCircle
                progress={progress}
                totalTasks={totalTasks}
                size={24}
                strokeWidth={4}
              />
              <span className="text-[10px] text-bugops-brown/80 mt-0.5">
                {totalTasks > 0 ? `${Math.round(progress)}%` : "—"}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
