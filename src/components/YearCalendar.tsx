"use client";

import Link from "next/link";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function YearCalendar() {
  const year = new Date().getFullYear();

  return (
    <div>
      <h1 className="text-2xl font-bold text-bugops-black mb-6">
        {year} Calendar
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {MONTHS.map((month, index) => (
          <Link
            key={month}
            href={`/dashboard/month/${year}/${index + 1}`}
            className="block p-4 rounded-xl border border-bugops-brown/20 bg-white hover:border-bugops-green/50 hover:shadow-md transition text-center"
          >
            <span className="font-medium text-bugops-black">{month}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
