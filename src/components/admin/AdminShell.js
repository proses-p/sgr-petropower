"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Activity, BarChart3, BriefcaseBusiness, Building2, FileText, Images, LogOut, Menu, Settings, ShieldCheck, X } from "lucide-react";

const navigation = [
    { label: "Dashboard", href: "/admin", icon: BarChart3 },
    { label: "Services", href: "/admin/services", icon: Settings },
    { label: "Projects", href: "/admin/projects", icon: BriefcaseBusiness },
    { label: "Inquiries", href: "/admin/inquiries", icon: FileText },
    { label: "Company Profile", href: "/admin/company-profile", icon: Building2 },
    { label: "Media", href: "/admin/media", icon: Images },
    { label: "Activity", href: "/admin/activity", icon: Activity },
    { label: "Clients & partners", href: "/admin/clients", icon: Building2 },
];

export default function AdminShell({ children, user }) {
    const [open, setOpen] = useState(false);
    const [unreadInquiries, setUnreadInquiries] = useState(0);
    const router = useRouter();
    const pathname = usePathname();
    const links = user.role === "SUPERADMIN" ? [...navigation, { label: "Users", href: "/admin/users", icon: ShieldCheck }] : navigation;

    useEffect(() => {
        fetch("/api/inquiries").then((response) => response.ok ? response.json() : null).then((result) => {
            if (result?.data) setUnreadInquiries(result.data.filter((inquiry) => inquiry.status === "unread").length);
        }).catch(() => {});
    }, []);

    async function logout() { await fetch("/api/auth/logout", { method: "POST" }); router.push("/admin/login"); router.refresh(); }

    return <div className="min-h-screen bg-[#f4f6f8] text-slate-900"><div className={`fixed inset-0 z-40 bg-slate-950/50 lg:hidden ${open ? "block" : "hidden"}`} onClick={() => setOpen(false)} /><aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#091522] px-5 py-6 text-white transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}><div className="flex items-center justify-between px-3"><div><p className="text-sm font-bold uppercase tracking-[0.24em] text-orange-400">SGR</p><p className="mt-1 text-xs text-slate-500">Petropower admin</p></div><button onClick={() => setOpen(false)} className="text-slate-400 lg:hidden"><X size={20} /></button></div><nav className="mt-12 flex-1 space-y-1">{links.map(({ label, href, icon: Icon }) => <Link key={href} href={href} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${pathname === href ? "bg-orange-500 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}><Icon size={18} /><span className="flex-1">{label}</span>{label === "Inquiries" && unreadInquiries > 0 && <span className="rounded-full bg-orange-400 px-2 py-0.5 text-[11px] font-bold text-slate-950">{unreadInquiries}</span>}</Link>)}</nav><div className="border-t border-white/10 pt-4"><div className="mb-4 flex items-center gap-3 px-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500/20 text-sm font-bold text-orange-300">{user.name.slice(0, 1).toUpperCase()}</div><div className="min-w-0"><p className="truncate text-sm font-medium">{user.name}</p><p className="text-xs uppercase tracking-wider text-slate-500">{user.role.toLowerCase()}</p></div></div><button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"><LogOut size={18} />Log out</button></div></aside><div className="lg:pl-72"><header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-5 backdrop-blur sm:px-8"><button onClick={() => setOpen(true)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" aria-label="Open navigation"><Menu size={22} /></button><div className="hidden lg:block"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">Operations center</p><p className="mt-1 text-sm text-slate-500">Keep the business moving with clarity.</p></div><div className="ml-auto flex items-center gap-3"><span className="hidden text-right sm:block"><span className="block text-sm font-semibold text-slate-800">{user.name}</span><span className="block text-xs text-slate-500">{user.email}</span></span><div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">{user.name.slice(0, 1).toUpperCase()}</div></div></header><main className="mx-auto max-w-[1600px] p-5 sm:p-8">{children}</main></div></div>;
}