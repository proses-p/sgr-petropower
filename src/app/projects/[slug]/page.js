import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";
import { ArrowRight, BriefcaseBusiness, Building2, CheckCircle2, ChevronLeft, ChevronRight, MapPin, ShieldCheck, Wrench } from "lucide-react";
import { prisma } from "@/lib/prisma";

function inferProjectCategory(project) {
    const source = `${project.title} ${project.description} ${project.slug} ${project.location || ""} ${project.client || ""}`.toLowerCase();

    if (/gas|pipeline|oil|petroleum|energy/.test(source)) return "Energy & Pipeline Infrastructure";
    if (/power|electrical|substation|transformer|distribution|transmission/.test(source)) return "Power Infrastructure";
    if (/facility|plant|industrial|process|mechanical/.test(source)) return "Industrial Engineering";
    if (/construction|infrastructure|engineering/.test(source)) return "Engineering & Construction";
    return "Infrastructure Development";
}

function inferProjectType(project) {
    const source = `${project.title} ${project.description} ${project.slug}`.toLowerCase();

    if (/gas|pipeline/.test(source)) return "Pipeline Construction";
    if (/power|electrical|substation|transformer|grid/.test(source)) return "Power Infrastructure";
    if (/installation|facility|plant|mechanical/.test(source)) return "Industrial Installation";
    if (/engineering|consultancy/.test(source)) return "Engineering Consultancy";
    return "Project Delivery";
}

function buildProjectScope(project) {
    const source = `${project.title} ${project.description} ${project.slug}`.toLowerCase();

    if (/gas|pipeline/.test(source)) {
        return ["Engineering Design", "Pipeline Installation", "Site Planning", "Testing & Commissioning", "Quality Assurance", "Project Coordination"];
    }

    if (/power|electrical|substation|transformer|grid/.test(source)) {
        return ["Electrical Design", "Power Distribution", "Equipment Installation", "Protection & Control", "Testing & Commissioning", "Maintenance Support"];
    }

    if (/facility|plant|industrial|mechanical/.test(source)) {
        return ["Engineering Design", "Mechanical Installation", "Fabrication Support", "Project Management", "Inspection & QA", "Commissioning"];
    }

    return ["Engineering Design", "Project Management", "Installation Works", "Testing & Commissioning", "Technical Consultancy"]; 
}

function buildProjectResults(project) {
    const source = `${project.title} ${project.description} ${project.slug}`.toLowerCase();

    if (/gas|pipeline/.test(source)) {
        return [
            "Improved reliability of critical energy transfer infrastructure",
            "Safe and efficient pipeline delivery for operational continuity",
            "Successful execution with disciplined quality and commissioning controls",
            "Enhanced confidence in long-term infrastructure performance",
        ];
    }

    if (/power|electrical|substation|transformer|grid/.test(source)) {
        return [
            "Improved electrical system performance and resilience",
            "Efficient power delivery to critical operational loads",
            "Improved safety through robust installation and testing",
            "Stronger infrastructure readiness for sustained operations",
        ];
    }

    return [
        "Improved operational reliability",
        "Stronger infrastructure performance",
        "Efficient execution within project requirements",
        "Safer and more dependable delivery outcomes",
    ];
}

function buildProjectChallenge(project) {
    const category = inferProjectCategory(project);
    const projectType = inferProjectType(project);
    const location = project.location || "the project site";

    return `This ${category.toLowerCase()} initiative at ${location} required SGR Petropower to align complex engineering requirements, operational constraints and delivery timelines within a demanding project environment. The challenge was to deliver ${projectType.toLowerCase()} solutions that improved system reliability while maintaining a high standard of safety, quality and project control.`;
}

function buildProjectApproach(project) {
    const category = inferProjectCategory(project);
    const projectType = inferProjectType(project);

    return `For this ${category.toLowerCase()} assignment, SGR Petropower adopted a disciplined project model built around planning, engineering accuracy, proactive site coordination and commissioning oversight. From concept review to final handover, the team worked to translate technical requirements into practical execution, integrating design, installation and testing activities to protect quality and reduce operational disruption.`;
}

function buildProjectOverview(project) {
    const title = project.title;
    const category = inferProjectCategory(project);
    const location = project.location || "site location";
    const client = project.client || "the client";

    return `${title} reflects SGR Petropower Engineering Ltd’s role in delivering ${category.toLowerCase()} works at ${location}. The project required careful coordination between technical design, installation execution and operational performance objectives, while responding to the practical needs of ${client}. Through disciplined engineering and field supervision, the team delivered a complete solution aligned with site conditions, operational requirements and long-term reliability expectations.`;
}

function formatDate(value) {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric" }).format(date);
}

export async function generateMetadata({ params }) {
    const slug = (await params).slug;
    const project = await prisma.project.findUnique({
        where: { slug },
        select: { title: true, description: true, location: true, client: true, media: { orderBy: { sortOrder: "asc" }, take: 1, select: { url: true } } },
    });

    const title = project?.title || "Project";
    const description = project?.description || "SGR Petropower Engineering project case study.";
    const ogImage = project?.media?.[0]?.url || null;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "article",
            ...(ogImage ? { images: [ogImage] } : {}),
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            ...(ogImage ? { images: [ogImage] } : {}),
        },
    };
}

export default async function ProjectDetailPage({ params }) {
    const slug = (await params).slug;
    const [project, allProjects] = await Promise.all([
        prisma.project.findUnique({
            where: { slug },
            include: {
                media: { orderBy: { sortOrder: "asc" } },
            },
        }),
        prisma.project.findMany({
            orderBy: { id: "asc" },
            include: { media: { orderBy: { sortOrder: "asc" }, take: 1 } },
        }),
    ]);

    if (!project) notFound();

    const heroImage = project.media?.[0] || null;
    const projectCategory = inferProjectCategory(project);
    const projectType = inferProjectType(project);
    const scopeItems = buildProjectScope(project);
    const results = buildProjectResults(project);
    const currentIndex = allProjects.findIndex((item) => item.id === project.id);
    const previousProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
    const nextProject = currentIndex >= 0 && currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

    const facts = [
        { label: "Project Name", value: project.title },
        { label: "Project Category", value: projectCategory },
        { label: "Client", value: project.client || null },
        { label: "Location", value: project.location || null },
        { label: "Project Type", value: projectType },
        { label: "Project Status", value: project.status || null },
        { label: "Completion Date", value: formatDate(project.completionDate) || (project.completionYear ? String(project.completionYear) : null) },
    ].filter((item) => item.value && String(item.value).trim() !== "");

    return (
        <main className="overflow-hidden bg-slate-100 text-slate-800">
            <section className="relative h-[25rem] overflow-hidden bg-slate-950 sm:h-[30rem] lg:h-[34rem]">
                <Navbar />
                {heroImage ? (
                    <>
                        <img src={heroImage.url} alt={heroImage.alt || project.title} className="absolute inset-0 h-full w-full object-cover object-center" />
                        <div className="absolute inset-0 bg-black/55" />
                    </>
                ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.24),transparent_32%),linear-gradient(135deg,#0f172a,#1e293b_35%,#111827)]" />
                )}
                <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/40 to-black/15" />
                <div className="relative mx-auto flex h-full max-w-7xl items-end px-6 pb-8 pt-24 lg:px-8">
                    <div className="w-full text-white">
                        <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-2 text-xs text-white/75 sm:text-sm">
                            <Link href="/" className="transition hover:text-white">Home</Link>
                            <span aria-hidden="true">/</span>
                            <Link href="/projects" className="transition hover:text-white">Projects</Link>
                            <span aria-hidden="true">/</span>
                            <span className="max-w-[55vw] truncate text-white">{project.title}</span>
                        </nav>
                        <div className="flex flex-wrap items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.23em] text-orange-300">
                            <span>{projectCategory}</span>
                            {project.status ? <><span className="h-px w-8 bg-white/35" /><span>{project.status}</span></> : null}
                        </div>
                        <h1 className="mt-4 max-w-4xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">{project.title}</h1>
                    </div>
                </div>
            </section>

            <section className="px-6 py-12 sm:py-14 lg:px-8 lg:py-16">
                <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {facts.map((item) => (
                            <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500">{item.label}</p>
                                <p className="mt-3 text-base font-semibold text-slate-900">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-6 pb-8 lg:px-8">
                <div className="mx-auto max-w-7xl rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8 lg:p-10">
                    <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-10">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">Project Overview</p>
                            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Engineering in action.</h2>
                        </div>
                        <div className="space-y-5 text-base leading-8 text-slate-600 sm:text-lg">
                            <p>{buildProjectOverview(project)}</p>
                            <p>{buildProjectChallenge(project)}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="px-6 py-12 sm:py-14 lg:px-8 lg:py-16">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-7 flex items-end justify-between gap-4 border-b border-slate-200 pb-5">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">Scope</p>
                            <h2 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">Project scope</h2>
                        </div>
                        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                            {scopeItems.length} key activities
                        </span>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {scopeItems.map((item, index) => (
                            <div key={item} className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg" style={{ animationDelay: `${index * 60}ms` }}>
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                                    {index % 2 === 0 ? <Wrench size={18} /> : <Building2 size={18} />}
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900">{item}</h3>
                                <p className="mt-3 text-sm leading-6 text-slate-600">
                                    {item === "Engineering Design" && "Technical design and coordination aligned to site requirements and long-term asset performance."}
                                    {item === "Pipeline Installation" && "Installation work coordinated to support reliable energy transfer and site safety."}
                                    {item === "Electrical Design" && "Electrical system planning developed to support safe and efficient power delivery."}
                                    {item === "Equipment Installation" && "Installation activity focused on robust fit, quality control and operational dependability."}
                                    {item === "Project Management" && "Structured coordination of resources, schedules, quality and stakeholder communication."}
                                    {item === "Testing & Commissioning" && "System verification and integrity checks to confirm safe and effective operation."}
                                    {!['Engineering Design','Pipeline Installation','Electrical Design','Equipment Installation','Project Management','Testing & Commissioning'].includes(item) && "Delivery activity aligned with technical requirements, operations and project quality expectations."}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {project.media.length > 0 && (
                <section className="bg-slate-50 px-6 py-12 sm:py-14 lg:px-8 lg:py-16">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-7 flex items-end justify-between gap-4 border-b border-slate-200 pb-5">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">Gallery</p>
                                <h2 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">Project imagery</h2>
                            </div>
                            <span className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">{project.media.length} images</span>
                        </div>
                        <Gallery images={project.media} alt={project.title} />
                    </div>
                </section>
            )}

            <section className="px-6 py-12 sm:py-14 lg:px-8 lg:py-16">
                <div className="mx-auto max-w-7xl rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8 lg:p-10">
                    <div className="mb-8 max-w-2xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">Project Challenge</p>
                        <h2 className="mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">Delivering value under real project constraints.</h2>
                    </div>
                    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                            <p className="text-base leading-8 text-slate-700">{buildProjectChallenge(project)}</p>
                        </div>
                        <div className="rounded-3xl border border-orange-100 bg-orange-50 p-6">
                            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">Business impact</p>
                            <ul className="mt-5 space-y-4 text-sm leading-7 text-slate-700">
                                {results.map((result) => (
                                    <li key={result} className="flex gap-3">
                                        <CheckCircle2 size={18} className="mt-1 shrink-0 text-orange-500" />
                                        <span>{result}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-slate-900 px-6 py-12 text-white sm:py-14 lg:px-8 lg:py-16">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8 max-w-2xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">Our Approach</p>
                        <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">From planning to completion.</h2>
                    </div>
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
                        {[
                            { title: "Challenge", text: "Define the project constraints, safety priorities and technical requirements." },
                            { title: "Planning", text: "Develop practical execution planning to align scope, time and site conditions." },
                            { title: "Engineering", text: "Deliver technical design and coordination to support buildability and reliability." },
                            { title: "Installation", text: "Execute work with quality controls, supervision and operational discipline." },
                            { title: "Testing & Completion", text: "Verify performance and hand over an asset ready for long-term service." },
                        ].map((step, index) => (
                            <div key={step.title} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/15 text-sm font-bold text-orange-300">0{index + 1}</div>
                                <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                                <p className="mt-3 text-sm leading-7 text-slate-300">{step.text}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
                        <p className="text-base leading-8 text-slate-200">{buildProjectApproach(project)}</p>
                    </div>
                </div>
            </section>

            <section className="px-6 py-12 sm:py-14 lg:px-8 lg:py-16">
                <div className="mx-auto max-w-7xl rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8 lg:p-10">
                    <div className="mb-8 max-w-2xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">Key outcomes</p>
                        <h2 className="mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">Results delivered.</h2>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        {results.map((result, index) => (
                            <div key={result} className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">{index + 1}</div>
                                <p className="text-base leading-7 text-slate-700">{result}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-6 pb-12 sm:pb-14 lg:px-8 lg:pb-20">
                <div className="mx-auto max-w-7xl rounded-[2rem] bg-[#0b1118] px-6 py-10 text-white sm:px-8 lg:px-10 lg:py-14">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="max-w-2xl">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">Need a similar solution?</p>
                            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">Have a project in mind?</h2>
                            <p className="mt-4 text-base leading-7 text-slate-300">
                                Let’s discuss how SGR Petropower Engineering Ltd can support your next industrial, power or infrastructure project.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600">
                                Contact Us
                                <ArrowRight size={16} />
                            </Link>
                            <Link href="/contact" className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/25 hover:bg-white/10">
                                Request a Quote
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="px-6 pb-16 lg:px-8 lg:pb-20">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8 flex items-end justify-between gap-4 border-b border-slate-200 pb-5">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">Portfolio</p>
                            <h2 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">Explore our projects</h2>
                        </div>
                        <Link href="/projects" className="text-sm font-semibold text-slate-700 transition hover:text-orange-500">View all projects</Link>
                    </div>

                    {allProjects.length > 1 ? (
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {allProjects
                                .filter((item) => item.id !== project.id)
                                .slice(0, 3)
                                .map((item) => (
                                    <Link href={`/projects/${item.slug}`} key={item.id} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                                        {item.media?.[0] ? (
                                            <div className="relative">
                                                <img src={item.media[0].url} alt={item.media[0].alt || item.title} className="h-60 w-full object-cover transition duration-500 group-hover:scale-105" />
                                                <div className="absolute inset-0 bg-linear-to-t from-black/55 to-transparent" />
                                            </div>
                                        ) : (
                                            <div className="h-60 bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.22),transparent_28%),linear-gradient(135deg,#e2e8f0,#cbd5e1_60%,#94a3b8)]" />
                                        )}
                                        <div className="p-6">
                                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500">{item.status || "Project"}</p>
                                            <h3 className="mt-3 text-xl font-semibold text-slate-900">{item.title}</h3>
                                            <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                                        </div>
                                    </Link>
                                ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-slate-500">
                            More project case studies will be published here as the portfolio grows.
                        </div>
                    )}
                </div>
            </section>

            <section className="px-6 pb-20 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col gap-5 border-t border-slate-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            {previousProject ? (
                                <Link href={`/projects/${previousProject.slug}`} className="group inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-orange-200 hover:text-orange-600">
                                    <ChevronLeft size={16} />
                                    Previous project
                                </Link>
                            ) : (
                                <span className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-400">
                                    <ChevronLeft size={16} />
                                    Previous project
                                </span>
                            )}
                        </div>
                        <Link href="/projects" className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-600 transition hover:text-orange-500">All Projects</Link>
                        <div className="flex items-center gap-3">
                            {nextProject ? (
                                <Link href={`/projects/${nextProject.slug}`} className="group inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-orange-200 hover:text-orange-600">
                                    Next project
                                    <ChevronRight size={16} />
                                </Link>
                            ) : (
                                <span className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-400">
                                    Next project
                                    <ChevronRight size={16} />
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <Footer showClientLogos={false} />
        </main>
    );
}
