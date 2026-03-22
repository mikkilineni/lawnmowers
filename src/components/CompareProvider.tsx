"use client";

import { createContext, useContext, useState, useEffect } from "react";

const MAX = 4;
const KEY = "compare_ids";

interface CompareCtx {
  ids: number[];
  isSelected: (id: number) => boolean;
  toggle: (id: number) => void;
  clear: () => void;
  maxReached: boolean;
}

const CompareContext = createContext<CompareCtx>({
  ids: [],
  isSelected: () => false,
  toggle: () => {},
  clear: () => {},
  maxReached: false,
});

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<number[]>([]);

  // Read from localStorage after mount
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

  const toggle = (id: number) =>
    setIds(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : prev.length < MAX ? [...prev, id] : prev
    );

  const clear = () => setIds([]);

  return (
    <CompareContext.Provider value={{ ids, isSelected, toggle, clear, maxReached: ids.length >= MAX }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  return useContext(CompareContext);
}
