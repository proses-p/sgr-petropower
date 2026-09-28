/* eslint-disable @next/next/no-img-element -- Gallery URLs come from service/project media records and may use any configured storage host. */
"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function Gallery({ images, alt, compact = false }) {
    const galleryImages = Array.isArray(images) ? images : [];
    const [active, setActive] = useState(null);

    useEffect(() => {
        if (active === null || galleryImages.length === 0) return;

        function handleKey(event) {
            if (event.key === "Escape") setActive(null);
            if (event.key === "ArrowLeft") {
                setActive((current) => (current - 1 + galleryImages.length) % galleryImages.length);
            }
            if (event.key === "ArrowRight") {
                setActive((current) => (current + 1) % galleryImages.length);
            }
        }

        document.addEventListener("keydown", handleKey);

        return () => {
            document.removeEventListener("keydown", handleKey);
        };
    }, [active, galleryImages.length]);

    if (!galleryImages.length) return null;

    return (
        <>
            <div className="grid gap-5 md:grid-cols-12">

                {galleryImages.map((image, index) => {

                    const layouts = compact ? [
                        "md:col-span-6",
                        "md:col-span-6",
                    ] : [
                        "md:col-span-7",
                        "md:col-span-5 md:mt-20",
                        "md:col-span-5",
                        "md:col-span-7 md:-mt-20",
                    ];

                    return (
                        <button
                            key={image.id}
                            type="button"
                            onClick={() => setActive(index)}
                            className={`gallery-item group relative block w-full overflow-hidden text-left ${layouts[index % layouts.length]}`}
                        >
                            <div className="relative overflow-hidden bg-slate-100">

                                <img
                                    src={image.url}
                                    alt={image.alt || alt}
                                    className={`${compact ? "h-52 sm:h-64" : "h-75 sm:h-105"} w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none`}
                                />

                                <div className="absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/35" />

                                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-500 group-hover:opacity-100">
                                    <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/50 bg-white/10 text-2xl text-white backdrop-blur-sm transition duration-500 group-hover:scale-100 scale-75">
                                        ↗
                                    </span>
                                </div>

                                <div className="absolute bottom-5 left-5">
                                    <span className="text-xs font-bold tracking-[0.25em] text-white/0 transition duration-500 group-hover:text-white">
                                        0{index + 1}
                                    </span>
                                </div>

                            </div>
                        </button>
                    );
                })}
            </div>


            {active !== null && (
                <div
                    className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 p-4 lightbox"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Image gallery"
                    onClick={() => setActive(null)}
                >

                    <div className="absolute left-6 top-6 z-10 sm:left-10 sm:top-10">
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/40">
                            SGR Petropower
                        </p>

                        <p className="mt-2 text-sm font-semibold text-white">
                            {String(active + 1).padStart(2, "0")}{" "}
                            /{" "}
                            {String(images.length).padStart(2, "0")}
                        </p>
                    </div>


                    <button
                        type="button"
                        onClick={(event) => {
                            event.stopPropagation();
                            setActive(null);
                        }}
                        className="absolute right-5 top-5 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition hover:rotate-90 hover:bg-white hover:text-black sm:right-10 sm:top-10"
                        aria-label="Close gallery"
                    >
                        <X size={20} />
                    </button>


                    <button
                        type="button"
                        onClick={(event) => {
                            event.stopPropagation();
                            setActive((current) => (current - 1 + galleryImages.length) % galleryImages.length);
                        }}
                        className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition hover:-translate-x-1 hover:bg-white hover:text-black sm:left-10"
                        aria-label="Previous image"
                    >
                        <ChevronLeft size={22} />
                    </button>


                    <div
                        className="relative max-h-[88vh] max-w-[88vw] lightbox-image"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <img
                            src={galleryImages[active].url}
                            alt={galleryImages[active].alt || alt}
                            className="max-h-[82vh] max-w-[88vw] object-contain"
                        />

                        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent px-6 pb-5 pt-16">
                            <p className="text-sm font-semibold text-white">
                                {galleryImages[active].title || alt}
                            </p>
                        </div>
                    </div>


                    <button
                        type="button"
                        onClick={(event) => {
                            event.stopPropagation();
                            setActive((current) => (current + 1) % galleryImages.length);
                        }}
                        className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition hover:translate-x-1 hover:bg-white hover:text-black sm:right-10"
                        aria-label="Next image"
                    >
                        <ChevronRight size={22} />
                    </button>


                    {/* <style jsx>{`
                        .lightbox {
                            animation: lightboxIn 0.35s ease-out both;
                        }

                        .lightbox-image {
                            animation: imageIn 0.5s cubic-bezier(.16,1,.3,1) both;
                        }

                        .gallery-item {
                            animation: galleryReveal 0.8s cubic-bezier(.16,1,.3,1) both;
                        }

                        @keyframes lightboxIn {
                            from {
                                opacity: 0;
                            }
                            to {
                                opacity: 1;
                            }
                        }

                        @keyframes imageIn {
                            from {
                                opacity: 0;
                                transform: scale(.92);
                            }
                            to {
                                opacity: 1;
                                transform: scale(1);
                            }
                        }

                        @keyframes galleryReveal {
                            from {
                                opacity: 0;
                                transform: translateY(35px);
                            }
                            to {
                                opacity: 1;
                                transform: translateY(0);
                            }
                        }
                    `}</style> */}
                </div>
            )}
        </>
    );
}