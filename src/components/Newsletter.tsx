"use client";

import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section style={{
      background: "linear-gradient(135deg, var(--green) 0%, var(--green-mid) 100%)",
      padding: "5rem 7%",
      textAlign: "center",
    }}>
      <h2 style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: "clamp(2rem, 4vw, 3rem)",
        color: "var(--white)",
        letterSpacing: "0.02em",
        marginBottom: "0.75rem",
      }}>
        Get the Best Deals Before They&apos;re Gone
      </h2>
      <p style={{ color: "rgba(255,255,255,0.75)", marginBottom: "2.5rem", fontSize: "1rem" }}>
        Weekly buying guides, price drops, and expert picks — straight to your inbox.
      </p>

      {submitted ? (
        <div style={{
          background: "rgba(255,255,255,0.15)",
          border: "2px solid rgba(255,255,255,0.4)",
          borderRadius: 12,
          padding: "1.25rem 2.5rem",
          display: "inline-block",
          color: "var(--white)",
          fontWeight: 600,
          fontSize: "1rem",
        }}>
          ✓ You&apos;re on the list! Check your inbox.
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{
          display: "flex",
          gap: "0",
          maxWidth: 480,
          margin: "0 auto",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          borderRadius: 10,
          overflow: "hidden",
        }}>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              flex: 1,
              padding: "14px 20px",
              border: "none",
              fontSize: "0.95rem",
              outline: "none",
              background: "var(--white)",
              color: "var(--dark)",
            }}
          />
          <button type="submit" style={{
            background: "var(--lime)",
            color: "var(--dark)",
            border: "none",
            padding: "14px 28px",
            fontWeight: 700,
            fontSize: "0.95rem",
            cursor: "pointer",
            whiteSpace: "nowrap",
            transition: "opacity 0.2s",
          }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            Get Free Guides
          </button>
        </form>
      )}
    </section>
  );
}
