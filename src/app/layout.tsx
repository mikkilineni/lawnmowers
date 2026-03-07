import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ChatWidget } from "@/components/ChatWidget";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lawnmowers.com — Find Your Perfect Mower",
  description: "Expert reviews, honest comparisons, and buying guides for lawnmowers. Trusted by 2M+ homeowners.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ChatWidget />
      </body>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </html>
  );
}
