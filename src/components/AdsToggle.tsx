"use client";

import { useState } from "react";

export function AdsToggle({ initialValue, initialFrequency }: { initialValue: boolean; initialFrequency: number }) {
  const [enabled, setEnabled] = useState(initialValue);
  const [frequency, setFrequency] = useState(initialFrequency);
  const [saving, setSaving] = useState(false);

  const toggle = async () => {
    const next = !enabled;
    setSaving(true);
    setEnabled(next);
    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adsEnabled: String(next) }),
    });
    setSaving(false);
  };

  const updateFrequency = async (val: number) => {
    setFrequency(val);
    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adFrequency: String(val) }),
    });
  };

  return (
    <div style={{
      background: "white", borderRadius: 12, padding: "1.5rem 2rem",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem",
      flexWrap: "wrap",
    }}>
      <div>
        <div style={{ fontWeight: 700, color: "var(--dark)", fontSize: "0.95rem", marginBottom: 2 }}>
          Google AdSense
        </div>
        <div style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
          Insert ad units every <strong>{frequency}</strong> product cards on the homepage
        </div>
      </div>

      {/* Frequency input */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: "0.8rem", color: "var(--muted)", fontWeight: 600 }}>Every</label>
        <input
          type="number"
          min={2}
          max={10}
          value={frequency}
          onChange={e => updateFrequency(Math.min(10, Math.max(2, Number(e.target.value))))}
          style={{
            width: 56, padding: "5px 8px", borderRadius: 8,
            border: "1px solid #d1d5db", fontSize: "0.9rem",
            textAlign: "center", outline: "none",
          }}
        />
        <span style={{ fontSize: "0.8rem", color: "var(--muted)", fontWeight: 600 }}>cards</span>
      </div>

      {/* Toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          onClick={toggle}
          disabled={saving}
          aria-label="Toggle ads"
          style={{
            width: 52, height: 28, borderRadius: 14, border: "none",
            background: enabled ? "var(--green)" : "#d1d5db",
            cursor: saving ? "not-allowed" : "pointer",
            position: "relative", transition: "background 0.25s", flexShrink: 0,
            opacity: saving ? 0.7 : 1,
          }}
        >
          <span style={{
            position: "absolute", top: 3,
            left: enabled ? 27 : 3,
            width: 22, height: 22, borderRadius: "50%",
            background: "white",
            transition: "left 0.25s",
            boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
          }} />
        </button>
        <span style={{ fontSize: "0.8rem", fontWeight: 600, color: enabled ? "var(--green)" : "var(--muted)", minWidth: 30 }}>
          {enabled ? "ON" : "OFF"}
        </span>
      </div>
    </div>
  );
}
