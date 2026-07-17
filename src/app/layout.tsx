import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DevQuery — Product studio & engineering partner",
  description:
    "DevQuery is a product-led software studio. We ship our own tools, and we design, build, migrate and operate mission-critical systems for organizations — from ERP and databases to agentic AI pipelines and dedicated infrastructure.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
