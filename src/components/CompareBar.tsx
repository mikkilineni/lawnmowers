"use client";

import Link from "next/link";
import { useCompareSelection } from "@/hooks/useCompareSelection";

export function CompareBar() {
  const { ids, clear, toggle } = useCompareSelection();

  if (ids.length === 0) return null;

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      zIndex: 80,
      background: "var(--dark)",
      borderTop: "2px solid rgba(168,216,50,0.3)",
      padding: "0.75rem 7%",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: "1rem", flexWrap: "wrap",
      boxShadow: "0 -4px 24px rgba(0,0,0,0.3)",
      animation: "slideUp 0.2s ease-out",
    }}>
      <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
          COMPARE ({ids.length}/4):
        </span>
        {ids.map(id => (
          <div key={id} style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(168,216,50,0.1)",
            border: "1px solid rgba(168,216,50,0.25)",
            borderRadius: 20, padding: "4px 10px 4px 12px",
          }}>
            <span style={{ color: "var(--lime)", fontSize: "0.8rem", fontWeight: 600 }}>#{id}</span>
            <button
              onClick={() => toggle(id)}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.45)", cursor: "pointer", fontSize: "0.9rem", lineHeight: 1, padding: 0 }}
              title="Remove"
            >×</button>
          </div>
        ))}
        {Array.from({ length: 4 - ids.length }).map((_, i) => (
          <div key={`empty-${i}`} style={{
            width: 80, height: 28,
            border: "1px dashed rgba(255,255,255,0.15)",
            borderRadius: 20,
          }} />
        ))}
      </div>

      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <button
          onClick={clear}
          style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}
        >
          Clear all
        </button>
        <Link
          href={`/compare?ids=${ids.join(",")}`}
          style={{
            background: "var(--lime)", color: "var(--dark)",
            padding: "9px 22px", borderRadius: 8,
            fontWeight: 700, fontSize: "0.88rem",
            textDecoration: "none", whiteSpace: "nowrap",
          }}
        >
          Compare {ids.length} Mowers →
        </Link>
      </div>
    </div>
  );
}
