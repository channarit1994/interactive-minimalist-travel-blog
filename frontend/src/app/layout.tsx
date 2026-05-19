import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "Taiwan Stories — A Minimalist Travel Blog",
  description: "An interactive travel journal exploring Taiwan through cities, food, nature, and culture.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} antialiased`}>
      <body className="min-h-screen bg-[#FAF9F6] text-[#2C302E]">
        <Navbar />
        <main className="pt-20">{children}</main>
      </body>
    </html>
  );
}
