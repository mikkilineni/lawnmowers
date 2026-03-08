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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {children}
          <ChatWidget />
          <SubscribePopup />
          <SocialSidebar />
        </SessionProvider>
      </body>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </html>
  );
}
