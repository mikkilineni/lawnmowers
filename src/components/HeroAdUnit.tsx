"use client";

import { useEffect } from "react";

export function HeroAdUnit({ slot }: { slot: string }) {
  useEffect(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch { /* already initialized */ }
  }, []);

  return (
    <div style={{ width: "100%", maxWidth: 380, marginTop: "1rem" }}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-9865114779201806"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
