import Navbar from "@/components/Navbar";
import { prisma } from "@/lib/prisma";
import ContactForm from "@/components/ContactForm";

export const metadata = { title: "Contact", description: "Send SGR Petropower Engineering a project inquiry." };

export default async function ContactPage() {
    const [profile, services] = await Promise.all([prisma.companyProfile.findUnique({ where: { id: 1 } }), prisma.service.findMany({ orderBy: { id: "asc" }, select: { title: true } })]);
    return <main className="min-h-screen bg-slate-100"><div className="bg-slate-950"><Navbar /><section className="mx-auto max-w-7xl px-6 pb-20 pt-40 lg:px-8"><p className="text-sm font-bold uppercase tracking-[0.25em] text-[#ed1c24]">Start a conversation</p><h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">Bring us the brief. We’ll bring engineering clarity.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">Tell us what you are building, where it is happening and what success looks like.</p></section></div><section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[0.7fr_1.3fr] lg:px-8"><aside className="rounded-2xl bg-slate-950 p-8 text-white"><p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ed1c24]">Contact details</p><div className="mt-10 space-y-7"><Detail label="Email" value={profile?.email} /><Detail label="Phone" value={profile?.phone} /><Detail label="Address" value={profile?.address} /></div></aside><ContactForm services={services} /></section></main>;
}

function Detail({ label, value }) { return <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">{label}</p><p className="mt-2 wrap-break-word text-slate-200">{value || "Available on request"}</p></div>; }