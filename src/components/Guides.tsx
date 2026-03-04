import { GUIDES } from "@/data/products";

export function Guides() {
  return (
    <section id="guides" style={{ background: "var(--cream)", padding: "5rem 7%" }}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <div style={labelStyle}>Buying Guides & Tips</div>
        <h2 style={titleStyle}>Learn Before You Buy</h2>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "1.5rem",
      }}>
        {GUIDES.map(g => (
          <a key={g.id} href="#" style={{
            background: "var(--white)",
            borderRadius: 12,
            overflow: "hidden",
            textDecoration: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            transition: "transform 0.25s, box-shadow 0.25s",
            display: "block",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)"; }}
          >
            <div style={{
              height: 140,
              background: "linear-gradient(135deg, var(--cream) 0%, #e8f5ea 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "3.5rem",
            }}>{g.emoji}</div>
            <div style={{ padding: "1.25rem" }}>
              <span style={{
                background: "rgba(26,107,42,0.1)",
                color: "var(--green)",
                padding: "3px 10px",
                borderRadius: 4,
                fontSize: "0.7rem",
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}>{g.tag}</span>
              <div style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "1.05rem",
                color: "var(--dark)",
                margin: "0.75rem 0",
                lineHeight: 1.4,
              }}>{g.title}</div>
              <div style={{ display: "flex", gap: "1rem", color: "var(--muted)", fontSize: "0.75rem" }}>
                <span>{g.readTime}</span>
                <span>{g.updated}</span>
              </div>
            </div>
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
