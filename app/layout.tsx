import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MERSENGFAI — Web Designer & Developer",
  description: "Portfolio of MERSENGFAI, a web designer and developer based in Phnom Penh, Cambodia.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
