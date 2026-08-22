import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kamakshi Amrutham | Fresh Vegetarian Lunch Meals – Nizampet, Bachupally & More",
  description:
    "Kamakshi Amrutham serves fresh, pure vegetarian homemade-style lunch meals with free home delivery in Nizampet, Bachupally, Mallampet, Pragati Nagar, Miyapur, Vasanth Nagar, HMT Hills & Sardar Patel Nagar. Anna • Pindi • Pachullu.",
  keywords: "vegetarian lunch, home delivery, Nizampet, Bachupally, Mallampet, Kamakshi Amrutham, lunch meals, Anna Pindi Pachullu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="te" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Noto+Serif+Telugu:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-cream-50 text-stone-900 font-sans selection:bg-gold-200 selection:text-brand-900">
        {children}
      </body>
    </html>
  );
}
