"use client";

import { useState, useEffect } from "react";

interface HeaderProps {
  onOpenQuiz: () => void;
}

export function Header({ onOpenQuiz }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("mobile-menu-open", menuOpen);
    return () => document.body.classList.remove("mobile-menu-open");
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, width: "100%", zIndex: 100,
        background: "rgba(14,26,15,0.95)",
        backdropFilter: "blur(12px)",
        padding: "0 5%",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 64,
        borderBottom: "1px solid rgba(168,216,50,0.15)",
      }}>
        <a href="#top" style={{ textDecoration: "none", display: "flex", alignItems: "center" }} aria-label="Lawnmowers.com">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 64" height="36" role="img" aria-hidden="true">
            {/* Icon */}
            <rect x="0" y="4" width="56" height="56" rx="11" fill="#5a9e2f"/>
            <rect x="9"  y="14" width="3" height="7"  rx="1.5" fill="#a8d832"/>
            <rect x="15" y="12" width="3" height="9"  rx="1.5" fill="#a8d832"/>
            <rect x="21" y="13" width="3" height="8"  rx="1.5" fill="#a8d832"/>
            <rect x="27" y="12" width="3" height="9"  rx="1.5" fill="#a8d832"/>
            <rect x="33" y="14" width="3" height="7"  rx="1.5" fill="#a8d832"/>
            <rect x="7" y="20" width="32" height="11" rx="3" fill="white"/>
            <circle cx="13" cy="36" r="6"   fill="white"/>
            <circle cx="13" cy="36" r="2.4" fill="#5a9e2f"/>
            <circle cx="34" cy="36" r="6"   fill="white"/>
            <circle cx="34" cy="36" r="2.4" fill="#5a9e2f"/>
            <line x1="39" y1="26" x2="52" y2="10" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
            {/* Wordmark */}
            <text x="70" y="47" fontFamily="'Bebas Neue', 'Arial Black', Arial, sans-serif" fontSize="38" letterSpacing="1">
              <tspan fill="#a8d832">Lawn</tspan>
              <tspan fill="white">mowers</tspan>
              <tspan fill="#78be44" fontSize="28" dy="4">.com</tspan>
            </text>
          </svg>
        </a>

        {/* Desktop nav */}
        <div className="nav-links">
          <a href="#categories" style={navLinkStyle}>Types</a>
          <a href="#products" style={navLinkStyle}>Top Picks</a>
          <a href="#guides" style={navLinkStyle}>Guides</a>
          <button onClick={onOpenQuiz} style={{
            background: "var(--lime)", color: "var(--dark)",
            border: "none", padding: "8px 20px", borderRadius: 6,
            fontWeight: 600, fontSize: "0.85rem", cursor: "pointer",
            letterSpacing: "0.03em", transition: "opacity 0.2s",
          }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            Find My Mower
          </button>
        </div>

        {/* Hamburger button */}
        <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
          <span style={{ transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
          <span style={{ opacity: menuOpen ? 0 : 1 }} />
          <span style={{ transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
        </button>
      </nav>

      {/* Mobile overlay menu */}
      <div className={`mobile-nav${menuOpen ? " open" : ""}`}>
        <a href="#categories" onClick={close}>Types</a>
        <a href="#products" onClick={close}>Top Picks</a>
        <a href="#guides" onClick={close}>Guides</a>
        <button className="mobile-cta" onClick={() => { close(); onOpenQuiz(); }}>
          Find My Mower
        </button>
      </div>
    </>
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
