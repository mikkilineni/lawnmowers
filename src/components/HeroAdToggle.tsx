"use client";

import { useState } from "react";

interface Props {
  initialEnabled: boolean;
  initialSlot: string;
}

export function HeroAdToggle({ initialEnabled, initialSlot }: Props) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [slot, setSlot] = useState(initialSlot);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggle = async () => {
    const next = !enabled;
    setSaving(true);
    setEnabled(next);
    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ heroAdEnabled: String(next) }),
    });
    setSaving(false);
  };

  const saveSlot = async () => {
    setSaving(true);
    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ heroAdSlot: slot }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{
      background: "white", borderRadius: 12, padding: "1.5rem 2rem",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: "1rem" }}>
        <div>
          <div style={{ fontWeight: 700, color: "var(--dark)", fontSize: "0.95rem", marginBottom: 2 }}>
            📺 Hero Ad Banner
          </div>
          <div style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
            Show an AdSense ad below the Hot Pick card in the homepage hero
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={toggle}
            disabled={saving}
            aria-label="Toggle hero ad"
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

      {/* Ad slot input */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: 4 }}>
            Ad Slot ID
          </label>
          <input
            type="text"
            value={slot}
            onChange={e => setSlot(e.target.value)}
            placeholder="e.g. 4322160719"
            style={{
              width: "100%", padding: "8px 12px", borderRadius: 8,
              border: "1px solid #d1d5db", fontSize: "0.88rem",
              outline: "none", boxSizing: "border-box",
            }}
          />
        </div>
        <button
          onClick={saveSlot}
          disabled={saving}
          style={{
            background: saved ? "var(--green)" : "var(--lime)",
            color: "var(--dark)",
            border: "none", borderRadius: 8,
            padding: "8px 20px", fontWeight: 700,
            fontSize: "0.85rem", cursor: "pointer",
            marginTop: 20, opacity: saving ? 0.5 : 1,
          }}
        >
          {saved ? "✓ Saved" : "Save"}
        </button>
      </div>
    </div>
  );
}
