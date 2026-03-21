"use client";

import { useState } from "react";

interface AffiliateLink {
  id: number;
  retailer: string;
  url: string;
  price: string;
}

interface Product {
  id: number;
  name: string;
  brand: string;
  emoji: string;
  price: string;
  rating: number;
  affiliateLinks: AffiliateLink[];
}

interface Props {
  products: Product[];
  currentHotPickId: number | null;
}

export function HotPickSelector({ products, currentHotPickId }: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(currentHotPickId);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const selected = products.find(p => p.id === selectedId);

  const save = async () => {
    setSaving(true);
    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hotPickProductId: selectedId ? String(selectedId) : "" }),
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: 8 }}>
        <div>
          <div style={{ fontWeight: 700, color: "var(--dark)", fontSize: "0.95rem", marginBottom: 2 }}>
            🔥 Hero Hot Pick
          </div>
          <div style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
            The featured product shown in the upper-right of the homepage hero
          </div>
        </div>
        <button
          onClick={save}
          disabled={saving || selectedId === currentHotPickId}
          style={{
            background: saved ? "var(--green)" : "var(--lime)",
            color: "var(--dark)",
            border: "none", borderRadius: 8,
            padding: "8px 20px", fontWeight: 700,
            fontSize: "0.85rem", cursor: "pointer",
            opacity: (saving || selectedId === currentHotPickId) ? 0.5 : 1,
          }}
        >
          {saved ? "✓ Saved" : saving ? "Saving…" : "Save"}
        </button>
      </div>

      {/* Product selector */}
      <select
        value={selectedId ?? ""}
        onChange={e => setSelectedId(e.target.value ? Number(e.target.value) : null)}
        style={{
          width: "100%", padding: "9px 12px", borderRadius: 8,
          border: "1px solid #d1d5db", fontSize: "0.9rem",
          background: "#f9fafb", color: "var(--dark)", outline: "none",
          marginBottom: "1rem",
        }}
      >
        <option value="">— No Hot Pick (use default) —</option>
        {products.map(p => (
          <option key={p.id} value={p.id}>
            {p.emoji} {p.brand} {p.name} — {p.price}
          </option>
        ))}
      </select>

      {/* Preview + affiliate links */}
      {selected && (
        <div style={{
          border: "1px solid #e5e7eb", borderRadius: 10, padding: "1rem 1.25rem",
          background: "#f9fafb",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "2rem" }}>{selected.emoji}</span>
            <div>
              <div style={{ fontWeight: 700, color: "var(--dark)", fontSize: "0.95rem" }}>
                {selected.brand} {selected.name}
              </div>
              <div style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
                ★ {selected.rating} · {selected.price}
              </div>
            </div>
          </div>

          {/* Affiliate links */}
          <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Affiliate Links ({selected.affiliateLinks.length})
          </div>
          {selected.affiliateLinks.length === 0 ? (
            <div style={{ color: "var(--muted)", fontSize: "0.8rem", fontStyle: "italic" }}>
              No affiliate links yet. <a href="/admin/affiliate-links" style={{ color: "var(--green)" }}>Add them →</a>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {selected.affiliateLinks.map(link => (
                <div key={link.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "white", borderRadius: 8, padding: "8px 12px",
                  border: "1px solid #e5e7eb",
                }}>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--dark)" }}>{link.retailer}</span>
                    {link.price && (
                      <span style={{ marginLeft: 8, color: "var(--green)", fontWeight: 700, fontSize: "0.85rem" }}>{link.price}</span>
                    )}
                    <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: 1 }}>
                      {link.url.length > 55 ? link.url.slice(0, 55) + "…" : link.url}
                    </div>
                  </div>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: "0.75rem", color: "var(--green)", fontWeight: 600 }}
                  >
                    Preview ↗
                  </a>
                </div>
              ))}
            </div>
          )}
          <div style={{ marginTop: 8 }}>
            <a href="/admin/affiliate-links" style={{ fontSize: "0.78rem", color: "var(--green)", fontWeight: 600 }}>
              + Manage affiliate links →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
