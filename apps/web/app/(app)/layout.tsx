"use client";

import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { useRequireAuth } from "@/lib/auth-context";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useRequireAuth();

  if (loading || !user) {
    return <div className="loading-state">Загрузка…</div>;
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-column">
        <Topbar />
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
