"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ImportCSV } from "@/components/ImportCSV";

interface Product {
  id: number; slug: string; badge: string; badgeType: string; brand: string; name: string;
  emoji: string; rating: number; reviewCount: number; price: string;
  originalPrice: string; savings: string; tags: string[]; categories: string[];
  description: string; image: string; pros: string; cons: string; review: string;
}

interface ReviewEditor {
  productId: number;
  review: string;
  pros: string;
  cons: string;
  sources: string[];
  generating: boolean;
  saving: boolean;
  error: string;
  saved: boolean;
}

const inputStyle: React.CSSProperties = {
  border: "1px solid #ddd", borderRadius: 6, padding: "8px 12px",
  fontSize: "0.85rem", fontFamily: "'DM Sans', sans-serif", outline: "none", width: "100%",
};

const taStyle: React.CSSProperties = {
  ...inputStyle, resize: "vertical" as const, boxSizing: "border-box" as const,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    badge: "", badgeType: "best", brand: "", name: "", emoji: "🌿",
    rating: "4.5", reviewCount: "100", price: "", originalPrice: "", savings: "",
    tags: "", categories: "electric", description: "", image: "",
    slug: "", pros: "", cons: "", review: "",
  });
  const [editors, setEditors] = useState<Record<number, ReviewEditor>>({});

  const fetch_ = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => { fetch_(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        rating: parseFloat(form.rating),
        reviewCount: parseInt(form.reviewCount),
        tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
        categories: form.categories.split(",").map(c => c.trim()).filter(Boolean),
      }),
    });
    await fetch_();
    setForm({ badge: "", badgeType: "best", brand: "", name: "", emoji: "🌿", rating: "4.5", reviewCount: "100", price: "", originalPrice: "", savings: "", tags: "", categories: "electric", description: "", image: "", slug: "", pros: "", cons: "", review: "" });
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    await fetch_();
  };

  const openEditor = (p: Product) => {
    setEditors(prev => ({
      ...prev,
      [p.id]: prev[p.id] ?? {
        productId: p.id,
        review: p.review ?? "",
        pros: p.pros ?? "",
        cons: p.cons ?? "",
        sources: [],
        generating: false,
        saving: false,
        error: "",
        saved: false,
      },
    }));
  };

  const closeEditor = (id: number) => {
    setEditors(prev => { const n = { ...prev }; delete n[id]; return n; });
  };

  const updateEditor = (id: number, patch: Partial<ReviewEditor>) => {
    setEditors(prev => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  };

  const generateReview = async (p: Product) => {
    updateEditor(p.id, { generating: true, error: "", saved: false });
    try {
      const res = await fetch("/api/admin/generate-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand: p.brand, name: p.name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to generate");
      updateEditor(p.id, {
        review: data.review,
        pros: data.pros,
        cons: data.cons,
        sources: data.sources ?? [],
        generating: false,
      });
    } catch (err) {
      updateEditor(p.id, { generating: false, error: (err as Error).message });
    }
  };

  const saveReview = async (p: Product) => {
    const editor = editors[p.id];
    if (!editor) return;
    updateEditor(p.id, { saving: true, error: "", saved: false });
    try {
      const res = await fetch(`/api/products/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review: editor.review, pros: editor.pros, cons: editor.cons }),
      });
      if (!res.ok) throw new Error("Failed to save");
      updateEditor(p.id, { saving: false, saved: true });
      await fetch_();
    } catch (err) {
      updateEditor(p.id, { saving: false, error: (err as Error).message });
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", fontFamily: "'DM Sans', sans-serif" }}>
      <header style={{ background: "var(--dark)", padding: "1.25rem 7%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.2rem", color: "var(--lime)", letterSpacing: 2 }}>
          Products Management
        </div>
        <Link href="/admin" style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", textDecoration: "none" }}>← Admin</Link>
      </header>

      <main style={{ padding: "2.5rem 7%", display: "flex", flexDirection: "column", gap: "2rem" }}>
        {/* CSV Import */}
        <ImportCSV onImported={fetch_} />

        {/* Add Form */}
        <div style={{ background: "white", borderRadius: 12, padding: "1.75rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", color: "var(--dark)", marginBottom: "1.25rem", letterSpacing: "0.02em" }}>
            Add Product
          </h2>
          <form onSubmit={handleAdd} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
            <input placeholder="Brand *" value={form.brand} onChange={e => setForm(f => ({...f, brand: e.target.value}))} style={inputStyle} required />
            <input placeholder="Name *" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} style={inputStyle} required />
            <input placeholder="Badge (e.g. ⭐ Best Overall)" value={form.badge} onChange={e => setForm(f => ({...f, badge: e.target.value}))} style={inputStyle} required />
            <select value={form.badgeType} onChange={e => setForm(f => ({...f, badgeType: e.target.value}))} style={inputStyle}>
              <option value="best">Best</option>
              <option value="popular">Popular</option>
              <option value="new">New</option>
              <option value="sale">Sale</option>
            </select>
            <input placeholder="Emoji *" value={form.emoji} onChange={e => setForm(f => ({...f, emoji: e.target.value}))} style={inputStyle} required />
            <input placeholder="Rating (e.g. 4.8)" value={form.rating} onChange={e => setForm(f => ({...f, rating: e.target.value}))} style={inputStyle} type="number" step="0.1" min="0" max="5" required />
            <input placeholder="Review count" value={form.reviewCount} onChange={e => setForm(f => ({...f, reviewCount: e.target.value}))} style={inputStyle} type="number" required />
            <input placeholder="Price (e.g. $549)" value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))} style={inputStyle} required />
            <input placeholder="Original price (e.g. $649)" value={form.originalPrice} onChange={e => setForm(f => ({...f, originalPrice: e.target.value}))} style={inputStyle} required />
            <input placeholder="Savings (e.g. Save $100)" value={form.savings} onChange={e => setForm(f => ({...f, savings: e.target.value}))} style={inputStyle} required />
            <input placeholder="Tags (comma-separated)" value={form.tags} onChange={e => setForm(f => ({...f, tags: e.target.value}))} style={inputStyle} />
            <input placeholder="Categories (e.g. electric,under500)" value={form.categories} onChange={e => setForm(f => ({...f, categories: e.target.value}))} style={inputStyle} />
            <input placeholder="Image URL" value={form.image} onChange={e => setForm(f => ({...f, image: e.target.value}))} style={{...inputStyle, gridColumn: "1 / -1"}} />
            <input placeholder="SEO Slug (e.g. honda-hrx217-review)" value={form.slug} onChange={e => setForm(f => ({...f, slug: e.target.value}))} style={{...inputStyle, gridColumn: "1 / -1"}} />
            <textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} style={{...taStyle, gridColumn: "1 / -1", minHeight: 70}} />
            <textarea placeholder="Full Review" value={form.review} onChange={e => setForm(f => ({...f, review: e.target.value}))} style={{...taStyle, gridColumn: "1 / -1", minHeight: 100}} />
            <textarea placeholder="Pros (one per line)" value={form.pros} onChange={e => setForm(f => ({...f, pros: e.target.value}))} style={{...taStyle, minHeight: 80}} />
            <textarea placeholder="Cons (one per line)" value={form.cons} onChange={e => setForm(f => ({...f, cons: e.target.value}))} style={{...taStyle, minHeight: 80}} />
            <button type="submit" style={{ background: "var(--green)", color: "white", border: "none", borderRadius: 6, padding: "9px 20px", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer", gridColumn: "1 / -1", justifySelf: "start" }}>
              Add Product
            </button>
          </form>
        </div>

        {/* Table */}
        <div style={{ background: "white", borderRadius: 12, padding: "1.75rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflowX: "auto" }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", color: "var(--dark)", marginBottom: "1.25rem", letterSpacing: "0.02em" }}>
            {products.length} Products
          </h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--cream)" }}>
                {["", "Brand", "Name", "Price", "Review", ""].map((h, i) => (
                  <th key={i} style={{ padding: "8px 12px", textAlign: "left", color: "var(--muted)", fontWeight: 600, fontSize: "0.72rem", letterSpacing: "0.08em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <>
                  <tr key={p.id} style={{ borderBottom: editors[p.id] ? "none" : "1px solid var(--cream)" }}>
                    <td style={{ padding: "10px 12px", fontSize: "1.5rem" }}>{p.emoji}</td>
                    <td style={{ padding: "10px 12px", color: "var(--muted)", fontSize: "0.78rem" }}>{p.brand}</td>
                    <td style={{ padding: "10px 12px", fontWeight: 600, color: "var(--dark)" }}>{p.name}</td>
                    <td style={{ padding: "10px 12px", color: "var(--green)", fontWeight: 600 }}>{p.price}</td>
                    <td style={{ padding: "10px 12px" }}>
                      {p.review ? (
                        <span style={{ color: "var(--green)", fontSize: "0.75rem", fontWeight: 600 }}>✓ Has review</span>
                      ) : (
                        <span style={{ color: "var(--muted)", fontSize: "0.75rem" }}>No review</span>
                      )}
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <button
                          onClick={() => editors[p.id] ? closeEditor(p.id) : openEditor(p)}
                          style={{ background: "none", border: "1px solid #a8d832", borderRadius: 6, padding: "4px 10px", cursor: "pointer", color: "var(--green)", fontSize: "0.78rem" }}
                        >
                          {editors[p.id] ? "Close" : "Edit Review"}
                        </button>
                        {p.slug && (
                          <a href={`/reviews/${p.slug}`} target="_blank" style={{ background: "none", border: "1px solid #ddd", borderRadius: 6, padding: "4px 10px", cursor: "pointer", color: "var(--green)", fontSize: "0.78rem", textDecoration: "none" }}>
                            View
                          </a>
                        )}
                        <button onClick={() => handleDelete(p.id)} style={{ background: "none", border: "1px solid #ddd", borderRadius: 6, padding: "4px 10px", cursor: "pointer", color: "#ef4444", fontSize: "0.78rem" }}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Inline review editor */}
                  {editors[p.id] && (
                    <tr key={`editor-${p.id}`}>
                      <td colSpan={6} style={{ padding: "0 12px 16px", background: "var(--cream)", borderBottom: "1px solid #e5e1db" }}>
                        <div style={{ background: "white", borderRadius: 10, padding: "1.25rem", border: "1px solid #e5e1db" }}>
                          {/* Header */}
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                            <div style={{ fontWeight: 700, color: "var(--dark)", fontSize: "0.9rem" }}>
                              Review Editor — {p.brand} {p.name}
                            </div>
                            <button
                              onClick={() => generateReview(p)}
                              disabled={editors[p.id].generating}
                              style={{
                                background: editors[p.id].generating ? "#e5e7eb" : "#ff4500",
                                color: editors[p.id].generating ? "#9ca3af" : "white",
                                border: "none", borderRadius: 6, padding: "7px 16px",
                                fontWeight: 700, fontSize: "0.82rem", cursor: editors[p.id].generating ? "not-allowed" : "pointer",
                                display: "flex", alignItems: "center", gap: 6,
                              }}
                            >
                              {editors[p.id].generating ? "Searching Reddit…" : "🤖 Generate from Reddit"}
                            </button>
                          </div>

                          {editors[p.id].error && (
                            <div style={{ color: "#ef4444", fontSize: "0.82rem", marginBottom: "0.75rem", padding: "8px 12px", background: "rgba(239,68,68,0.06)", borderRadius: 6 }}>
                              {editors[p.id].error}
                            </div>
                          )}

                          {editors[p.id].sources.length > 0 && (
                            <div style={{ marginBottom: "0.75rem", fontSize: "0.75rem", color: "var(--muted)" }}>
                              Sources: {editors[p.id].sources.map((s, i) => (
                                <a key={i} href={s} target="_blank" rel="noopener noreferrer" style={{ color: "#ff4500", marginRight: 8 }}>
                                  Thread {i + 1}
                                </a>
                              ))}
                            </div>
                          )}

                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
                            <div>
                              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--muted)", marginBottom: 4 }}>PROS (one per line)</label>
                              <textarea
                                value={editors[p.id].pros}
                                onChange={e => updateEditor(p.id, { pros: e.target.value })}
                                style={{ ...taStyle, minHeight: 100 }}
                                placeholder="Great battery life&#10;Easy to use&#10;Quiet motor"
                              />
                            </div>
                            <div>
                              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--muted)", marginBottom: 4 }}>CONS (one per line)</label>
                              <textarea
                                value={editors[p.id].cons}
                                onChange={e => updateEditor(p.id, { cons: e.target.value })}
                                style={{ ...taStyle, minHeight: 100 }}
                                placeholder="Expensive&#10;Heavy&#10;Short warranty"
                              />
                            </div>
                          </div>

                          <div style={{ marginBottom: "0.75rem" }}>
                            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--muted)", marginBottom: 4 }}>FULL REVIEW</label>
                            <textarea
                              value={editors[p.id].review}
                              onChange={e => updateEditor(p.id, { review: e.target.value })}
                              style={{ ...taStyle, minHeight: 120 }}
                              placeholder="Write your full review here..."
                            />
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <button
                              onClick={() => saveReview(p)}
                              disabled={editors[p.id].saving}
                              style={{
                                background: "var(--green)", color: "white", border: "none",
                                borderRadius: 6, padding: "8px 20px", fontWeight: 600,
                                fontSize: "0.85rem", cursor: editors[p.id].saving ? "not-allowed" : "pointer",
                                opacity: editors[p.id].saving ? 0.7 : 1,
                              }}
                            >
                              {editors[p.id].saving ? "Saving…" : "Save Review"}
                            </button>
                            {editors[p.id].saved && (
                              <span style={{ color: "var(--green)", fontSize: "0.82rem", fontWeight: 600 }}>✓ Saved!</span>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
