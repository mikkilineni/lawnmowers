"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Product {
  id: number; badge: string; badgeType: string; brand: string; name: string;
  emoji: string; rating: number; reviewCount: number; price: string;
  originalPrice: string; savings: string; tags: string[]; categories: string[];
  description: string; image: string;
}

const inputStyle: React.CSSProperties = {
  border: "1px solid #ddd", borderRadius: 6, padding: "8px 12px",
  fontSize: "0.85rem", fontFamily: "'DM Sans', sans-serif", outline: "none", width: "100%",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    badge: "", badgeType: "best", brand: "", name: "", emoji: "🌿",
    rating: "4.5", reviewCount: "100", price: "", originalPrice: "", savings: "",
    tags: "", categories: "electric", description: "", image: "",
  });

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
    setForm({ badge: "", badgeType: "best", brand: "", name: "", emoji: "🌿", rating: "4.5", reviewCount: "100", price: "", originalPrice: "", savings: "", tags: "", categories: "electric", description: "", image: "" });
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    await fetch_();
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
            <textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} style={{...inputStyle, gridColumn: "1 / -1", minHeight: 70, resize: "vertical"}} />
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
                {["", "Brand", "Name", "Price", "Rating", "Categories", ""].map(h => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: "var(--muted)", fontWeight: 600, fontSize: "0.72rem", letterSpacing: "0.08em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={{ borderBottom: "1px solid var(--cream)" }}>
                  <td style={{ padding: "10px 12px", fontSize: "1.5rem" }}>{p.emoji}</td>
                  <td style={{ padding: "10px 12px", color: "var(--muted)", fontSize: "0.78rem" }}>{p.brand}</td>
                  <td style={{ padding: "10px 12px", fontWeight: 600, color: "var(--dark)" }}>{p.name}</td>
                  <td style={{ padding: "10px 12px", color: "var(--green)", fontWeight: 600 }}>{p.price}</td>
                  <td style={{ padding: "10px 12px" }}>★ {p.rating}</td>
                  <td style={{ padding: "10px 12px", color: "var(--muted)", fontSize: "0.78rem" }}>{p.categories.join(", ")}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <button onClick={() => handleDelete(p.id)} style={{ background: "none", border: "1px solid #ddd", borderRadius: 6, padding: "4px 10px", cursor: "pointer", color: "#ef4444", fontSize: "0.78rem" }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
