import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import AIChatWidget from "@/components/AIChatWidget";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Glamourly — Luxury Salon Discovery & Booking | Mumbai",
  description:
    "Discover Mumbai's most prestigious verified salons, hair spas, and wellness studios. Book verified stylists with instant slot reservation and transparent pricing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen bg-stone-50 font-sans antialiased text-stone-900 flex flex-col">
        <AuthProvider>
          {children}
          <AIChatWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
