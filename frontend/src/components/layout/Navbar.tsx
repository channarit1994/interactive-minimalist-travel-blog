"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Map" },
  { href: "/blog", label: "Stories" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 bg-[#FAF9F6]/90 backdrop-blur-sm">
      <Link href="/" className="text-[#2C302E] tracking-widest text-sm font-medium uppercase">
        Taiwan Stories
      </Link>
      <nav className="flex gap-8">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`text-sm tracking-wide transition-colors ${
              pathname === href
                ? "text-[#D97706]"
                : "text-[#2C302E] hover:text-[#D97706]"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
