"use client";

import { useState, useRef, useEffect } from "react";

interface AffiliateLink {
  id: number;
  retailer: string;
  url: string;
  price: string;
}

interface RecommendedProduct {
  id: number;
  brand: string;
  name: string;
  price: string;
  image: string;
  emoji: string;
  rating: number;
  affiliateLinks: AffiliateLink[];
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  products?: RecommendedProduct[];
}

const WELCOME =
  "Hi! I'm your lawnmower expert 🌿 Tell me about your yard and I'll recommend the perfect mower. How big is your lawn?";

function TypingDots() {
  return (
    <>
      <style>{`
        @keyframes chatDot {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.3; }
          40% { transform: scale(1.1); opacity: 1; }
        }
      `}</style>
      <span style={{ display: "inline-flex", gap: 4, alignItems: "center", padding: "2px 0" }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#9ca3af",
              display: "inline-block",
              animation: `chatDot 1.2s ${i * 0.2}s infinite ease-in-out`,
            }}
          />
        ))}
      </span>
    </>
  );
}

function ProductCard({ product }: { product: RecommendedProduct }) {
  return (
    <div
      style={{
        background: "white",
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        padding: "0.65rem 0.75rem",
        display: "flex",
        gap: "0.65rem",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 8,
          background: "linear-gradient(135deg, var(--green) 0%, var(--green-mid) 100%)",
          flexShrink: 0,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.4rem",
        }}
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          product.emoji
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "0.65rem", color: "var(--muted)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {product.brand}
        </div>
        <div
          style={{
            fontSize: "0.8rem",
            fontWeight: 600,
            color: "var(--dark)",
            marginBottom: 4,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {product.name}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "1rem",
              color: "var(--green)",
              flexShrink: 0,
            }}
          >
            {product.price}
          </span>
          {product.affiliateLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="sponsored noopener noreferrer"
              style={{
                background: "var(--green)",
                color: "white",
                padding: "2px 8px",
                borderRadius: 4,
                fontSize: "0.68rem",
                fontWeight: 600,
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              {link.retailer}
              {link.price ? ` · ${link.price}` : ""}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const apiMessages = newMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.message,
          products: data.recommendedProducts,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open mower expert chat"}
        className={!open ? "fab-pulse" : ""}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "var(--green)",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontSize: open ? "1.1rem" : "1.4rem",
          boxShadow: "0 4px 20px rgba(0,0,0,0.22)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.08)";
          e.currentTarget.style.boxShadow = "0 6px 28px rgba(0,0,0,0.28)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.22)";
        }}
      >
        {open ? "✕" : "💬"}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 92,
            right: 24,
            width: 380,
            maxWidth: "calc(100vw - 48px)",
            height: 560,
            maxHeight: "calc(100vh - 120px)",
            background: "white",
            borderRadius: 16,
            boxShadow: "0 12px 48px rgba(0,0,0,0.18)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 999,
            border: "1px solid rgba(0,0,0,0.07)",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "var(--green)",
              padding: "0.9rem 1.25rem",
              color: "white",
              flexShrink: 0,
            }}
          >
            <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>
              🌿 Mower Expert
            </div>
            <div style={{ fontSize: "0.72rem", opacity: 0.8, marginTop: 2 }}>
              Personalized recommendations
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "0.9rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.65rem",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                  gap: "0.45rem",
                }}
              >
                <div
                  style={{
                    maxWidth: "88%",
                    padding: "0.55rem 0.85rem",
                    borderRadius:
                      msg.role === "user"
                        ? "12px 12px 4px 12px"
                        : "12px 12px 12px 4px",
                    background:
                      msg.role === "user" ? "var(--green)" : "#f3f4f6",
                    color: msg.role === "user" ? "white" : "var(--dark)",
                    fontSize: "0.84rem",
                    lineHeight: 1.5,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.content}
                </div>

                {msg.products && msg.products.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.4rem",
                      width: "100%",
                    }}
                  >
                    {msg.products.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    padding: "0.55rem 0.85rem",
                    borderRadius: "12px 12px 12px 4px",
                    background: "#f3f4f6",
                  }}
                >
                  <TypingDots />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div
            style={{
              borderTop: "1px solid #f0ede8",
              padding: "0.65rem",
              display: "flex",
              gap: "0.5rem",
              flexShrink: 0,
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Describe your lawn..."
              disabled={loading}
              style={{
                flex: 1,
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: "0.84rem",
                outline: "none",
                fontFamily: "'DM Sans', sans-serif",
                background: loading ? "#f9fafb" : "white",
              }}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              style={{
                background: "var(--green)",
                color: "white",
                border: "none",
                borderRadius: 8,
                padding: "8px 14px",
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                opacity: loading || !input.trim() ? 0.55 : 1,
                fontSize: "1.1rem",
                transition: "opacity 0.15s",
              }}
            >
              ↑
            </button>
          </div>
        </div>
      )}
    </>
  );
}
