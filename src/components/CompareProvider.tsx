"use client";

import { createContext, useContext, useState, useEffect } from "react";

const MAX = 4;
const KEY = "compare_items";

export interface CompareItem { id: number; name: string; emoji: string; }

interface CompareCtx {
  items: CompareItem[];
  ids: number[];
  isSelected: (id: number) => boolean;
  toggle: (item: CompareItem) => void;
  clear: () => void;
  maxReached: boolean;
}

const CompareContext = createContext<CompareCtx>({
  items: [],
  ids: [],
  isSelected: () => false,
  toggle: () => {},
  clear: () => {},
  maxReached: false,
});

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CompareItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch { /* ignore */ }
  }, [items]);

  const ids = items.map(i => i.id);
  const isSelected = (id: number) => ids.includes(id);

  const toggle = (item: CompareItem) =>
    setItems(prev =>
      prev.some(x => x.id === item.id)
        ? prev.filter(x => x.id !== item.id)
        : prev.length < MAX ? [...prev, item] : prev
    );

  const clear = () => setItems([]);

  return (
    <CompareContext.Provider value={{ items, ids, isSelected, toggle, clear, maxReached: items.length >= MAX }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  return useContext(CompareContext);
}
