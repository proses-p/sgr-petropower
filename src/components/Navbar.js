
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation"; // 1. Tumeongeza hii ili kusoma path ya sasa

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // 2. Tunachukua pathname ya sasa hapa

  // Tumeunda list ya nav links ili iwe rahisi kuzizungusha (loop) na ku-check active state
  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Contact Us", href: "/contact" },
  ];

  return (
    <header className="absolute top-0 left-0 z-50 w-full bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
        <a href="/" className="flex items-center" aria-label="SGR Petropower Engineering home">
          <img
            src="https://www.sgrpetropower.co.tz/images/pet.png"
            alt="SGR Petropower"
            className="h-12 w-auto object-contain sm:h-14"
          />
        </a>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-2 md:flex uppercase">
          {navLinks.map((link) => {
            // Tunachunguza kama ukurasa wa sasa ndio huo wa link
            const isActive = pathname === link.href;

            return (
              <a
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-[#ed1c24] text-white shadow-md shadow-orange-500/20" // Muonekano ikiwa active (round focus)
                    : "text-black hover:bg-orange-50 hover:text-orange-500" // Muonekano wa kawaida na wakati wa hover
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 hover:bg-gray-100 focus:outline-none text-black md:hidden"
          aria-label="Toggle menu"
        >
         
          <svg className="h-6 w-6 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t border-white/10 bg-black/95 px-6 py-5 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
                    isActive ? "bg-[#ed1c24] text-white shadow-md shadow-orange-500/20" : "text-black hover:bg-orange-50 hover:text-orange-400"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}