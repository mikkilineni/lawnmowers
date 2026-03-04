"use client";

interface HeaderProps {
  onOpenQuiz: () => void;
}

export function Header({ onOpenQuiz }: HeaderProps) {
  return (
    <nav style={{
      position: "fixed", top: 0, width: "100%", zIndex: 100,
      background: "rgba(14,26,15,0.95)",
      backdropFilter: "blur(12px)",
      padding: "0 5%",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      height: 64,
      borderBottom: "1px solid rgba(168,216,50,0.15)",
    }}>
      <a href="#top" style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: "1.7rem",
        color: "var(--lime)",
        letterSpacing: 2,
        textDecoration: "none",
      }}>
        Lawn<span style={{ color: "var(--white)" }}>mowers.com</span>
      </a>

      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        <a href="#categories" style={navLinkStyle}>Types</a>
        <a href="#products" style={navLinkStyle}>Top Picks</a>
        <a href="#guides" style={navLinkStyle}>Guides</a>
        <button onClick={onOpenQuiz} style={{
          background: "var(--lime)",
          color: "var(--dark)",
          border: "none",
          padding: "8px 20px",
          borderRadius: 6,
          fontWeight: 600,
          fontSize: "0.85rem",
          cursor: "pointer",
          letterSpacing: "0.03em",
          transition: "opacity 0.2s",
        }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          Find My Mower
        </button>
      </div>
    </nav>
  );
}

const navLinkStyle: React.CSSProperties = {
  color: "rgba(255,255,255,0.75)",
  textDecoration: "none",
  fontSize: "0.85rem",
  fontWeight: 500,
  letterSpacing: "0.05em",
  transition: "color 0.2s",
};
