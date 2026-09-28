import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness, FileText, Layers3 } from "lucide-react";

const dateFormatter = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" });

export default function Dashboard({ stats, recentProjects, recentInquiries }) {
    const cards = [{ label: "Total services", value: stats.services, href: "/admin/services", icon: Layers3, tone: "orange" }, { label: "Active projects", value: stats.projects, href: "/admin/projects", icon: BriefcaseBusiness, tone: "blue" }, { label: "Total inquiries", value: stats.inquiries, href: "/admin/inquiries", icon: FileText, tone: "green" }];
    return <div className="animate-[fade-in_0.4s_ease-out]">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-500">Overview</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Operations overview.</h1>
                <p className="mt-2 text-slate-500">Here is what is happening across your operations.</p>
            </div>
            <span className="text-sm text-slate-400">{stats.unreadInquiries} unread inquiries</span>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
            {cards.map(({ label, value, href, icon: Icon, tone }) => (
                <Link href={href} key={label} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                    <div className="flex items-start justify-between">
                        <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone === "orange" ? "bg-orange-100 text-orange-600" : tone === "blue" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"}`}>
                            <Icon size={21} />
                        </span>
                        <ArrowUpRight size={19} className="text-slate-300 transition group-hover:text-orange-500" />
                    </div>
                    <p className="mt-7 text-sm font-medium text-slate-500">{label}</p>
                    <p className="mt-1 text-3xl font-semibold text-slate-900">{value}</p>
                </Link>
            ))}
        </div>
        <div className="mt-8 grid gap-6 xl:grid-cols-2">
            <DataPanel title="Recent projects" action="View all" href="/admin/projects">
                {recentProjects.length ? recentProjects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between border-b border-slate-100 py-4 last:border-0">
                        <div>
                            <p className="font-semibold text-slate-800">{project.title}</p>
                            <p className="mt-1 text-sm text-slate-500">{project.location || "Location not set"} · {dateFormatter.format(new Date(project.createdAt))}</p>
                        </div>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">{project.status}</span>
                    </div>
                )) : <Empty text="No projects have been added yet." />}
            </DataPanel>
            <DataPanel title="Recent inquiries" action="View all" href="/admin/inquiries">
                {recentInquiries.length ? recentInquiries.map((inquiry) => (
                    <div key={inquiry.id} className="flex items-center justify-between border-b border-slate-100 py-4 last:border-0">
                        <div>
                            <p className="font-semibold text-slate-800">{inquiry.fullName}</p>
                            <p className="mt-1 text-sm text-slate-500">{inquiry.company || inquiry.email} · {dateFormatter.format(new Date(inquiry.createdAt))}</p>
                        </div>
                        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-700">{inquiry.status}</span>
                    </div>
                )) : <Empty text="No inquiries yet. They will appear here when submitted." />}
            </DataPanel>
        </div>
    </div>;
}

function DataPanel({ title, action, href, children }) { return <section className="rounded-2xl border border-slate-200 bg-white px-5 shadow-sm sm:px-7"><div className="flex items-center justify-between border-b border-slate-100 py-5"><h2 className="font-semibold text-slate-900">{title}</h2><Link href={href} className="text-sm font-semibold text-orange-600 hover:text-orange-700">{action}</Link></div>{children}</section>; }
function Empty({ text }) { return <div className="py-12 text-center text-sm text-slate-500">{text}</div>; }