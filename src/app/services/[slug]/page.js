import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { prisma } from "@/lib/prisma";
import Gallery from "@/components/Gallery";
import { ArrowRight } from "lucide-react";

const serviceHeroImages = {
    "gas-turbines-power-stations": "https://www.sgrpetropower.co.tz/images/gas-t3.jpg",
    "steel-fabrication-structures": "https://www.sgrpetropower.co.tz/images/steelfab2.jpg",
    "sttel-fabrication-structures": "https://www.sgrpetropower.co.tz/images/steelfab2.jpg",
    "liquid-bulk-steel-storage-tanks": "https://www.sgrpetropower.co.tz/images/tank3.jpg",
    "pipeline-constructions": "https://www.sgrpetropower.co.tz/images/pipe2.jpg",
    "firefighting-systems": "https://www.sgrpetropower.co.tz/images/fire.jpg",
    "oil-refineries": "https://www.sgrpetropower.co.tz/images/oil-refiner.jpg",
};

export async function generateMetadata({ params }) {
    const service = await prisma.service.findUnique({
        where: { slug: (await params).slug },
        select: { title: true, description: true },
    });

    return {
        title: service?.title || "Service",
        description: service?.description || "SGR Petropower Engineering service.",
    };
}

export default async function ServiceDetailPage({ params }) {
    const service = await prisma.service.findUnique({
        where: { slug: (await params).slug },
        include: {
            media: {
                where: { location: "service" },
                orderBy: { sortOrder: "asc" },
            },
        },
    });

    if (!service) notFound();

    const heroImage = service.media?.[0];
    const heroImageUrl = heroImage?.url || serviceHeroImages[service.slug] || "https://www.sgrpetropower.co.tz/images/04.jpg";

    return (
        <main className="overflow-hidden bg-white text-[#242426]">
            <section className="relative h-80 overflow-hidden bg-[#2f2d2e] sm:h-85 lg:h-92.5">
                <Navbar />
                <img
                    src={heroImageUrl}
                    alt={heroImage?.alt || service.title}
                    className="absolute inset-0 h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/45" />
                <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/35 to-black/10" />
                <div className="relative mx-auto flex h-full max-w-7xl items-end px-6 pb-8 pt-24 lg:px-8">
                    <div className="w-full text-white">
                        <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-2 text-xs text-white/75 sm:text-sm">
                            <Link href="/" className="transition hover:text-white">Home</Link>
                            <span aria-hidden="true">/</span>
                            <Link href="/services" className="transition hover:text-white">Services</Link>
                            <span aria-hidden="true">/</span>
                            <span className="max-w-[55vw] truncate text-white">{service.title}</span>
                        </nav>
                        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
                            <span className="text-[#ff6b70]">{String(service.id).padStart(2, "0")}</span>
                            <span className="h-px w-8 bg-white/40" />
                            <span>SGR Petropower Engineering</span>
                        </div>
                        <h1 className="mt-4 max-w-4xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                            {service.title}
                        </h1>
                    </div>
                </div>
            </section>

            <section className="px-6 py-12 sm:py-14 lg:px-8 lg:py-16">
                <div className="mx-auto grid max-w-7xl gap-7 border-b border-slate-200 pb-12 md:grid-cols-[0.72fr_1.28fr] md:gap-12">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ed1c24]">Service Overview</p>
                        <h2 className="mt-3 max-w-sm text-2xl font-semibold leading-snug text-[#242426] sm:text-3xl">
                            Engineering solutions for industry.
                        </h2>
                    </div>
                    <p className="whitespace-pre-line text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                        {service.description}
                    </p>
                </div>
            </section>

            {service.media.length > 0 && (
                <section className="bg-slate-50 px-6 py-12 sm:py-14 lg:px-8 lg:py-16">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-7 flex items-end justify-between gap-4 border-b border-slate-200 pb-5">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ed1c24]">Visual Story</p>
                                <h2 className="mt-2 text-2xl font-semibold text-[#242426] sm:text-3xl">Project imagery</h2>
                            </div>
                            <span className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">{service.media.length} images</span>
                        </div>
                        <Gallery images={service.media} alt={service.title} compact />
                    </div>
                </section>
            )}

            <section className="px-6 py-12 sm:py-14 lg:px-8 lg:py-16">
                <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 border-t border-slate-200 pt-8 sm:flex-row sm:items-center">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ed1c24]">Discuss your requirements</p>
                        <h2 className="mt-2 text-2xl font-semibold text-[#242426]">Planning an industrial project?</h2>
                    </div>
                    <Link
                        href="/contact"
                        className="group inline-flex w-fit items-center gap-3 bg-[#ed1c24] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 motion-reduce:transition-none"
                    >
                        Start an inquiry
                        <ArrowRight size={17} className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden="true" />
                    </Link>
                </div>
            </section>
        </main>
    );
}
