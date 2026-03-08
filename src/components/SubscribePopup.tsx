"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "lm_subscribe_dismissed";

export function SubscribePopup() {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;

    const handleScroll = () => {
      const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (scrolled >= 0.25) {
        setVisible(true);
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });

    if (res.ok) {
      setStatus("success");
      localStorage.setItem(STORAGE_KEY, "1");
      setTimeout(() => setVisible(false), 2500);
    } else {
      const data = await res.json();
      setErrorMsg(data.error ?? "Something went wrong");
      setStatus("error");
    }
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 999,
        background: "rgba(0,0,0,0.55)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
    >
      <div style={{
        background: "var(--dark, #0e1a0f)",
        border: "1px solid rgba(168,216,50,0.25)",
        borderRadius: 16,
        padding: "2.5rem 2rem",
        width: "100%",
        maxWidth: 420,
        position: "relative",
        boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
      }}>
        {/* Close button */}
        <button
          onClick={dismiss}
          aria-label="Close"
          style={{
            position: "absolute", top: 12, right: 14,
            background: "none", border: "none",
            color: "rgba(255,255,255,0.4)", fontSize: 22,
            cursor: "pointer", lineHeight: 1,
          }}
        >×</button>

        {status === "success" ? (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🌿</div>
            <h2 style={{ color: "#a8d832", fontSize: "1.4rem", marginBottom: 8 }}>You're in!</h2>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem" }}>
              Thanks {name.split(" ")[0]}! We'll send you the best mower deals and guides.
            </p>
          </div>
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>🌱</div>
              <h2 style={{ color: "#a8d832", fontSize: "1.35rem", marginBottom: 8, fontWeight: 700 }}>
                Get the Best Mower Deals
              </h2>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.88rem", lineHeight: 1.5 }}>
                Join 10,000+ homeowners who get exclusive deals, seasonal tips, and expert buying guides — straight to their inbox.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                style={inputStyle}
              />
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={inputStyle}
              />

              {status === "error" && (
                <p style={{ color: "#ff6b6b", fontSize: "0.82rem", margin: 0 }}>{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                style={{
                  background: "var(--lime, #a8d832)",
                  color: "#0e1a0f",
                  border: "none",
                  borderRadius: 8,
                  padding: "12px",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  cursor: status === "loading" ? "not-allowed" : "pointer",
                  opacity: status === "loading" ? 0.7 : 1,
                  transition: "opacity 0.2s",
                  marginTop: 4,
                }}
              >
                {status === "loading" ? "Subscribing…" : "Get Free Updates"}
              </button>
            </form>

            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem", textAlign: "center", marginTop: 14, marginBottom: 0 }}>
              No spam. Unsubscribe anytime.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 8,
  padding: "10px 14px",
  color: "white",
  fontSize: "0.9rem",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};
