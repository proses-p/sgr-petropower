"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Search, Trash2, X } from "lucide-react";

const initialService = { title: "", slug: "", description: "" };
const initialProject = { title: "", slug: "", description: "", location: "", client: "", completionYear: "", status: "COMPLETED" };

export default function ContentManager({ type }) {
    const isProjects = type === "projects";
    const endpoint = `/api/${type}`;
    const [items, setItems] = useState([]);
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState(null);
    const [editorOpen, setEditorOpen] = useState(false);
    const [form, setForm] = useState(isProjects ? initialProject : initialService);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function loadItems() {
        setLoading(true);
        const response = await fetch(endpoint);
        const result = await response.json();
        if (response.ok) setItems(result.data || []);
        else setError(result.error || "Unable to load records");
        setLoading(false);
    }
    useEffect(() => { loadItems(); }, [endpoint]);

    function openCreate() { setSelected(null); setForm(isProjects ? { ...initialProject } : { ...initialService }); setError(""); setSuccess(""); setEditorOpen(true); }
    function openEdit(item) { setSelected(item); setForm({ ...item, completionYear: item.completionYear || "" }); setError(""); setSuccess(""); setEditorOpen(true); }
    function updateField(event) { setForm({ ...form, [event.target.name]: event.target.value }); }

    async function save(event) {
        event.preventDefault(); setSaving(true); setError("");
        const response = await fetch(selected ? `${endpoint}/${selected.slug}` : endpoint, { method: selected ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
        const result = await response.json();
        if (!response.ok) setError(result.error || "Unable to save record");
        else { setSelected(null); setEditorOpen(false); setSuccess(`${isProjects ? "Project" : "Service"} saved successfully.`); await loadItems(); }
        setSaving(false);
    }

    async function remove(item) {
        if (!window.confirm(`Delete ${item.title}? This cannot be undone.`)) return;
        const response = await fetch(`${endpoint}/${item.slug}`, { method: "DELETE" });
        if (response.ok) loadItems(); else { const result = await response.json(); setError(result.error || "Unable to delete record"); }
    }

    const filtered = items.filter((item) => `${item.title} ${item.slug} ${item.location || ""} ${item.client || ""}`.toLowerCase().includes(query.toLowerCase()));
    return <div><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-sm font-bold uppercase tracking-[0.22em] text-orange-500">Content management</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{isProjects ? "Projects" : "Services"}</h1><p className="mt-2 text-slate-500">Manage the public-facing {isProjects ? "project portfolio" : "service catalogue"}.</p></div><button onClick={openCreate} className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"><Plus size={18} />Add {isProjects ? "project" : "service"}</button></div>{success && <p className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{success}</p>}<div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 p-4 sm:p-5"><div className="relative max-w-md"><Search className="absolute left-3 top-3 text-slate-400" size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${type}...`} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-orange-500" /></div></div>{error && <p className="mx-5 mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}{loading ? <div className="space-y-3 p-5"><div className="h-14 animate-pulse rounded-xl bg-slate-100" /><div className="h-14 animate-pulse rounded-xl bg-slate-100" /></div> : filtered.length ? <div className="divide-y divide-slate-100">{filtered.map((item) => <div key={item.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><p className="truncate font-semibold text-slate-900">{item.title}</p><p className="mt-1 truncate text-sm text-slate-500">/{item.slug} {isProjects && item.location ? `· ${item.location}` : ""}</p></div><div className="flex shrink-0 items-center gap-2"><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-600">{isProjects ? item.status : "Published"}</span><button onClick={() => openEdit(item)} className="rounded-lg p-2 text-slate-500 hover:bg-orange-50 hover:text-orange-600" aria-label={`Edit ${item.title}`}><Pencil size={17} /></button><button onClick={() => remove(item)} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600" aria-label={`Delete ${item.title}`}><Trash2 size={17} /></button></div></div>)}</div> : <div className="px-5 py-16 text-center"><p className="font-semibold text-slate-800">{query ? "No matching records" : `No ${type} yet`}</p><p className="mt-2 text-sm text-slate-500">{query ? "Try a different search term." : "Create your first record to start building the catalogue."}</p></div>}</div>{editorOpen && <Editor isProjects={isProjects} selected={selected} form={form} updateField={updateField} save={save} saving={saving} close={() => { setSelected(null); setEditorOpen(false); setForm(isProjects ? { ...initialProject } : { ...initialService }); }} error={error} />}</div>;
}

function Editor({ isProjects, selected, form, updateField, save, saving, close, error }) { return <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 sm:items-center sm:p-6"><div className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white p-6 shadow-2xl sm:rounded-2xl sm:p-8"><div className="flex items-start justify-between"><div><p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">{selected ? "Edit record" : "New record"}</p><h2 className="mt-2 text-2xl font-semibold text-slate-900">{selected ? `Edit ${isProjects ? "project" : "service"}` : `Add ${isProjects ? "project" : "service"}`}</h2></div><button onClick={close} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" aria-label="Close editor"><X size={20} /></button></div><form onSubmit={save} className="mt-7 space-y-5"><div className="grid gap-5 sm:grid-cols-2"><Field label="Title" name="title" value={form.title} onChange={updateField} required /><Field label="Slug" name="slug" value={form.slug} onChange={updateField} required /></div><Field label="Description" name="description" value={form.description} onChange={updateField} required textarea />{isProjects && <><div className="grid gap-5 sm:grid-cols-2"><Field label="Location" name="location" value={form.location} onChange={updateField} /><Field label="Client" name="client" value={form.client} onChange={updateField} /></div><div className="grid gap-5 sm:grid-cols-2"><Field label="Completion year" name="completionYear" value={form.completionYear} onChange={updateField} type="number" min="1900" max="2200" /><label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">Status</span><select name="status" value={form.status} onChange={updateField} className="w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-orange-500"><option>COMPLETED</option><option>IN_PROGRESS</option><option>PLANNED</option></select></label></div><div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">Image management is prepared in the database and will be available in the media phase.</div></>}{error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}<div className="flex justify-end gap-3 border-t border-slate-100 pt-5"><button type="button" onClick={close} className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button><button disabled={saving} className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60">{saving ? "Saving..." : selected ? "Save changes" : "Create record"}</button></div></form></div></div>; }

function Field({ label, name, value, onChange, required, textarea, ...props }) { const Input = textarea ? "textarea" : "input"; return <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">{label}</span><Input name={name} value={value} onChange={onChange} required={required} rows={textarea ? 5 : undefined} className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-orange-500" {...props} /></label>; }