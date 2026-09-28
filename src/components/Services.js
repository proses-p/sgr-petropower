import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { prisma } from "@/lib/prisma";

const serviceImageFallbacks = {
  "gas-turbines-and-power-station": "https://www.sgrpetropower.co.tz/images/gas-t3.jpg",
  "steel-fabrication-and-structures": "https://www.sgrpetropower.co.tz/images/steelfab2.jpg",
  "liquid-bulk-steel-storage-tanks": "https://www.sgrpetropower.co.tz/images/tank3.jpg",
  "pipeline-construction": "https://www.sgrpetropower.co.tz/images/pipe2.jpg",
  "fire-fighting-systems": "https://www.sgrpetropower.co.tz/images/fire.jpg",
  "oil-refineries": "https://www.sgrpetropower.co.tz/images/oil-refiner.jpg",
};

export default async function Services() {
  const services = await prisma.service.findMany({
    orderBy: { id: "asc" },
    take: 6,
    include: {
      media: {
        where: { location: "service" },
        orderBy: { sortOrder: "asc" },
        take: 1,
      },
    },
  });

  return (
    <section className="bg-[#f4f4f2] px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 border-b border-slate-300/80 pb-9 md:grid-cols-[0.8fr_1.2fr] md:items-end lg:pb-12">
          <div>
            <div className="flex items-center gap-3">
              
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#ed1c24]">
                Our capabilities
              </p>
            </div>
            <h2 className="mt-5 max-w-xl text-4xl font-semibold leading-[1.08] tracking-tight text-[#242426] sm:text-5xl lg:text-[3.5rem]">
              Engineering expertise that delivers.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-slate-600 md:justify-self-end lg:pb-1">
            Our engineering capabilities cover a range of industrial, petroleum,
            power and infrastructure projects.
          </p>
        </div>

        {services.length ? (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3 lg:gap-6">
            {services.map((service, index) => {
              const image = service.media?.[0];
              const imageUrl = image?.url || serviceImageFallbacks[service.slug];

              return (
                <Link
                  key={service.id}
                  href={`/services/${service.slug}`}
                  className="group relative isolate block aspect-[4/3] overflow-hidden border border-slate-300/70 bg-[#343434] transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-[#ed1c24]/70 hover:shadow-lg motion-reduce:transform-none motion-reduce:transition-none"
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={image?.alt || service.title}
                      className="absolute inset-0 z-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none"
                    />
                  ) : (
                    <div className="absolute inset-0 z-0 bg-[#414141]" />
                  )}
                  <div className="absolute inset-0 z-10 bg-linear-to-t from-black/85 via-black/15 to-black/5 transition-colors duration-300 group-hover:from-black/90 motion-reduce:transition-none" />

                  <div className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-4 p-5 sm:p-6 lg:p-7">
                    <div className="min-w-0">
                      <span className="mb-3 inline-flex border-l-2 border-[#ed1c24] pl-2.5 text-xs font-semibold tracking-[0.18em] text-white/90">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="max-w-md text-xl font-semibold leading-snug text-white sm:text-2xl">
                        {service.title}
                      </h3>
                    </div>
                    <span className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center border border-white/55 text-white transition duration-300 group-hover:translate-x-1 group-hover:border-[#ed1c24] group-hover:bg-[#ed1c24] motion-reduce:transition-none">
                      <ArrowUpRight size={19} strokeWidth={1.7} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="mt-10 border border-dashed border-slate-300 px-6 py-16 text-center text-slate-500">
            Services will appear here once they are published from the admin workspace.
          </div>
        )}
      </div>
    </section>
  );
}
