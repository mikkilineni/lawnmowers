"use client";

interface QuizBannerProps {
  onOpenQuiz: () => void;
}

export function QuizBanner({ onOpenQuiz }: QuizBannerProps) {
  return (
    <section style={{
      background: "linear-gradient(135deg, var(--dark) 0%, #1a4520 100%)",
      padding: "4rem 7%",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        fontSize: "12rem",
        opacity: 0.04,
        userSelect: "none",
        pointerEvents: "none",
      }}>🌿</div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <h2 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(2rem, 4vw, 3.2rem)",
          color: "var(--white)",
          letterSpacing: "0.02em",
          marginBottom: "0.75rem",
        }}>
          Not Sure Which Mower Is{" "}
          <span style={{ color: "var(--lime)" }}>Right For You?</span>
        </h2>
        <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "2rem", fontSize: "1rem" }}>
          Answer 3 quick questions and we&apos;ll match you with the perfect mower.
        </p>
        <button onClick={onOpenQuiz} style={{
          background: "var(--lime)",
          color: "var(--dark)",
          border: "none",
          padding: "14px 36px",
          borderRadius: 8,
          fontWeight: 700,
          fontSize: "1rem",
          cursor: "pointer",
          letterSpacing: "0.03em",
          transition: "transform 0.2s, opacity 0.2s",
        }}
          onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
          onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
        >
          Take the Quiz →
        </button>
      </div>
    </section>
  );
}
