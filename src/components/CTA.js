"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function CTA() {
    return (
        <>
            <section className="bg-white py-24 text-slate-950">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Main CTA */}
                <div className="mx-auto max-w-4xl text-center">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-orange-700">
                        <CheckCircle2 size={15} />
                        Engineering Excellence
                    </div>

                    <h2 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                        Building the infrastructure
                        <span className="block text-[#ed1c24]">
                            that powers tomorrow.
                        </span>
                    </h2>

                    <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                        From power generation and steel fabrication to petroleum
                        infrastructure, pipelines, storage and fire protection,
                        SGR Petropower Engineering Ltd delivers engineered
                        solutions built for performance, reliability and safety.
                    </p>

                    {/* CTA Buttons */}
                    <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <a
                            href="/contact"
                            className="group inline-flex items-center gap-3 rounded-xl bg-[#ed1c24] px-7 py-4 text-sm font-bold text-white shadow-xl shadow-orange-500/20 transition duration-300 hover:-translate-y-1 hover:bg-orange-600"
                        >
                            Start a Project

                            <ArrowRight
                                size={18}
                                className="transition-transform duration-300 group-hover:translate-x-1"
                            />
                        </a>

                        <Link
                            href="/services"
                            className="inline-flex items-center gap-3 rounded-xl border border-slate-300 bg-white px-7 py-4 text-sm font-bold text-slate-800 transition duration-300 hover:-translate-y-1 hover:border-orange-300 hover:bg-orange-50"
                        >
                            Explore Our Services
                        </Link>
                    </div>
                </div>
                </div>
            </section>

            <section className="bg-slate-950 text-white" aria-label="Company sectors and location">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-6 py-8 text-center sm:flex-row sm:text-left lg:px-8">
                    <p className="text-sm text-slate-400">
                        Engineering • Construction • Energy • Industrial Solutions
                    </p>

                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
                        <span className="h-2 w-2 rounded-full bg-orange-500" />
                        Tanzania
                    </div>
                </div>
            </section>
        </>
    );
}