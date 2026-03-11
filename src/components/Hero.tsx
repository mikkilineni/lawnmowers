"use client";

interface HeroProps {
  onOpenQuiz: () => void;
}

const PILLS = ["Gas", "Electric", "Battery", "Robotic", "Riding"];

export function Hero({ onOpenQuiz }: HeroProps) {
  return (
    <section id="top" className="hero-section" style={{
      minHeight: "100vh",
      background: `linear-gradient(135deg, var(--dark) 0%, var(--charcoal) 60%, #0f2d14 100%)`,
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      alignItems: "center",
      padding: "0 7%",
      paddingTop: 64,
      gap: "4rem",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Grain texture */}
      <div className="hero-grain" aria-hidden="true" />
      {/* Curved cream cutout at bottom */}
      <div className="hero-wave" aria-hidden="true" />
      {/* Left */}
      <div style={{ position: "relative", zIndex: 3 }}>
        <div className="fade-up" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(168,216,50,0.12)",
          border: "1px solid rgba(168,216,50,0.3)",
          borderRadius: 20,
          padding: "6px 14px",
          fontSize: "0.75rem",
          color: "var(--lime)",
          fontWeight: 500,
          letterSpacing: "0.05em",
          marginBottom: "1.5rem",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--lime)", display: "inline-block" }} />
          Expert Reviews · Unbiased Picks · Best Prices
        </div>

        <h1 className="fade-up-1" style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(3rem, 6vw, 5.5rem)",
          lineHeight: 1.0,
          color: "var(--white)",
          marginBottom: "1.5rem",
          letterSpacing: "0.02em",
        }}>
          The Last Mower Guide{" "}
          <em style={{ color: "var(--lime)", fontStyle: "normal" }}>You&apos;ll Need</em>
        </h1>

        <p className="fade-up-2" style={{
          color: "rgba(255,255,255,0.65)",
          fontSize: "1.1rem",
          lineHeight: 1.7,
          marginBottom: "2.5rem",
          maxWidth: 480,
        }}>
          We test, review, and rank hundreds of mowers so you don&apos;t have to. Find the perfect match for your lawn, budget, and lifestyle.
        </p>

        <div className="fade-up-2" style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
          <a href="#products" style={{
            background: "var(--lime)",
            color: "var(--dark)",
            padding: "14px 32px",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: "1rem",
            textDecoration: "none",
            transition: "transform 0.2s",
          }}
            onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
          >
            See Top Picks
          </a>
          <button onClick={onOpenQuiz} style={{
            background: "transparent",
            color: "var(--white)",
            padding: "14px 32px",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: "1rem",
            border: "2px solid rgba(255,255,255,0.3)",
            cursor: "pointer",
            transition: "border-color 0.2s",
          }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.7)")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)")}
          >
            Find My Perfect Mower
          </button>
        </div>

        {/* Stats */}
        <div className="fade-up-3" style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1.5rem",
          paddingTop: "2rem",
          borderTop: "1px solid rgba(255,255,255,0.1)",
        }}>
          {[
            { num: "200+", label: "Mowers Reviewed" },
            { num: "40K+", label: "Happy Readers" },
            { num: "100%", label: "Independent" },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.2rem", color: "var(--lime)", lineHeight: 1 }}>{s.num}</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — featured card (hidden on mobile) */}
      <div className="hero-right" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 3 }}>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(5rem, 10vw, 9rem)",
          color: "rgba(168,216,50,0.06)",
          letterSpacing: "0.1em",
          lineHeight: 1,
          marginBottom: "-2rem",
          userSelect: "none",
        }}>MOWER</div>

        <div className="hero-float" style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(168,216,50,0.2)",
          borderRadius: 16,
          padding: "2rem",
          width: "100%",
          maxWidth: 380,
          backdropFilter: "blur(8px)",
          position: "relative",
          boxShadow: "0 24px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(168,216,50,0.08)",
        }}>
          <div style={{
            position: "absolute", top: -14, right: 24,
            background: "var(--lime)", color: "var(--dark)",
            padding: "4px 14px", borderRadius: 20,
            fontWeight: 700, fontSize: "0.75rem",
            letterSpacing: "0.05em",
          }}>🔥 HOT PICK</div>

          <div style={{ fontSize: "5rem", textAlign: "center", marginBottom: "1rem" }}>🌿</div>

          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", marginBottom: 4, letterSpacing: "0.1em" }}>EGO POWER+</div>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.4rem", color: "var(--white)", marginBottom: "1rem" }}>
            LM2135SP Self-Propelled
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "1rem" }}>
            <span style={{ color: "#fbbf24", fontSize: "1.1rem" }}>★★★★★</span>
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.82rem" }}>4.9 (2,847 reviews)</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: "var(--lime)" }}>$549</span>
              <span style={{ color: "rgba(255,255,255,0.4)", textDecoration: "line-through", marginLeft: 8, fontSize: "0.9rem" }}>$649</span>
            </div>
            <div style={{ background: "rgba(168,216,50,0.15)", color: "var(--lime)", padding: "4px 10px", borderRadius: 6, fontSize: "0.78rem", fontWeight: 600 }}>
              Save $100
            </div>
          </div>
        </div>

        {/* Category pills */}
        <div style={{ display: "flex", gap: 8, marginTop: "1.5rem", flexWrap: "wrap", justifyContent: "center" }}>
          {PILLS.map(p => (
            <a key={p} href="#categories" style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.7)",
              padding: "6px 16px",
              borderRadius: 20,
              fontSize: "0.8rem",
              textDecoration: "none",
              transition: "background 0.2s, color 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(168,216,50,0.15)"; e.currentTarget.style.color = "var(--lime)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
            >{p}</a>
          ))}
        </div>
      </div>
    </section>
  );
}
