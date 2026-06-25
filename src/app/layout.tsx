import type { Metadata } from "next";
import { Inter, Space_Grotesk, Syne } from "next/font/google";
import "./globals.css";
import { AuroraBackground } from "@/components/layout/AuroraBackground";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartSheet } from "@/components/cart/CartSheet";
import { VoiceAgent } from "@/components/voice/VoiceAgent";
import { VoiceControlProvider } from "@/components/voice/VoiceControlProvider";
import { SITE } from "@/lib/site";

const syne = Syne({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-syne", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s · ${SITE.name}` },
  description: SITE.description,
  openGraph: { title: SITE.name, description: SITE.description, type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${syne.variable} ${inter.variable} ${grotesk.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <CartProvider>
          <VoiceControlProvider>
            <AuroraBackground />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartSheet />
            <VoiceAgent />
          </VoiceControlProvider>
        </CartProvider>
      </body>
    </html>
  );
}
