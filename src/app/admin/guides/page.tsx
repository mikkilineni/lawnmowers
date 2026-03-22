"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GuideEditor } from "@/components/GuideEditor";

interface Guide { id: number; slug: string; emoji: string; tag: string; title: string; readTime: string; updated: string; content: string; }

const inputStyle: React.CSSProperties = {
  border: "1px solid #ddd", borderRadius: 6, padding: "8px 12px",
  fontSize: "0.85rem", fontFamily: "'DM Sans', sans-serif", outline: "none", width: "100%",
  boxSizing: "border-box",
};

const emptyForm = { slug: "", emoji: "📖", tag: "Buying Guide", title: "", readTime: "", updated: "", content: "" };

export default function AdminGuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Guide | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const res = await fetch("/api/guides");
    setGuides(await res.json());
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/guides", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    await load();
    setForm(emptyForm);
  };

  const startEdit = (g: Guide) => {
    setEditingId(g.id);
    setEditForm({ ...g });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleSave = async () => {
    if (!editForm) return;
    setSaving(true);
    await fetch(`/api/guides/${editForm.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: editForm.slug,
        emoji: editForm.emoji,
        tag: editForm.tag,
        title: editForm.title,
        readTime: editForm.readTime,
        updated: editForm.updated,
        content: editForm.content,
      }),
    });
    setSaving(false);
    setEditingId(null);
    setEditForm(null);
    await load();
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/guides/${id}`, { method: "DELETE" });
    await load();
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", fontFamily: "'DM Sans', sans-serif" }}>
      <header style={{ background: "var(--dark)", padding: "1.25rem 7%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.2rem", color: "var(--lime)", letterSpacing: 2 }}>Guides Management</div>
        <Link href="/admin" style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", textDecoration: "none" }}>← Admin</Link>
      </header>

      <main style={{ padding: "2.5rem 7%", display: "flex", flexDirection: "column", gap: "2rem" }}>

        {/* Add form */}
        <div style={{ background: "white", borderRadius: 12, padding: "1.75rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", color: "var(--dark)", marginBottom: "1.25rem" }}>Add Guide</h2>
          <form onSubmit={handleAdd} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
            <input placeholder="Title *" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} style={{...inputStyle, gridColumn: "1 / -1"}} required />
            <input placeholder="Slug * (e.g. electric-vs-gas-mowers)" value={form.slug} onChange={e => setForm(f => ({...f, slug: e.target.value.toLowerCase().replace(/\s+/g, "-")}))} style={{...inputStyle, gridColumn: "1 / -1"}} required />
            <input placeholder="Emoji" value={form.emoji} onChange={e => setForm(f => ({...f, emoji: e.target.value}))} style={inputStyle} />
            <input placeholder="Tag (e.g. Buying Guide)" value={form.tag} onChange={e => setForm(f => ({...f, tag: e.target.value}))} style={inputStyle} required />
            <input placeholder="Read time (e.g. 8 min read)" value={form.readTime} onChange={e => setForm(f => ({...f, readTime: e.target.value}))} style={inputStyle} required />
            <input placeholder="Updated (e.g. Updated Jan 2025)" value={form.updated} onChange={e => setForm(f => ({...f, updated: e.target.value}))} style={inputStyle} required />
            <div style={{ gridColumn: "1 / -1" }}>
              <GuideEditor value={form.content} onChange={html => setForm(f => ({...f, content: html}))} />
            </div>
            <button type="submit" style={{ background: "var(--green)", color: "white", border: "none", borderRadius: 6, padding: "9px 20px", fontWeight: 600, cursor: "pointer" }}>
              Add Guide
            </button>
          </form>
        </div>

        {/* Guide list */}
        <div style={{ background: "white", borderRadius: 12, padding: "1.75rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", color: "var(--dark)", marginBottom: "1.25rem" }}>{guides.length} Guides</h2>
          {guides.map(g => (
            <div key={g.id} style={{ borderBottom: "1px solid var(--cream)", padding: "1rem 0" }}>
              {editingId === g.id && editForm ? (
                /* ── Edit mode ── */
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  <input value={editForm.title} onChange={e => setEditForm(f => f && ({...f, title: e.target.value}))} style={inputStyle} placeholder="Title" />
                  <input value={editForm.slug} onChange={e => setEditForm(f => f && ({...f, slug: e.target.value.toLowerCase().replace(/\s+/g, "-")}))} style={inputStyle} placeholder="Slug" />
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "0.6rem" }}>
                    <input value={editForm.emoji} onChange={e => setEditForm(f => f && ({...f, emoji: e.target.value}))} style={inputStyle} placeholder="Emoji" />
                    <input value={editForm.tag} onChange={e => setEditForm(f => f && ({...f, tag: e.target.value}))} style={inputStyle} placeholder="Tag" />
                    <input value={editForm.readTime} onChange={e => setEditForm(f => f && ({...f, readTime: e.target.value}))} style={inputStyle} placeholder="Read time" />
                    <input value={editForm.updated} onChange={e => setEditForm(f => f && ({...f, updated: e.target.value}))} style={inputStyle} placeholder="Updated" />
                  </div>
                  <GuideEditor
                    value={editForm.content}
                    onChange={html => setEditForm(f => f && ({...f, content: html}))}
                  />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={handleSave} disabled={saving} style={{ background: "var(--green)", color: "white", border: "none", borderRadius: 6, padding: "8px 20px", fontWeight: 600, cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
                      {saving ? "Saving…" : "Save"}
                    </button>
                    <button onClick={cancelEdit} style={{ background: "none", border: "1px solid #ddd", borderRadius: 6, padding: "8px 16px", cursor: "pointer", fontSize: "0.85rem" }}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* ── View mode ── */
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ fontSize: "1.75rem" }}>{g.emoji}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--dark)" }}>{g.title}</div>
                      <div style={{ color: "var(--muted)", fontSize: "0.75rem" }}>{g.tag} · {g.readTime} · {g.updated}</div>
                      <div style={{ color: "var(--muted)", fontSize: "0.72rem", marginTop: 2 }}>
                        {g.content ? `${g.content.slice(0, 80)}…` : <em>No content yet</em>}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    {g.slug && (
                      <a href={`/guides/${g.slug}`} target="_blank" rel="noopener noreferrer" style={{ background: "none", border: "1px solid #ddd", borderRadius: 6, padding: "4px 10px", color: "var(--green)", fontSize: "0.78rem", textDecoration: "none" }}>View ↗</a>
                    )}
                    <button onClick={() => startEdit(g)} style={{ background: "none", border: "1px solid #ddd", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: "0.78rem", color: "var(--dark)" }}>Edit</button>
                    <button onClick={() => handleDelete(g.id)} style={{ background: "none", border: "1px solid #ddd", borderRadius: 6, padding: "4px 10px", cursor: "pointer", color: "#ef4444", fontSize: "0.78rem" }}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
