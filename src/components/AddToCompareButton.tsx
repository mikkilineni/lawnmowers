"use client";

import { useCompare } from "@/components/CompareProvider";

export function AddToCompareButton({ productId, name, emoji }: { productId: number; name: string; emoji: string }) {
  const { isSelected, toggle, maxReached } = useCompare();
  const selected = isSelected(productId);
  const disabled = !selected && maxReached;

  return (
    <button
      onClick={() => toggle({ id: productId, name, emoji })}
      disabled={disabled}
      title={disabled ? "Max 4 products" : selected ? "Remove from comparison" : "Add to comparison"}
      style={{
        background: selected ? "var(--dark)" : "transparent",
        color: selected ? "var(--lime)" : "var(--green)",
        border: `1px solid ${selected ? "var(--dark)" : "var(--green)"}`,
        borderRadius: 8,
        padding: "7px 14px",
        fontSize: "0.78rem",
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transition: "all 0.2s",
        whiteSpace: "nowrap",
      }}
    >
      {selected ? "✓ Added" : "⊕ Compare"}
    </button>
  );
}
