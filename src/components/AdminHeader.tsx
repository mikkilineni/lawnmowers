"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";

export function AdminHeader() {
  return (
    <header style={{ background: "var(--dark)", padding: "1.5rem 7%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem", color: "var(--lime)", letterSpacing: 2 }}>
          Lawn<span style={{ color: "white" }}>mowers.com</span>
        </div>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.72rem", letterSpacing: "0.12em" }}>ADMIN DASHBOARD</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <Link href="/" style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", textDecoration: "none" }}>← Back to Site</Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          style={{
            background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)",
            color: "#ef4444", borderRadius: 6, padding: "6px 14px",
            fontSize: "0.82rem", fontWeight: 600, cursor: "pointer",
          }}
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
