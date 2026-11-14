import Header from "@/components/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--bugops-bg)]">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
