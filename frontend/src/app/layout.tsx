import type { Metadata, Viewport } from "next";
import { Italiana, Jost } from "next/font/google";
import { brand } from "@/config/brand";
import "./globals.css";

const italiana = Italiana({
  variable: "--font-italiana",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${brand.name} | ${brand.tagline}`,
    template: `%s | ${brand.name}`,
  },
  description: brand.description,
};

export const viewport: Viewport = {
  themeColor: "#fbfbfc",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${italiana.variable} ${jost.variable}`}>
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
