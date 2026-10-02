import Navbar from "@/components/Navbar";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { ArrowRight, Check, CircleUserRound, Download, FileText, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata = {
    title: "About",
    description: "Learn about SGR Petropower Engineering and the principles behind our work.",
};

const fallbackImages = {
    hero: "https://www.sgrpetropower.co.tz/images/tank3.jpg",
    company: "https://www.sgrpetropower.co.tz/images/about.jpg",
    detail: "https://www.sgrpetropower.co.tz/images/steelfab2.jpg",
};

const capabilities = ["Petroleum", "Power", "Construction", "Industrial"];

async function loadSection(name, query, fallback) {
    try {
        return await query();
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error(`[about] Unable to load ${name}`, error);
        }
        return fallback;
    }
}

function cleanText(value) {
    if (typeof value !== "string" && typeof value !== "number") return null;
    const text = String(value).trim();
    return text && !/^(undefined|null|nan)$/i.test(text) ? text : null;
}

function externalUrl(value) {
    const text = cleanText(value);
    if (!text) return null;
    try {
        const url = new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`);
        return url.protocol === "http:" || url.protocol === "https:" ? url.href : null;
    } catch {
        return null;
    }
}

export default async function AboutPage() {
    const [profile, media, values, stats, credentials, leadership, documents] = await Promise.all([
        loadSection("company profile", () => prisma.companyProfile.findUnique({ where: { id: 1 } }), null),
        loadSection("About media", () => prisma.media.findMany({ where: { location: "about" }, orderBy: { sortOrder: "asc" }, take: 3 }), []),
        loadSection("company values", () => prisma.companyValue.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }), []),
        loadSection("company statistics", () => prisma.companyStat.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }), []),
        loadSection("certifications", () => prisma.certification.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }), []),
        loadSection("leadership", () => prisma.leadership.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }), []),
        loadSection("corporate documents", () => prisma.corporateDocument.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }), []),
    ]);
    const images = {
        hero: media[0]?.url || fallbackImages.hero,
        company: media[1]?.url || fallbackImages.company,
        detail: media[2]?.url || fallbackImages.detail,
    };

    return (
        <main className="min-h-screen bg-white text-slate-950">
            <section className="relative isolate min-h-85 overflow-hidden bg-[#0b1722] sm:min-h-105 lg:min-h-120">
                <img src={images.hero} alt="Industrial storage tanks and engineering infrastructure" className="absolute inset-0 -z-20 h-full w-full object-cover" />
                <div className="absolute inset-0 -z-10 bg-[#07131f]/75" />
                <Navbar />
                <div className="mx-auto flex min-h-85 max-w-7xl items-end px-6 pb-12 pt-32 sm:min-h-105 sm:pb-16 lg:min-h-120 lg:px-8">
                    <div className="max-w-3xl animate-[serviceRevealUp_.8s_cubic-bezier(.16,1,.3,1)_both]">
                        <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#ed1c24]">About {cleanText(profile?.companyName) || "our company"}</p>
                        <p className="mt-6 text-sm text-slate-300">Home 
                            <span className="px-2 text-[#ed1c24]">/</span> About</p>
                        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">About Us</h1>
                    </div>
                </div>
            </section>

            <section className="px-6 py-20 sm:py-28 lg:px-8">
                <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
                    <div className="relative min-h-105 sm:min-h-120">
                        <div className="absolute inset-y-0 right-0 w-[84%] overflow-hidden bg-slate-100">
                            <img src={images.detail} alt="Steel fabrication and structures" className="aspect-4/5 h-full w-full object-cover" />
                            
                        </div>
                        
                        <div className="absolute left-0 top-7 border-l-2 border-[#ed1c24] bg-white px-4 py-3 shadow-sm sm:px-5">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#ed1c24]">Who we are</p>
                            <p className="mt-1 text-sm text-slate-600">Engineering and construction</p>
                        </div>
                    </div>
                    <div>
                        <SectionLabel>Our company</SectionLabel>
                        <h2 className="mt-5 max-w-2xl text-4xl font-semibold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl">Engineering expertise that delivers.</h2>
                        <p className="mt-7 whitespace-pre-wrap text-base leading-8 text-slate-600 sm:text-lg">{profile?.about || "Our company profile is being prepared. Please contact our team to learn more about SGR Petropower Engineering."}</p>
                        <div className="mt-9 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-slate-200 py-5 sm:grid-cols-4">
                            {capabilities.map((capability, index) => <div key={capability} className="flex items-center gap-2.5"><span className="text-xs font-semibold tracking-[0.12em] text-[#ed1c24]">0{index + 1}</span><span className="text-sm font-medium text-slate-700">{capability}</span></div>)}
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-y border-slate-200 bg-[#f5f6f4] px-6 py-20 sm:py-24 lg:px-8" aria-labelledby="mission-vision-title">
                <div className="mx-auto max-w-7xl">
                    <SectionLabel>Direction</SectionLabel>
                    <div className="mt-5 grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
                        <h2 id="mission-vision-title" className="max-w-md text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Purpose that guides the work.</h2>
                        <p className="max-w-xl text-base leading-7 text-slate-600 lg:justify-self-end">Our mission and vision are the principles behind the way SGR Petropower approaches complex engineering and industrial requirements.</p>
                    </div>
                    <div className="mt-12 grid gap-5 md:grid-cols-2">
                        <Statement label="Mission" value={profile?.mission} />
                        <Statement label="Vision" value={profile?.vision} />
                    </div>
                </div>
            </section>

            <section className="px-6 py-20 sm:py-24 lg:px-8" aria-labelledby="values-title">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col justify-between gap-5 border-b border-slate-200 pb-8 sm:flex-row sm:items-end">
                        <div><SectionLabel>What drives us</SectionLabel><h2 id="values-title" className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">The standards we bring to every brief.</h2></div>
                        <p className="max-w-sm text-sm leading-6 text-slate-500">The principles behind our work.</p>
                    </div>
                    <div className="mt-8 grid border-l border-t border-slate-200 sm:grid-cols-2 lg:grid-cols-4">
                        {values.filter((value) => cleanText(value.title) && cleanText(value.description)).map((value, index) => <article key={value.id} className="border-b border-r border-slate-200 p-6 transition-colors hover:bg-orange-50 sm:p-7"><span className="text-sm font-semibold text-[#ed1c24]">{String(index + 1).padStart(2, "0")}</span><h3 className="mt-14 text-xl font-semibold">{cleanText(value.title)}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{cleanText(value.description)}</p></article>)}
                    </div>
                </div>
            </section>

            {stats.some((stat) => cleanText(stat.value) && cleanText(stat.label)) && <section className="bg-[#0b1722] px-6 py-16 text-white sm:py-20 lg:px-8" aria-label="Company credibility indicators">
                <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.filter((stat) => cleanText(stat.value) && cleanText(stat.label)).map((stat) => <div key={stat.id} className=" pl-5"><p className="text-3xl font-semibold text-[#ed1c24]">{cleanText(stat.value)}</p><p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">{cleanText(stat.label)}</p></div>)}
                </div>
            </section>}

            {credentials.some((credential) => cleanText(credential.title)) && <section className="px-6 py-20 sm:py-24 lg:px-8" aria-labelledby="credentials-title">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end"><div><SectionLabel>Registered to deliver</SectionLabel><h2 id="credentials-title" className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">Licences &amp; certifications.</h2></div></div>
                    <div className="mt-12 grid gap-4 md:grid-cols-3">{credentials.filter((credential) => cleanText(credential.title)).map((credential) => {
                        const documentHref = externalUrl(credential.documentUrl);
                        const issuer = cleanText(credential.issuingOrganization) || cleanText(credential.issuingOrganisation);
                        return <article key={credential.id} className="border border-slate-200 p-6 transition-shadow hover:shadow-lg"><div className="flex h-12 w-12 items-center justify-center border border-orange-200 bg-orange-50 text-[#ed1c24]"><ShieldCheck size={21} /></div><p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-[#ed1c24]">{cleanText(credential.type)}</p><h3 className="mt-2 text-lg font-semibold">{cleanText(credential.title)}</h3>{issuer && <p className="mt-2 text-sm leading-6 text-slate-600">{issuer}</p>}{cleanText(credential.description) && <p className="mt-3 text-sm leading-6 text-slate-600">{cleanText(credential.description)}</p>}{cleanText(credential.year) && <p className="mt-5 border-t border-slate-100 pt-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{cleanText(credential.year)}</p>}{documentHref && <a href={documentHref} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-orange-600"><Download size={16} />View credential</a>}</article>;
                    })}</div>
                </div>
            </section>}

            <section className="bg-[#f5f6f4] px-6 py-20 sm:py-24 lg:px-8" aria-labelledby="leadership-title">
                    <div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><SectionLabel>Meet the team</SectionLabel><h2 id="leadership-title" className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">Led by experience.</h2></div><a href="/contact" className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-900">Connect with our team <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></a></div><div className="mt-12 grid gap-5 md:grid-cols-2">{leadership.filter((person) => cleanText(person.name) && cleanText(person.position)).map((person) => {
                        const profileHref = externalUrl(person.profileUrl);
                        return <article key={person.id} className="grid gap-6 border border-slate-200 bg-white p-5 sm:grid-cols-[10rem_1fr] sm:p-6"><div className="flex aspect-square items-center justify-center overflow-hidden bg-[#dfe4e3] text-slate-500">{cleanText(person.photoUrl) ? <img src={person.photoUrl} alt={cleanText(person.name)} className="h-full w-full object-cover" /> : <CircleUserRound size={40} strokeWidth={1.25} aria-label="Portrait unavailable" />}</div><div className="self-center"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">{cleanText(person.position)}</p><h3 className="mt-3 text-2xl font-semibold">{cleanText(person.name)}</h3>{cleanText(person.biography) && <p className="mt-3 text-sm leading-6 text-slate-600">{cleanText(person.biography)}</p>}{profileHref && <a href={profileHref} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600 hover:text-orange-600"><CircleUserRound size={14} />View profile</a>}</div></article>;
                    })}</div></div>
            </section>

            <section className="px-6 py-20 sm:py-24 lg:px-8" aria-labelledby="corporate-title">
                <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1fr_0.9fr]">
                    <div><SectionLabel>Corporate information</SectionLabel><h2 id="corporate-title" className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">Clear information for confident partnerships.</h2><p className="mt-6 max-w-xl text-base leading-8 text-slate-600">Company contact details and approved corporate documents.</p><div className="mt-9 grid gap-3 sm:grid-cols-2"><InfoRow label="Address" value={profile?.address} /><InfoRow label="Phone" value={profile?.phone} /><InfoRow label="Email" value={profile?.email} /><InfoRow label="Website" value={profile?.website} href={externalUrl(profile?.website)} /><InfoRow label="LinkedIn" value={profile?.linkedin} href={externalUrl(profile?.linkedin)} /><InfoRow label="Instagram" value={profile?.instagram} href={externalUrl(profile?.instagram)} /></div></div>
                    <div className="border-t border-slate-200 pt-7"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ed1c24]">Company documents</p><div className="mt-6 space-y-3">{documents.filter((document) => cleanText(document.title)).map((document) => {
                        const documentHref = externalUrl(document.documentUrl);
                        const type = cleanText(document.type);
                        const Icon = type && /policy|certificate|licen[cs]e|hse/i.test(type) ? ShieldCheck : FileText;
                        return <div key={document.id} className="flex items-center justify-between gap-4 border-b border-slate-200 py-4"><div className="flex min-w-0 items-center gap-4"><Icon size={20} className="shrink-0 text-[#ed1c24]" /><div><h3 className="font-semibold">{cleanText(document.title)}</h3>{cleanText(document.description) && <p className="mt-1 text-sm text-slate-500">{cleanText(document.description)}</p>}<p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{type}</p></div></div>{documentHref && <a href={documentHref} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-slate-600 hover:text-orange-600"><Download size={16} />View / download</a>}</div>;
                    })}{documents.length === 0 && <p className="border-b border-slate-200 py-4 text-sm text-slate-500">No corporate documents are available.</p>}</div></div>
                </div>
            </section>

            <CTA />
            {/* <Footer /> */}
        </main>
    );
}

function SectionLabel({ children }) {
    return <div className="flex items-center gap-3"><p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#ed1c24]">{children}</p></div>;
}

function Statement({ label, value }) {
    const statement = cleanText(value);
    if (!statement) return null;
    return <article className="relative overflow-hidden border border-slate-200 bg-white p-7 sm:p-9"><span className="absolute right-0 top-0 h-1 w-20 bg-[#ed1c24]" /><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ed1c24]">{label}</p><h3 className="mt-5 text-2xl font-semibold">{label}</h3><p className="mt-4 whitespace-pre-wrap text-base leading-7 text-slate-600">{statement}</p><Check size={20} className="mt-7 text-[#ed1c24]" aria-hidden="true" /></article>;
}

function InfoRow({ label, value, href }) {
    const text = cleanText(value);
    if (!text) return null;
    return <div className="border border-slate-200 p-5"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#ed1c24]">{label}</p>{href ? <a href={href} target="_blank" rel="noopener noreferrer" className="mt-3 block break-words text-sm leading-6 text-slate-600 hover:text-orange-600">{text}</a> : <p className="mt-3 break-words text-sm leading-6 text-slate-600">{text}</p>}</div>;
}