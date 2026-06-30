"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItemsForRole } from "@/lib/nav";
import { useAuth } from "@/lib/auth-context";

export function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const items = navItemsForRole(user?.role);

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-name">Vertex Work</span>
        <span className="sidebar-brand-tag">ERP · CRM · WMS</span>
      </div>
      <nav className="sidebar-nav">
        {items.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <Link key={item.href} href={item.href} className={`sidebar-link${active ? " active" : ""}`}>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        <button type="button" className="btn btn-ghost" style={{ color: "rgba(246,244,238,0.72)", padding: "8px 0" }} onClick={() => logout()}>
          Выйти
        </button>
      </div>
    </aside>
  );
}
