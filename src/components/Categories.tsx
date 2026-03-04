import { CATEGORIES } from "@/data/products";

export function Categories() {
  return (
    <section id="categories" style={{ background: "var(--white)", padding: "5rem 7%" }}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <div style={labelStyle}>Browse by Type</div>
        <h2 style={titleStyle}>What Kind Of Mower Do You Need?</h2>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "1.25rem",
      }}>
        {CATEGORIES.map(cat => (
          <a key={cat.slug} href={`#products`} style={{
            background: "var(--cream)",
            border: "2px solid transparent",
            borderRadius: 12,
            padding: "2rem 1.5rem",
            textAlign: "center",
            textDecoration: "none",
            transition: "border-color 0.25s, transform 0.25s, box-shadow 0.25s",
            display: "block",
          }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "var(--green)";
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(26,107,42,0.15)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "transparent";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>{cat.emoji}</div>
            <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--dark)", marginBottom: 4 }}>{cat.name}</div>
            <div style={{ color: "var(--muted)", fontSize: "0.8rem" }}>{cat.price}</div>
          </a>
        ))}
      </div>
    </section>
  );
}

const labelStyle: React.CSSProperties = {
  color: "var(--green)",
  fontWeight: 600,
  fontSize: "0.78rem",
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  marginBottom: "0.75rem",
};

const titleStyle: React.CSSProperties = {
  fontFamily: "'Bebas Neue', sans-serif",
  fontSize: "clamp(2rem, 4vw, 3rem)",
  color: "var(--dark)",
  letterSpacing: "0.02em",
};
