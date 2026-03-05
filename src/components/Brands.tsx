export function Brands({ brands }: { brands: string[] }) {
  return (
    <section style={{
      background: "var(--charcoal)",
      padding: "2rem 7%",
      display: "flex",
      alignItems: "center",
      gap: "2.5rem",
      flexWrap: "wrap",
    }}>
      <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em", flexShrink: 0 }}>
        TOP BRANDS WE COVER
      </span>
      <div style={{ display: "flex", gap: "2.5rem", flexWrap: "wrap", alignItems: "center" }}>
        {brands.map(b => (
          <span key={b} style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "1.1rem",
            color: "rgba(255,255,255,0.35)",
            letterSpacing: "0.1em",
            transition: "color 0.2s",
            cursor: "default",
          }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--lime)")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
          >{b}</span>
        ))}
      </div>
    </section>
  );
}
