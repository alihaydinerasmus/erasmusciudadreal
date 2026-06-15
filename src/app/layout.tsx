import type { Metadata } from "next";
import { Caveat, Lato, Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  style: ["normal", "italic"],
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-lato",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ciudad Real '25–26",
  description:
    "A private memory album for friends — where everyone ended up after Erasmus.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${lato.variable} ${caveat.variable} min-h-screen bg-cream font-sans text-ink antialiased`}
      >
        <div className="paper-texture min-h-screen">{children}</div>
      </body>
    </html>
  );
}
