/* eslint-disable @next/next/no-img-element -- Service artwork can be supplied as arbitrary admin-managed URLs. */
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { prisma } from "@/lib/prisma";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export const metadata = {
    title: "Services",
    description: "Explore SGR Petropower Engineering services across energy, petroleum and industrial infrastructure.",
};

const serviceImages = [
    "https://www.sgrpetropower.co.tz/images/gas-t3.jpg",
    "https://www.sgrpetropower.co.tz/images/steelfab2.jpg",
    "https://www.sgrpetropower.co.tz/images/tank3.jpg",
    "https://www.sgrpetropower.co.tz/images/pipe2.jpg",
    "https://www.sgrpetropower.co.tz/images/fire.jpg",
    "https://www.sgrpetropower.co.tz/images/oil-refiner.jpg",
];

export default async function ServicesPage() {
    const services = await prisma.service.findMany({ orderBy: { id: "asc" }, include: { media: { orderBy: { sortOrder: "asc" }, take: 1 } } });
    return (
        <main className="min-h-screen overflow-hidden bg-white text-[#242426]">
            <section className="relative h-87.5 overflow-hidden bg-[#2f2d2e] sm:h-105 lg:h-117.5">
                <Navbar />
                <img
                    src="https://www.sgrpetropower.co.tz/images/04.jpg"
                    alt="Industrial engineering and energy infrastructure"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/45" />
                <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/35 to-black/10" />
                <div className="relative mx-auto flex h-full max-w-7xl items-end px-6 pb-10 pt-28 sm:pb-14 lg:px-8">
                    <div className="max-w-3xl text-white">
                        <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-sm text-white/75">
                            <Link href="/" className="transition hover:text-white">Home</Link>
                            <span aria-hidden="true">/</span>
                            <span className="text-white">Services</span>
                        </nav>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#ff6b70]">Our Services</p>
                        <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                            Engineering Solutions Built for Industry
                        </h1>
                        <p className="mt-4 max-w-2xl text-sm leading-6 text-white/80 sm:text-base sm:leading-7">
                            Explore SGR Petropower Engineering capabilities across power, petroleum, construction and industrial sectors.
                        </p>
                    </div>
                </div>
            </section>

            <section className="px-6 py-14 sm:py-16 lg:px-8 lg:py-20">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8 flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#ed1c24]">Our Capabilities</p>
                            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#242426] sm:text-4xl">Built around essential industries.</h2>
                        </div>
                        <p className="max-w-md text-sm leading-6 text-slate-500">
                            Engineering and construction services for demanding energy and industrial environments.
                        </p>
                    </div>

                    {services.length ? (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {services.map((service, index) => {
                                const image = service.media?.[0];
                                const imageUrl = image?.url || serviceImages[index % serviceImages.length];

                                return (
                                    <Link
                                        href={`/services/${service.slug}`}
                                        key={service.id}
                                        style={{ "--card-index": index }}
                                        className="service-card-reveal group overflow-hidden border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md motion-reduce:transform-none motion-reduce:transition-none"
                                    >
                                        <div className="relative h-44 overflow-hidden bg-slate-100 sm:h-48">
                                            <img
                                                src={imageUrl}
                                                alt={image?.alt || service.title}
                                                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                                            />
                                            <div className="absolute inset-0 bg-linear-to-t from-black/65 via-transparent to-black/5 opacity-75 transition-opacity duration-300 group-hover:opacity-100" />
                                            <span className="absolute left-4 top-4 text-xs font-semibold tracking-[0.16em] text-white drop-shadow">
                                                {String(index + 1).padStart(2, "0")}
                                            </span>
                                            <ArrowUpRight className="absolute bottom-4 right-4 text-white transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 motion-reduce:transition-none" size={20} aria-hidden="true" />
                                        </div>
                                        <div className="flex min-h-28 items-center justify-between gap-4 px-5 py-4">
                                            <div>
                                                <h3 className="text-lg font-semibold leading-snug text-[#242426] transition-colors group-hover:text-[#ed1c24]">
                                                    {service.title}
                                                </h3>
                                                <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                                                    View service <ArrowRight size={13} aria-hidden="true" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="border border-dashed border-slate-300 px-6 py-16 text-center text-slate-500">
                            Services will appear here once they are published from the admin workspace.
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}