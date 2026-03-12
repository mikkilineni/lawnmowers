"use client";

import { useEffect } from "react";

export function InArticleAd() {
  useEffect(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch { /* already initialized */ }
  }, []);

  return (
    <div style={{ margin: "1.5rem 0" }}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="ca-pub-9865114779201806"
        data-ad-slot="8957005333"
      />
    </div>
  );
}
