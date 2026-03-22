"use client";

import { useState, useEffect } from "react";

const KEY = "compare_ids";
const MAX = 4;

export function useCompareSelection() {
  const [ids, setIds] = useState<number[]>([]);

  // Read from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored) setIds(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  // Persist on every change
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(ids));
    } catch { /* ignore */ }
  }, [ids]);

  const isSelected = (id: number) => ids.includes(id);

  const toggle = (id: number) => {
    setIds(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : prev.length < MAX
          ? [...prev, id]
          : prev
    );
  };

  const clear = () => setIds([]);

  return { ids, isSelected, toggle, clear, maxReached: ids.length >= MAX };
}
