import type { NextConfig } from "next";

// 301 redirects consolidating duplicate robotic-mower listicle posts
// into one canonical per topic cluster.
const roboticMowerRedirects = [
  // ── Cluster 1: "Are robotic mowers worth it?" ──
  // Canonical: /blog/2026-07-20-are-robotic-lawn-mowers-worth-it
  { source: "/blog/2026-05-02-robotic-lawn-mowers-worth-it-guide",        destination: "/blog/2026-07-20-are-robotic-lawn-mowers-worth-it" },
  { source: "/blog/2026-05-06-robotic-lawn-mowers-worth-the-investment",   destination: "/blog/2026-07-20-are-robotic-lawn-mowers-worth-it" },
  { source: "/blog/2026-05-19-robotic-lawn-mowers-worth-it",               destination: "/blog/2026-07-20-are-robotic-lawn-mowers-worth-it" },
  { source: "/blog/2026-05-30-robotic-lawn-mowers-worth-the-investment",   destination: "/blog/2026-07-20-are-robotic-lawn-mowers-worth-it" },
  { source: "/blog/2026-06-06-robotic-lawn-mowers-worth-it",               destination: "/blog/2026-07-20-are-robotic-lawn-mowers-worth-it" },
  { source: "/blog/2026-06-10-robotic-lawn-mowers-worth-it-2026",          destination: "/blog/2026-07-20-are-robotic-lawn-mowers-worth-it" },

  // ── Cluster 2: "Complete buyer's guide" ──
  // Canonical: /blog/2026-06-15-robotic-lawn-mowers-buyers-guide
  { source: "/blog/2026-05-05-robotic-lawn-mowers-buyers-guide",           destination: "/blog/2026-06-15-robotic-lawn-mowers-buyers-guide" },
  { source: "/blog/2026-05-09-robotic-lawn-mowers-complete-buyers-guide",  destination: "/blog/2026-06-15-robotic-lawn-mowers-buyers-guide" },
  { source: "/blog/2026-05-12-robotic-lawn-mowers-complete-buyers-guide",  destination: "/blog/2026-06-15-robotic-lawn-mowers-buyers-guide" },
  { source: "/blog/2026-05-16-robotic-lawn-mowers-smart-yard-care-guide",  destination: "/blog/2026-06-15-robotic-lawn-mowers-buyers-guide" },
  { source: "/blog/2026-05-18-robotic-lawn-mowers-ultimate-buyers-guide",  destination: "/blog/2026-06-15-robotic-lawn-mowers-buyers-guide" },
  { source: "/blog/2026-06-04-robotic-lawn-mowers-buyers-guide",           destination: "/blog/2026-06-15-robotic-lawn-mowers-buyers-guide" },
  { source: "/blog/2026-06-05-robotic-lawn-mowers-buyers-guide",           destination: "/blog/2026-06-15-robotic-lawn-mowers-buyers-guide" },

  // ── Cluster 3: "Boundary wire vs GPS" ──
  // Canonical: /blog/2026-06-30-robotic-mower-navigation-boundary-wire-vs-gps
  { source: "/blog/2026-05-26-boundary-wire-vs-gps-robotic-mowers-buyer-guide", destination: "/blog/2026-06-30-robotic-mower-navigation-boundary-wire-vs-gps" },
  { source: "/blog/2026-06-03-boundary-wire-vs-gps-robotic-mowers",             destination: "/blog/2026-06-30-robotic-mower-navigation-boundary-wire-vs-gps" },
  { source: "/blog/2026-06-22-boundary-wire-vs-gps-robotic-mowers",             destination: "/blog/2026-06-30-robotic-mower-navigation-boundary-wire-vs-gps" },

  // ── Cluster 4: "Robotic vs electric mowers" ──
  // Canonical: /blog/2026-06-12-robotic-vs-electric-mowers-eco-friendly-picks
  { source: "/blog/2026-05-03-robotic-vs-electric-lawn-mowers",                 destination: "/blog/2026-06-12-robotic-vs-electric-mowers-eco-friendly-picks" },
  { source: "/blog/2026-05-04-robotic-vs-electric-lawn-mowers",                 destination: "/blog/2026-06-12-robotic-vs-electric-mowers-eco-friendly-picks" },
  { source: "/blog/2026-05-28-robotic-vs-electric-push-mowers",                 destination: "/blog/2026-06-12-robotic-vs-electric-mowers-eco-friendly-picks" },
  { source: "/blog/2026-06-01-robotic-vs-electric-mowers-time-savings",         destination: "/blog/2026-06-12-robotic-vs-electric-mowers-eco-friendly-picks" },
].map((r) => ({ ...r, permanent: true }));

const nextConfig: NextConfig = {
  async redirects() {
    return roboticMowerRedirects;
  },
};

export default nextConfig;
