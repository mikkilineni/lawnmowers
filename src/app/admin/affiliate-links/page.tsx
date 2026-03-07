"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Product {
  id: number;
  brand: string;
  name: string;
}

interface AffiliateLink {
  id: number;
  productId: number;
  retailer: string;
  url: string;
  price: string;
}

const inputStyle: React.CSSProperties = {
  border: "1px solid #ddd", borderRadius: 6, padding: "8px 12px",
  fontSize: "0.85rem", fontFamily: "'DM Sans', sans-serif", outline: "none", width: "100%",
};

export default function AffiliateLinkAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [form, setForm] = useState({ retailer: "", url: "", price: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/products").then(r => r.json()).then(setProducts);
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    fetch(`/api/affiliate-links?productId=${selectedId}`)
      .then(r => r.json())
      .then(setLinks);
  }, [selectedId]);

  const selectedProduct = products.find(p => p.id === selectedId);

  const filteredProducts = products.filter(p =>
    `${p.brand} ${p.name}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) return;
    setSaving(true);
    await fetch("/api/affiliate-links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: selectedId, ...form }),
    });
    const updated = await fetch(`/api/affiliate-links?productId=${selectedId}`).then(r => r.json());
    setLinks(updated);
    setForm({ retailer: "", url: "", price: "" });
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/affiliate-links/${id}`, { method: "DELETE" });
    setLinks(prev => prev.filter(l => l.id !== id));
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", fontFamily: "'DM Sans', sans-serif" }}>
      <header style={{ background: "var(--dark)", padding: "1.25rem 7%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.2rem", color: "var(--lime)", letterSpacing: 2 }}>
          Affiliate Links
        </div>
        <Link href="/admin" style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", textDecoration: "none" }}>← Admin</Link>
      </header>

      <main style={{ padding: "2.5rem 7%", display: "grid", gridTemplateColumns: "320px 1fr", gap: "2rem", alignItems: "start" }}>

        {/* Product picker */}
        <div style={{ background: "white", borderRadius: 12, padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.2rem", color: "var(--dark)", marginBottom: "1rem", letterSpacing: "0.02em" }}>
            Select Product
          </h2>
          <input
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ ...inputStyle, marginBottom: "0.75rem" }}
          />
          <div style={{ maxHeight: 500, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
            {filteredProducts.map(p => (
              <button key={p.id} onClick={() => setSelectedId(p.id)} style={{
                textAlign: "left", padding: "10px 12px", borderRadius: 8, border: "none",
                background: selectedId === p.id ? "var(--green)" : "transparent",
                color: selectedId === p.id ? "white" : "var(--dark)",
                cursor: "pointer", fontSize: "0.82rem", lineHeight: 1.4,
              }}>
                <div style={{ fontWeight: 600 }}>{p.name}</div>
                <div style={{ opacity: 0.65, fontSize: "0.75rem" }}>{p.brand}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Links panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {!selectedProduct ? (
            <div style={{ background: "white", borderRadius: 12, padding: "3rem", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", color: "var(--muted)" }}>
              Select a product to manage its affiliate links
            </div>
          ) : (
            <>
              {/* Current links */}
              <div style={{ background: "white", borderRadius: 12, padding: "1.75rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", color: "var(--dark)", marginBottom: "0.25rem", letterSpacing: "0.02em" }}>
                  {selectedProduct.brand} — {selectedProduct.name}
                </h2>
                <div style={{ color: "var(--muted)", fontSize: "0.8rem", marginBottom: "1.25rem" }}>
                  {links.length} affiliate link{links.length !== 1 ? "s" : ""}
                </div>

                {links.length === 0 ? (
                  <div style={{ color: "var(--muted)", fontSize: "0.85rem", padding: "1rem 0" }}>No links yet — add one below.</div>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid var(--cream)" }}>
                        {["Retailer", "Price", "URL", ""].map(h => (
                          <th key={h} style={{ padding: "6px 10px", textAlign: "left", color: "var(--muted)", fontWeight: 600, fontSize: "0.72rem", letterSpacing: "0.08em" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {links.map(link => (
                        <tr key={link.id} style={{ borderBottom: "1px solid var(--cream)" }}>
                          <td style={{ padding: "10px", fontWeight: 600, color: "var(--dark)" }}>{link.retailer}</td>
                          <td style={{ padding: "10px", color: "var(--green)", fontWeight: 600 }}>{link.price || "—"}</td>
                          <td style={{ padding: "10px", maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--muted)", fontSize: "0.78rem", textDecoration: "none" }}>
                              {link.url}
                            </a>
                          </td>
                          <td style={{ padding: "10px" }}>
                            <button onClick={() => handleDelete(link.id)} style={{
                              background: "none", border: "1px solid #ddd", borderRadius: 6,
                              padding: "4px 10px", cursor: "pointer", color: "#ef4444", fontSize: "0.78rem",
                            }}>
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Add link form */}
              <div style={{ background: "white", borderRadius: 12, padding: "1.75rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", color: "var(--dark)", marginBottom: "1.25rem", letterSpacing: "0.02em" }}>
                  Add Affiliate Link
                </h2>
                <form onSubmit={handleAdd} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <input
                    placeholder="Retailer (e.g. Home Depot) *"
                    value={form.retailer}
                    onChange={e => setForm(f => ({ ...f, retailer: e.target.value }))}
                    style={inputStyle}
                    required
                  />
                  <input
                    placeholder="Price at retailer (e.g. $549)"
                    value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    style={inputStyle}
                  />
                  <input
                    placeholder="CJ Affiliate URL *"
                    value={form.url}
                    onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                    style={{ ...inputStyle, gridColumn: "1 / -1" }}
                    required
                    type="url"
                  />
                  <button type="submit" disabled={saving} style={{
                    background: "var(--green)", color: "white", border: "none", borderRadius: 6,
                    padding: "9px 20px", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer",
                    justifySelf: "start", opacity: saving ? 0.7 : 1,
                  }}>
                    {saving ? "Adding..." : "Add Link"}
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
