import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ChatWidget } from "@/components/ChatWidget";
import { SubscribePopup } from "@/components/SubscribePopup";
import { SocialSidebar } from "@/components/SocialSidebar";
import { SessionProvider } from "@/components/SessionProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lawnmowers.com — Find Your Perfect Mower",
  description: "Expert reviews, honest comparisons, and buying guides for lawnmowers. Trusted by 2M+ homeowners.",
  other: {
    "fo-verify": "56e4352f-6a80-457e-9bd7-ed9e8a4d7fd9",
    "impact-site-verification": "e7b4e2ee-5b10-461e-b49a-75164a7c302b",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9865114779201806"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <SessionProvider>
          {children}
          <ChatWidget />
          <SubscribePopup />
          <SocialSidebar />
        </SessionProvider>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
