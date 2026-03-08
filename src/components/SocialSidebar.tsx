"use client";

import { useState } from "react";

const socials = [
  {
    name: "Facebook",
    href: "#",
    color: "#1877f2",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "#",
    color: "#e1306c",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "#",
    color: "#ff0000",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    name: "X (Twitter)",
    href: "#",
    color: "#e7e9ea",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
];

export function SocialSidebar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      {/* Desktop: fixed vertical sidebar */}
      <div className="social-sidebar-desktop" style={{
        position: "fixed",
        right: 0,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 90,
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}>
        {socials.map((s) => (
          <a
            key={s.name}
            href={s.href}
            aria-label={s.name}
            title={s.name}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 44,
              height: 44,
              background: "rgba(14,26,15,0.92)",
              color: "rgba(255,255,255,0.55)",
              borderRadius: "8px 0 0 8px",
              borderTop: "1px solid rgba(168,216,50,0.12)",
              borderLeft: "1px solid rgba(168,216,50,0.12)",
              borderBottom: "1px solid rgba(168,216,50,0.12)",
              textDecoration: "none",
              transition: "color 0.2s, background 0.2s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.color = s.color;
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(14,26,15,1)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.55)";
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(14,26,15,0.92)";
            }}
          >
            {s.icon}
          </a>
        ))}
      </div>

      {/* Mobile: collapsed tab that expands */}
      <div className="social-sidebar-mobile" style={{
        position: "fixed",
        right: 0,
        bottom: 100,
        zIndex: 90,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
      }}>
        {/* Toggle tab */}
        <button
          onClick={() => setExpanded(o => !o)}
          aria-label="Toggle social links"
          style={{
            background: "rgba(14,26,15,0.95)",
            border: "1px solid rgba(168,216,50,0.2)",
            borderRight: "none",
            borderRadius: "8px 0 0 8px",
            color: "#a8d832",
            padding: "8px 6px",
            cursor: "pointer",
            fontSize: 18,
            lineHeight: 1,
            marginBottom: 2,
          }}
        >
          {expanded ? "›" : "‹"}
        </button>

        {/* Expandable icons */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          overflow: "hidden",
          maxHeight: expanded ? 300 : 0,
          transition: "max-height 0.3s ease",
        }}>
          {socials.map((s) => (
            <a
              key={s.name}
              href={s.href}
              aria-label={s.name}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                background: "rgba(14,26,15,0.95)",
                color: s.color,
                borderRadius: "8px 0 0 8px",
                border: "1px solid rgba(168,216,50,0.15)",
                borderRight: "none",
                textDecoration: "none",
              }}
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>

      <style>{`
        .social-sidebar-mobile { display: none; }
        .social-sidebar-desktop { display: flex; }
        @media (max-width: 768px) {
          .social-sidebar-desktop { display: none; }
          .social-sidebar-mobile { display: flex; }
        }
      `}</style>
    </>
  );
}
