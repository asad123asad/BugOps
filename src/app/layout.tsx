import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bugops - Daily Task Manager",
  description: "Calendar-first task management tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-[var(--bugops-bg)] text-[var(--bugops-text)]">
        {children}
      </body>
    </html>
  );
}
