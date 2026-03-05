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
        <a href="#top" style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "1.7rem",
          color: "var(--lime)",
          letterSpacing: 2,
          textDecoration: "none",
        }}>
          Lawn<span style={{ color: "var(--white)" }}>mowers.com</span>
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
