"use client";

import { useState } from "react";
import { QUIZ_RESULTS } from "@/data/products";

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  {
    question: "How Big Is Your Lawn?",
    key: "size",
    options: [
      { icon: "🏠", label: "Small", sub: "Under 1/4 acre", value: "small" },
      { icon: "🏡", label: "Medium", sub: "1/4 to 1/2 acre", value: "medium" },
      { icon: "🌳", label: "Large", sub: "1/2 to 1 acre", value: "large" },
      { icon: "🌾", label: "Very Large", sub: "Over 1 acre", value: "very-large" },
    ],
  },
  {
    question: "Power Preference?",
    key: "power",
    options: [
      { icon: "⚡", label: "Electric", sub: "Quiet & eco-friendly", value: "electric" },
      { icon: "⛽", label: "Gas", sub: "Maximum power", value: "gas" },
      { icon: "🤖", label: "Robot", sub: "Fully automatic", value: "robot" },
      { icon: "🤷", label: "No Preference", sub: "Show me the best", value: "any" },
    ],
  },
  {
    question: "What's Your Budget?",
    key: "budget",
    options: [
      { icon: "💵", label: "Under $300", sub: "Budget-friendly", value: "low" },
      { icon: "💰", label: "$300–$700", sub: "Mid-range", value: "mid" },
      { icon: "💎", label: "$700–$2,000", sub: "Premium", value: "high" },
      { icon: "👑", label: "$2,000+", sub: "Top of the line", value: "top" },
    ],
  },
];

export function QuizModal({ isOpen, onClose }: QuizModalProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ emoji: string; name: string; price: string } | null>(null);

  if (!isOpen) return null;

  const currentStep = STEPS[step];
  const progress = result ? 100 : Math.round(((step) / STEPS.length) * 100);

  const select = (key: string, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const next = () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      const power = answers.power ?? "any";
      setResult(QUIZ_RESULTS[power] ?? QUIZ_RESULTS.any);
    }
  };

  const back = () => {
    if (result) {
      setResult(null);
    } else {
      setStep(s => Math.max(0, s - 1));
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => { setStep(0); setAnswers({}); setResult(null); }, 300);
  };

  return (
    <div
      onClick={handleClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(14,26,15,0.85)",
        backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "var(--white)",
          borderRadius: 16,
          width: "100%",
          maxWidth: 520,
          overflow: "hidden",
          animation: "modalIn 0.3s ease",
        }}
      >
        {/* Progress bar */}
        <div style={{ height: 4, background: "#f0ede8" }}>
          <div style={{
            height: "100%",
            width: `${progress}%`,
            background: "linear-gradient(90deg, var(--green), var(--lime))",
            transition: "width 0.4s ease",
          }} />
        </div>

        <div style={{ padding: "2rem" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem" }}>
            <div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", color: "var(--dark)", letterSpacing: "0.02em" }}>
                {result ? "Your Perfect Match" : `Step ${step + 1} of ${STEPS.length}`}
              </div>
              {!result && (
                <div style={{ color: "var(--muted)", fontSize: "0.82rem" }}>{currentStep.question}</div>
              )}
            </div>
            <button onClick={handleClose} style={{
              background: "var(--cream)", border: "none", borderRadius: "50%",
              width: 36, height: 36, cursor: "pointer", fontSize: "1.1rem",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--muted)",
            }}>✕</button>
          </div>

          {/* Result */}
          {result ? (
            <div style={{
              background: "linear-gradient(135deg, var(--cream) 0%, #e8f5ea 100%)",
              borderRadius: 12,
              padding: "2rem",
              textAlign: "center",
              marginBottom: "1.5rem",
            }}>
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>{result.emoji}</div>
              <div style={{ color: "var(--muted)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", marginBottom: 6 }}>
                WE RECOMMEND
              </div>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.4rem", color: "var(--dark)", marginBottom: "0.5rem" }}>
                {result.name}
              </div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: "var(--green)", marginBottom: "1.5rem" }}>
                {result.price}
              </div>
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                <a href="#products" onClick={handleClose} style={{
                  background: "var(--green)", color: "var(--white)",
                  padding: "10px 24px", borderRadius: 8,
                  fontWeight: 600, fontSize: "0.9rem", textDecoration: "none",
                }}>Read Full Review</a>
                <a href="#products" onClick={handleClose} style={{
                  background: "var(--lime)", color: "var(--dark)",
                  padding: "10px 24px", borderRadius: 8,
                  fontWeight: 600, fontSize: "0.9rem", textDecoration: "none",
                }}>Buy Now</a>
              </div>
            </div>
          ) : (
            /* Options */
            <div className="quiz-options" style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.75rem",
              marginBottom: "1.5rem",
            }}>
              {currentStep.options.map(opt => {
                const selected = answers[currentStep.key] === opt.value;
                return (
                  <button key={opt.value} onClick={() => select(currentStep.key, opt.value)} style={{
                    background: selected ? "rgba(26,107,42,0.08)" : "var(--cream)",
                    border: `2px solid ${selected ? "var(--green)" : "transparent"}`,
                    borderRadius: 10,
                    padding: "1rem",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "border-color 0.2s, background 0.2s",
                    display: "flex", alignItems: "center", gap: "0.75rem",
                  }}>
                    <span style={{ fontSize: "1.8rem" }}>{opt.icon}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--dark)" }}>{opt.label}</div>
                      <div style={{ color: "var(--muted)", fontSize: "0.72rem" }}>{opt.sub}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
            {(step > 0 || result) && (
              <button onClick={back} style={{
                background: "var(--cream)", border: "none",
                padding: "10px 20px", borderRadius: 8,
                color: "var(--muted)", fontWeight: 600, fontSize: "0.9rem",
                cursor: "pointer",
              }}>← Back</button>
            )}
            {!result && (
              <button
                onClick={next}
                disabled={!answers[currentStep.key]}
                style={{
                  background: answers[currentStep.key] ? "var(--green)" : "#ccc",
                  border: "none",
                  padding: "10px 24px", borderRadius: 8,
                  color: "var(--white)", fontWeight: 600, fontSize: "0.9rem",
                  cursor: answers[currentStep.key] ? "pointer" : "not-allowed",
                  transition: "background 0.2s",
                }}
              >
                {step === STEPS.length - 1 ? "See My Match →" : "Next →"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
