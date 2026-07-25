"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Brand { id: number; name: string; }

const inputStyle: React.CSSProperties = {
  border: "1px solid #ddd", borderRadius: 6, padding: "8px 12px",
  fontSize: "0.85rem", fontFamily: "'DM Sans', sans-serif", outline: "none", width: "100%",
};

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [name, setName] = useState("");

  const fetch_ = async () => {
    const res = await fetch("/api/brands");
    setBrands(await res.json());
  };

  useEffect(() => { fetch_(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/brands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setName("");
    await fetch_();
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/brands/${id}`, { method: "DELETE" });
    await fetch_();
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", fontFamily: "'DM Sans', sans-serif" }}>
      <header style={{ background: "var(--dark)", padding: "1.25rem 7%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.2rem", color: "var(--lime)", letterSpacing: 2 }}>Brands Management</div>
        <Link href="/admin" style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", textDecoration: "none" }}>← Admin</Link>
      </header>
      <main style={{ padding: "2.5rem 7%", display: "flex", flexDirection: "column", gap: "2rem" }}>
        <div style={{ background: "white", borderRadius: 12, padding: "1.75rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", color: "var(--dark)", marginBottom: "1.25rem" }}>Add Brand</h2>
          <form onSubmit={handleAdd} style={{ display: "flex", gap: "0.75rem" }}>
            <input
              placeholder="Brand name (e.g. HONDA)"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ ...inputStyle, flex: 1 }}
              required
            />
            <button type="submit" style={{ background: "var(--green)", color: "white", border: "none", borderRadius: 6, padding: "9px 20px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
              Add Brand
            </button>
          </form>
        </div>
        <div style={{ background: "white", borderRadius: 12, padding: "1.75rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", color: "var(--dark)", marginBottom: "1.25rem" }}>{brands.length} Brands</h2>
          {brands.map(b => (
            <div key={b.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 0", borderBottom: "1px solid var(--cream)" }}>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.08em", color: "var(--dark)" }}>{b.name}</span>
              <button onClick={() => handleDelete(b.id)} style={{ background: "none", border: "1px solid #ddd", borderRadius: 6, padding: "4px 10px", cursor: "pointer", color: "#ef4444", fontSize: "0.78rem" }}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
