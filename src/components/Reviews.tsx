interface ReviewRow { id: number; text: string; name: string; location: string; initial: string; }

export function Reviews({ reviews }: { reviews: ReviewRow[] }) {
  return (
    <section style={{ background: "var(--white)", padding: "5rem 7%" }}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <div style={labelStyle}>Real Owner Reviews</div>
        <h2 style={titleStyle}>Trusted By Thousands of Homeowners</h2>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "1.5rem",
      }}>
        {reviews.map(r => (
          <div key={r.id} style={{
            background: "var(--cream)",
            borderRadius: 12,
            padding: "2rem",
            position: "relative",
          }}>
            <div style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "4rem",
              color: "var(--green-light)",
              lineHeight: 0.8,
              marginBottom: "1rem",
              opacity: 0.4,
            }}>"</div>
            <p style={{
              fontFamily: "'DM Serif Display', serif",
              fontStyle: "italic",
              color: "var(--dark)",
              fontSize: "1rem",
              lineHeight: 1.7,
              marginBottom: "1.5rem",
            }}>{r.text}</p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: "linear-gradient(135deg, var(--green), var(--lime))",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--white)", fontWeight: 700, fontSize: "1.1rem",
                flexShrink: 0,
              }}>{r.initial}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--dark)" }}>{r.name}</div>
                <div style={{ color: "var(--muted)", fontSize: "0.78rem" }}>{r.location}</div>
              </div>
              <div style={{ marginLeft: "auto", color: "#fbbf24", fontSize: "1rem" }}>★★★★★</div>
            </div>
          </div>
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
