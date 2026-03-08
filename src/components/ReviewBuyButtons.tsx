"use client";

interface AffiliateLink {
  id: number;
  retailer: string;
  url: string;
  price: string;
}

export function ReviewBuyButtons({ links }: { links: AffiliateLink[] }) {
  if (links.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ fontSize: "0.78rem", color: "var(--muted, #8b8680)", fontWeight: 600, letterSpacing: "0.08em" }}>
        WHERE TO BUY
      </div>
      {links.map(link => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="sponsored noopener noreferrer"
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "#1a6b2a", color: "white",
            padding: "12px 20px", borderRadius: 10, textDecoration: "none",
            fontWeight: 600, fontSize: "0.9rem", transition: "background 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "#5a9e2f")}
          onMouseLeave={e => (e.currentTarget.style.background = "#1a6b2a")}
        >
          <span>Buy at {link.retailer}</span>
          {link.price && (
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.2rem" }}>{link.price}</span>
          )}
        </a>
      ))}
    </div>
  );
}
