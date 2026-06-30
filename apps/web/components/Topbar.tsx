"use client";

import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav";
import { useAuth } from "@/lib/auth-context";
import { RoleLabels } from "@/lib/types";

export function Topbar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const current = NAV_ITEMS.find((item) => pathname === item.href || pathname?.startsWith(`${item.href}/`));

  const initials = user?.fullName
    ?.split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="topbar">
      <h1 className="topbar-title">{current?.label ?? "Vertex Work"}</h1>
      {user && (
        <div className="topbar-user">
          <div className="topbar-user-name">
            {user.fullName}
            <span className="topbar-user-role">{RoleLabels[user.role] ?? user.role}</span>
          </div>
          <div
            aria-hidden
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "var(--color-navy)",
              color: "var(--color-ivory)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontFamily: "var(--font-serif)",
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
        </div>
      )}
    </header>
  );
}
