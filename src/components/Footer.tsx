const LINKS = {
  "Mower Types": ["Push Mowers", "Self-Propelled", "Riding Mowers", "Zero-Turn", "Robot Mowers"],
  "Top Brands":  ["EGO", "Honda", "Husqvarna", "John Deere", "Greenworks"],
  "Resources":   ["Buying Guide", "Mower Quiz", "Comparisons", "About Us", "Contact"],
};

export function Footer() {
  return (
    <footer style={{ background: "var(--dark)", padding: "4rem 7% 2rem" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "2fr repeat(3, 1fr)",
        gap: "3rem",
        marginBottom: "3rem",
      }}>
        {/* Brand */}
        <div>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "1.8rem",
            color: "var(--lime)",
            letterSpacing: 2,
            marginBottom: "0.75rem",
          }}>
            Lawn<span style={{ color: "var(--white)" }}>mowers.com</span>
          </div>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.85rem", lineHeight: 1.7, maxWidth: 240 }}>
            Your trusted source for unbiased lawnmower reviews, comparisons, and buying guides since 2019.
          </p>
        </div>

        {/* Link columns */}
        {Object.entries(LINKS).map(([heading, items]) => (
          <div key={heading}>
            <div style={{
              color: "var(--lime)",
              fontWeight: 700,
              fontSize: "0.75rem",
              letterSpacing: "0.12em",
              marginBottom: "1.25rem",
              textTransform: "uppercase",
            }}>{heading}</div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {items.map(item => (
                <li key={item}>
                  <a href="#" style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "0.875rem",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--white)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                  >{item}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.08)",
        paddingTop: "1.5rem",
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "0.5rem",
      }}>
        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.78rem" }}>
          © {new Date().getFullYear()} Lawnmowers.com. All rights reserved.
        </span>
        <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.72rem", maxWidth: 480 }}>
          Affiliate Disclosure: We may earn a commission on purchases made through links on this site.
        </span>
      </div>
    </footer>
  );
}
