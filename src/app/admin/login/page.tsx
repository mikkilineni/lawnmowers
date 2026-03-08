"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
    } else {
      router.push("/admin");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--dark, #0e1a0f)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif",
      padding: "1rem",
    }}>
      <div style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(168,216,50,0.15)",
        borderRadius: 16,
        padding: "2.5rem 2rem",
        width: "100%",
        maxWidth: 380,
        boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "1.8rem",
            color: "#a8d832",
            letterSpacing: 3,
            marginBottom: 4,
          }}>
            Lawnmowers.com
          </div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.82rem" }}>
            Admin Login
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "0.78rem", fontWeight: 600, marginBottom: 6 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={{
                width: "100%", boxSizing: "border-box",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 8, padding: "10px 14px",
                color: "white", fontSize: "0.9rem", outline: "none",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "0.78rem", fontWeight: 600, marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{
                width: "100%", boxSizing: "border-box",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 8, padding: "10px 14px",
                color: "white", fontSize: "0.9rem", outline: "none",
              }}
            />
          </div>

          {error && (
            <div style={{ color: "#ff6b6b", fontSize: "0.82rem", textAlign: "center" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: "#a8d832", color: "#0e1a0f",
              border: "none", borderRadius: 8,
              padding: "12px", fontWeight: 700,
              fontSize: "0.95rem", cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "opacity 0.2s",
              marginTop: 4,
            }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
