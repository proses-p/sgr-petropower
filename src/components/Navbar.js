"use client";

import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

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

        <div className="hidden items-center gap-8 md:flex uppercase">
          <a href="/" className="rounded-full text-sm font-bold text-black transition hover:text-orange-500">
            Home
          </a>
          
          <a href="/services" className="rounded-full text-sm font-bold text-black transition hover:text-orange-500">
            Services
          </a>

          <a href="/about" className="rounded-full text-sm font-bold text-black transition hover:text-orange-500">
            About
          </a>
          
          <a href="/projects" className="rounded-full text-sm font-bold text-black transition hover:text-orange-500">
            Projects
          </a>
          <a
            href="/contact"
            className="rounded-full px-5 py-2.5 text-sm font-bold text-black transition hover:bg-orange-600"
          >
            Contact Us
          </a>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white md:hidden"
          aria-label="Toggle menu"
        >
          <span className="text-2xl">☰</span>
        </button>
      </nav>

      {isOpen && (
        <div className="border-t border-white/10 bg-black/95 px-6 py-5 md:hidden">
          <div className="flex flex-col gap-5">
            <a href="/" className="text-white">Home</a>
            <a href="/about" className="text-white">About</a>
            <a href="/services" className="text-white">Services</a>
            <a href="/projects" className="text-white">Projects</a>
            <a href="/contact" className="text-white">Contact Us</a>
          </div>
        </div>
      )}
    </header>
  );
}