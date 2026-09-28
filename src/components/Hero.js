"use client";

import { useEffect, useState } from "react";

// Original SGR Petropower reference-site assets; replace with approved local copies when available.
const heroImages = [
  {
    src: "https://www.sgrpetropower.co.tz/images/04.jpg",
    alt: "SGR Petropower industrial engineering facility",
  },
  {
    src: "https://www.sgrpetropower.co.tz/images/stelfa.jpg",
    alt: "SGR Petropower steel fabrication work",
  },
  {
    src: "https://www.sgrpetropower.co.tz/images/sld.jpg",
    alt: "SGR Petropower industrial construction environment",
  },
  {
    src: "https://www.sgrpetropower.co.tz/images/mobile1.jpg",
    alt: "SGR Petropower engineering project site",
  },
  {
    src: "https://www.sgrpetropower.co.tz/images/mobile2.jpg",
    alt: "SGR Petropower energy infrastructure",
  },
];

export default function Hero() {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const slideshow = window.setInterval(() => {
      setActiveImage((currentImage) => (currentImage + 1) % heroImages.length);
    }, 5000);

    return () => window.clearInterval(slideshow);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#2f2d2e]">
      <div className="absolute inset-0 h-full w-full">
        {heroImages.map((image, index) => (
          <img
            key={image.src}
            aria-hidden="true"
            alt=""
            className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ease-in-out ${
              activeImage === index ? "opacity-100" : "opacity-0"
            }`}
            src={image.src}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-black/42" />
      <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/42 to-black/10" />
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/10" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 py-32 lg:px-8">
        <div className="max-w-4xl">
          <div className="mb-6 flex items-center gap-3">
            
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-[#ed1c24]">
              SGR Petropower Engineering
            </span>
          </div>

          <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-8xl">
            Engineering
            <span className="block text-[#ed1c24]">Beyond Limits.</span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            Delivering innovative engineering, construction, petroleum,
            power and industrial solutions built around quality, safety
            and lasting performance.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href="/services"
              className="group rounded-full bg-[#ed1c24] px-7 py-4 font-semibold text-white transition-all duration-300 hover:bg-red-700 hover:shadow-xl hover:shadow-red-600/20"
            >
              Explore Our Services
              <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>

            <a
              href="/contact"
              className="rounded-full border border-white/30 px-7 py-4 font-semibold text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-slate-950"
            >
              Start a Project
            </a>
          </div>

          <div className="mt-16 grid max-w-2xl grid-cols-3 border-t border-white/15 pt-7">
            <div>
              <p className="text-3xl font-bold text-white">-</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">
                Years Experience
              </p>
            </div>

            <div className="border-l border-white/15 pl-5">
              <p className="text-3xl font-bold text-white">-</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">
                Projects
              </p>
            </div>

            <div className="border-l border-white/15 pl-5">
              <p className="text-3xl font-bold text-white">-</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">
                Support
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/50 md:flex">
        <span className="text-[10px] uppercase tracking-[0.3em]">
          Scroll to explore
        </span>
        <div className="h-10 w-px bg-linear-to-b from-[#ed1c24] to-transparent" />
      </div>
    </section>
  );
}
