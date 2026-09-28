"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LockKeyhole, Mail, ShieldCheck } from "lucide-react";

export default function AdminLoginForm() {
    const router = useRouter();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setLoading(true);
        const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
        const result = await response.json();
        if (!response.ok) setError(result.error || "Unable to sign in");
        else router.push("/admin");
        setLoading(false);
    }

    return (
        <main className="min-h-screen bg-[#091522] text-white">
            <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
                <section className="relative hidden overflow-hidden border-r border-white/10 bg-[radial-gradient(circle_at_20%_20%,#26445d_0,#091522_48%)] p-12 lg:flex lg:flex-col lg:justify-between">
                    <div><span className="text-sm font-bold uppercase tracking-[0.3em] text-orange-400">SGR Petropower</span><p className="mt-2 text-sm text-slate-400">Engineering operations platform</p></div>
                    <div className="max-w-xl"><p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-400">Private workspace</p><h1 className="mt-5 text-6xl font-semibold leading-[1.05] tracking-tight">Move critical work forward.</h1><p className="mt-6 max-w-md text-lg leading-8 text-slate-300">A focused control room for the projects, services, and relationships behind every delivery.</p></div>
                    <p className="text-sm text-slate-500">Authorized personnel only · SGR Engineering Group</p>
                </section>
                <section className="flex items-center justify-center px-6 py-12 sm:px-10">
                    <div className="w-full max-w-md">
                        <div className="mb-12 lg:hidden"><span className="text-sm font-bold uppercase tracking-[0.3em] text-orange-400">SGR Petropower</span></div>
                        <div className="mb-9"><div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white"><ShieldCheck size={24} /></div><h2 className="text-3xl font-semibold tracking-tight">Welcome back</h2><p className="mt-2 text-slate-400">Sign in to your admin workspace.</p></div>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <label className="block"><span className="mb-2 block text-sm font-medium text-slate-300">Work email</span><div className="relative"><Mail className="absolute left-4 top-3.5 text-slate-500" size={18} /><input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="w-full rounded-xl border border-white/10 bg-white/6 px-11 py-3.5 text-white outline-none transition focus:border-orange-500" placeholder="admin@sgrpetropower.com" /></div></label>
                            <label className="block"><span className="mb-2 block text-sm font-medium text-slate-300">Password</span><div className="relative"><LockKeyhole className="absolute left-4 top-3.5 text-slate-500" size={18} /><input required type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="w-full rounded-xl border border-white/10 bg-white/6 px-11 py-3.5 text-white outline-none transition focus:border-orange-500" placeholder="Enter your password" /></div></label>
                            {error && <p className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</p>}
                            <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 font-semibold text-white transition hover:bg-orange-400 disabled:cursor-wait disabled:opacity-60">{loading ? "Authenticating..." : "Sign in"}<ArrowRight size={18} /></button>
                        </form>
                    </div>
                </section>
            </div>
        </main>
    );
}
