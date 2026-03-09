"use client";

import { useRef, useState } from "react";

const HEADERS = [
  "brand", "name", "badge", "badgeType", "emoji",
  "rating", "reviewCount", "price", "originalPrice", "savings",
  "categories", "tags", "description", "image",
  "pros", "cons", "review",
  "affiliate_retailer_1", "affiliate_url_1", "affiliate_price_1",
  "affiliate_retailer_2", "affiliate_url_2", "affiliate_price_2",
  "affiliate_retailer_3", "affiliate_url_3", "affiliate_price_3",
];

const SAMPLE_ROW = [
  "Honda", "HRX217VKA", "⭐ Best Overall", "best", "🌿",
  "4.8", "2341", "$649", "$729", "Save $80",
  "gas|riding", "self-propelled|mulching",
  "The Honda HRX217VKA is widely regarded as the best self-propelled gas mower.", "",
  "Exceptional build quality\nPowerful engine\nExcellent mulching",
  "Expensive\nHeavy",
  "Full review text here...",
  "Amazon", "https://amazon.com/example", "$649",
  "Home Depot", "https://homedepot.com/example", "$659",
  "", "", "",
];

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  for (const line of lines) {
    const cols: string[] = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
        else { inQuotes = !inQuotes; }
      } else if (ch === "," && !inQuotes) {
        cols.push(cur); cur = "";
      } else {
        cur += ch;
      }
    }
    cols.push(cur);
    rows.push(cols);
  }
  return rows;
}

function rowsToProducts(matrix: string[][]) {
  const [headerRow, ...dataRows] = matrix;
  const idx = (name: string) => headerRow.indexOf(name);

  return dataRows
    .filter(r => r[idx("brand")]?.trim() && r[idx("name")]?.trim())
    .map(r => {
      const g = (col: string) => (r[idx(col)] ?? "").trim();
      const affiliateLinks = [1, 2, 3].map(n => ({
        retailer: g(`affiliate_retailer_${n}`),
        url: g(`affiliate_url_${n}`),
        price: g(`affiliate_price_${n}`),
      })).filter(l => l.retailer && l.url);

      return {
        brand: g("brand"),
        name: g("name"),
        badge: g("badge"),
        badgeType: g("badgeType") || "best",
        emoji: g("emoji") || "🌿",
        rating: parseFloat(g("rating")) || 4.5,
        reviewCount: parseInt(g("reviewCount")) || 0,
        price: g("price"),
        originalPrice: g("originalPrice"),
        savings: g("savings"),
        categories: g("categories").split("|").map(s => s.trim()).filter(Boolean),
        tags: g("tags").split("|").map(s => s.trim()).filter(Boolean),
        description: g("description"),
        image: g("image"),
        pros: g("pros"),
        cons: g("cons"),
        review: g("review"),
        affiliateLinks,
      };
    });
}

function downloadTemplate() {
  const csvContent = [HEADERS, SAMPLE_ROW]
    .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "products-template.csv";
  a.click();
  URL.revokeObjectURL(url);
}

interface Result { added: number; updated: number; errors: string[] }

export function ImportCSV({ onImported }: { onImported: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "parsing" | "importing">("idle");
  const [preview, setPreview] = useState<{ count: number; products: { brand: string; name: string }[] } | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [rawProducts, setRawProducts] = useState<ReturnType<typeof rowsToProducts>>([]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResult(null);
    setStatus("parsing");
    const reader = new FileReader();
    reader.onload = ev => {
      const text = ev.target?.result as string;
      const matrix = parseCSV(text);
      const products = rowsToProducts(matrix);
      setRawProducts(products);
      setPreview({ count: products.length, products: products.slice(0, 5).map(p => ({ brand: p.brand, name: p.name })) });
      setStatus("idle");
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!rawProducts.length) return;
    setStatus("importing");
    const res = await fetch("/api/admin/import-products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rawProducts),
    });
    const data: Result = await res.json();
    setResult(data);
    setPreview(null);
    setRawProducts([]);
    setStatus("idle");
    if (fileRef.current) fileRef.current.value = "";
    onImported();
  };

  const btnStyle: React.CSSProperties = {
    border: "none", borderRadius: 8, padding: "9px 18px",
    fontWeight: 600, fontSize: "0.85rem", cursor: "pointer",
  };

  return (
    <div style={{ background: "white", borderRadius: 12, padding: "1.75rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", color: "var(--dark)", letterSpacing: "0.02em", margin: 0 }}>
          Import Products via CSV
        </h2>
        <button onClick={downloadTemplate} style={{ ...btnStyle, background: "var(--cream)", color: "var(--dark)", border: "1px solid #ddd" }}>
          ⬇ Download Template
        </button>
      </div>

      <p style={{ color: "var(--muted)", fontSize: "0.82rem", marginBottom: "1rem", lineHeight: 1.6 }}>
        Upload a CSV with product data. Categories and tags are <strong>pipe-separated</strong> (e.g. <code>gas|riding</code>).
        Re-uploading an existing product (same brand + name) will update it.
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          onChange={handleFile}
          style={{ fontSize: "0.85rem" }}
        />
        {preview && (
          <button
            onClick={handleImport}
            disabled={status === "importing"}
            style={{ ...btnStyle, background: "var(--green)", color: "white", opacity: status === "importing" ? 0.7 : 1, cursor: status === "importing" ? "not-allowed" : "pointer" }}
          >
            {status === "importing" ? "Importing…" : `Import ${preview.count} Products`}
          </button>
        )}
      </div>

      {/* Preview */}
      {preview && (
        <div style={{ marginTop: "1rem", padding: "1rem", background: "var(--cream)", borderRadius: 8, fontSize: "0.82rem" }}>
          <div style={{ fontWeight: 700, color: "var(--dark)", marginBottom: 6 }}>
            Preview — {preview.count} product{preview.count !== 1 ? "s" : ""} found:
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, color: "var(--muted)" }}>
            {preview.products.map((p, i) => (
              <li key={i}>{p.brand} — {p.name}</li>
            ))}
            {preview.count > 5 && <li style={{ fontStyle: "italic" }}>…and {preview.count - 5} more</li>}
          </ul>
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{
          marginTop: "1rem", padding: "1rem", borderRadius: 8, fontSize: "0.85rem",
          background: result.errors.length ? "rgba(239,68,68,0.06)" : "rgba(168,216,50,0.1)",
          border: `1px solid ${result.errors.length ? "rgba(239,68,68,0.2)" : "rgba(168,216,50,0.3)"}`,
        }}>
          <div style={{ fontWeight: 700, color: "var(--dark)", marginBottom: 4 }}>
            ✓ Import complete — {result.added} added, {result.updated} updated
            {result.errors.length > 0 && `, ${result.errors.length} error${result.errors.length > 1 ? "s" : ""}`}
          </div>
          {result.errors.map((e, i) => (
            <div key={i} style={{ color: "#ef4444", fontSize: "0.78rem" }}>{e}</div>
          ))}
        </div>
      )}
    </div>
  );
}
