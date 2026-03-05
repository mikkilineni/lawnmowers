"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Guide { id: number; emoji: string; tag: string; title: string; readTime: string; updated: string; }

const inputStyle: React.CSSProperties = {
  border: "1px solid #ddd", borderRadius: 6, padding: "8px 12px",
  fontSize: "0.85rem", fontFamily: "'DM Sans', sans-serif", outline: "none", width: "100%",
};

export default function AdminGuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [form, setForm] = useState({ emoji: "📖", tag: "Buying Guide", title: "", readTime: "", updated: "" });

  const fetch_ = async () => {
    const res = await fetch("/api/guides");
    setGuides(await res.json());
  };

  useEffect(() => { fetch_(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/guides", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    await fetch_();
    setForm({ emoji: "📖", tag: "Buying Guide", title: "", readTime: "", updated: "" });
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/guides/${id}`, { method: "DELETE" });
    await fetch_();
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", fontFamily: "'DM Sans', sans-serif" }}>
      <header style={{ background: "var(--dark)", padding: "1.25rem 7%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.2rem", color: "var(--lime)", letterSpacing: 2 }}>Guides Management</div>
        <Link href="/admin" style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", textDecoration: "none" }}>← Admin</Link>
      </header>
      <main style={{ padding: "2.5rem 7%", display: "flex", flexDirection: "column", gap: "2rem" }}>
        <div style={{ background: "white", borderRadius: 12, padding: "1.75rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", color: "var(--dark)", marginBottom: "1.25rem" }}>Add Guide</h2>
          <form onSubmit={handleAdd} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
            <input placeholder="Title *" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} style={{...inputStyle, gridColumn: "1 / -1"}} required />
            <input placeholder="Emoji" value={form.emoji} onChange={e => setForm(f => ({...f, emoji: e.target.value}))} style={inputStyle} />
            <input placeholder="Tag (e.g. Buying Guide)" value={form.tag} onChange={e => setForm(f => ({...f, tag: e.target.value}))} style={inputStyle} required />
            <input placeholder="Read time (e.g. 8 min read)" value={form.readTime} onChange={e => setForm(f => ({...f, readTime: e.target.value}))} style={inputStyle} required />
            <input placeholder="Updated (e.g. Updated Jan 2025)" value={form.updated} onChange={e => setForm(f => ({...f, updated: e.target.value}))} style={inputStyle} required />
            <button type="submit" style={{ background: "var(--green)", color: "white", border: "none", borderRadius: 6, padding: "9px 20px", fontWeight: 600, cursor: "pointer" }}>
              Add Guide
            </button>
          </form>
        </div>
        <div style={{ background: "white", borderRadius: 12, padding: "1.75rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", color: "var(--dark)", marginBottom: "1.25rem" }}>{guides.length} Guides</h2>
          {guides.map(g => (
            <div key={g.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.875rem 0", borderBottom: "1px solid var(--cream)", gap: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontSize: "1.75rem" }}>{g.emoji}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--dark)" }}>{g.title}</div>
                  <div style={{ color: "var(--muted)", fontSize: "0.75rem" }}>{g.tag} · {g.readTime} · {g.updated}</div>
                </div>
              </div>
              <button onClick={() => handleDelete(g.id)} style={{ background: "none", border: "1px solid #ddd", borderRadius: 6, padding: "4px 10px", cursor: "pointer", color: "#ef4444", fontSize: "0.78rem", flexShrink: 0 }}>Delete</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
