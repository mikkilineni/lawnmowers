"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Review { id: number; text: string; name: string; location: string; initial: string; }

const inputStyle: React.CSSProperties = {
  border: "1px solid #ddd", borderRadius: 6, padding: "8px 12px",
  fontSize: "0.85rem", fontFamily: "'DM Sans', sans-serif", outline: "none", width: "100%",
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [form, setForm] = useState({ text: "", name: "", location: "", initial: "" });

  const fetch_ = async () => {
    const res = await fetch("/api/reviews");
    setReviews(await res.json());
  };

  useEffect(() => { fetch_(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    await fetch_();
    setForm({ text: "", name: "", location: "", initial: "" });
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    await fetch_();
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", fontFamily: "'DM Sans', sans-serif" }}>
      <header style={{ background: "var(--dark)", padding: "1.25rem 7%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.2rem", color: "var(--lime)", letterSpacing: 2 }}>Reviews Management</div>
        <Link href="/admin" style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", textDecoration: "none" }}>← Admin</Link>
      </header>
      <main style={{ padding: "2.5rem 7%", display: "flex", flexDirection: "column", gap: "2rem" }}>
        <div style={{ background: "white", borderRadius: 12, padding: "1.75rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", color: "var(--dark)", marginBottom: "1.25rem" }}>Add Review</h2>
          <form onSubmit={handleAdd} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
            <input placeholder="Reviewer name *" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} style={inputStyle} required />
            <input placeholder="Location (e.g. Austin, TX)" value={form.location} onChange={e => setForm(f => ({...f, location: e.target.value}))} style={inputStyle} required />
            <input placeholder="Initial (e.g. M)" value={form.initial} onChange={e => setForm(f => ({...f, initial: e.target.value}))} style={inputStyle} maxLength={1} required />
            <textarea placeholder="Review text *" value={form.text} onChange={e => setForm(f => ({...f, text: e.target.value}))} style={{...inputStyle, gridColumn: "1 / -1", minHeight: 80, resize: "vertical"}} required />
            <button type="submit" style={{ background: "var(--green)", color: "white", border: "none", borderRadius: 6, padding: "9px 20px", fontWeight: 600, cursor: "pointer" }}>
              Add Review
            </button>
          </form>
        </div>
        <div style={{ background: "white", borderRadius: 12, padding: "1.75rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", color: "var(--dark)", marginBottom: "1.25rem" }}>{reviews.length} Reviews</h2>
          {reviews.map(r => (
            <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "1rem 0", borderBottom: "1px solid var(--cream)", gap: "1rem" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--dark)" }}>{r.name} <span style={{ color: "var(--muted)", fontWeight: 400 }}>· {r.location}</span></div>
                <div style={{ color: "var(--muted)", fontSize: "0.82rem", marginTop: 4, lineHeight: 1.5, maxWidth: 600 }}>{r.text}</div>
              </div>
              <button onClick={() => handleDelete(r.id)} style={{ background: "none", border: "1px solid #ddd", borderRadius: 6, padding: "4px 10px", cursor: "pointer", color: "#ef4444", fontSize: "0.78rem", flexShrink: 0 }}>Delete</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
