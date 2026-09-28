import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutPreview() {
  return (
    <section className="overflow-hidden bg-white px-6 py-20 sm:py-24 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12 lg:items-center lg:gap-10">
        <div className="relative min-h-97.5 sm:min-h-117.5 lg:col-span-7 lg:min-h-132.5">
          <div className="absolute inset-y-0 right-0 w-[84%] overflow-hidden bg-slate-200 sm:w-[80%]">
            <img
              src="https://www.sgrpetropower.co.tz/images/about.jpg"
              alt="SGR Petropower engineering and construction work"
              className="h-full w-full object-cover object-center"
            />
          </div>

          <div className="absolute bottom-5 left-0 h-[44%] w-[43%] overflow-hidden border-[6px] border-white shadow-xl sm:bottom-8 sm:h-[48%] sm:w-[42%]">
            <img
              src="https://www.sgrpetropower.co.tz/images/steelfab2.jpg"
              alt="Steel fabrication and structures"
              className="h-full w-full object-cover object-center"
            />
          </div>

          <div className="absolute left-0 top-5 border-l-2 border-[#ed1c24] bg-white/95 px-4 py-3 shadow-sm sm:top-8 sm:px-5 sm:py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#ed1c24]">
              SGR Petropower Engineering Ltd
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Engineering and construction
            </p>
          </div>
        </div>

        <div className="lg:col-span-5 lg:pl-4">
          <div className="flex items-center gap-3">
            
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#ed1c24]">
              Who we are
            </p>
          </div>

          <h2 className="mt-5 max-w-xl text-4xl font-semibold leading-[1.08] tracking-tight text-[#242426] sm:text-5xl">
            Engineering expertise that delivers.
          </h2>

          <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            SGR Petropower Engineering Ltd is an engineering and construction
            company providing professional solutions across petroleum, power,
            construction and industrial sectors.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-slate-200 py-5 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {["Petroleum", "Power", "Construction", "Industrial"].map((capability, index) => (
              <div key={capability} className="flex items-center gap-2.5">
                <span className="text-[11px] font-semibold tracking-[0.12em] text-[#ed1c24]">
                  0{index + 1}
                </span>
                <span className="text-sm font-medium text-slate-700">
                  {capability}
                </span>
              </div>
            ))}
          </div>

          <Link
            href="/about"
            className="group mt-8 inline-flex items-center gap-3 border-b border-slate-300 pb-2 text-sm font-semibold text-[#242426] transition-colors hover:border-[#ed1c24] hover:text-[#ed1c24] motion-reduce:transition-none"
          >
            Discover our company
            <ArrowRight
              size={17}
              strokeWidth={1.8}
              className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
