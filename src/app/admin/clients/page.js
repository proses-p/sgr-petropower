"use client";

import { useEffect, useState } from "react";
import { Building2, ExternalLink, Eye, EyeOff, Pencil, Plus, Trash2, X } from "lucide-react";

const emptyClient = {
    name: "",
    logoUrl: "",
    website: "",
    sortOrder: 0,
    isActive: true,
};

export default function ClientsPage() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [pendingId, setPendingId] = useState(null);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyClient);

    useEffect(() => {
        let cancelled = false;

        async function loadClients() {
            try {
                const response = await fetch("/api/clients?includeInactive=true", { cache: "no-store" });
                const result = await response.json();
                if (!response.ok) throw new Error(result.error || "Unable to load clients and partners");
                if (!cancelled) {
                    setClients(result.data || []);
                    setError("");
                }
            } catch (loadError) {
                if (!cancelled) setError(loadError.message || "Unable to load clients and partners");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadClients();
        return () => { cancelled = true; };
    }, []);

    async function reloadClients(showLoading = true) {
        if (showLoading) setLoading(true);
        setError("");
        try {
            const response = await fetch("/api/clients?includeInactive=true", { cache: "no-store" });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Unable to load clients and partners");
            setClients(result.data || []);
        } catch (loadError) {
            setError(loadError.message || "Unable to load clients and partners");
        } finally {
            if (showLoading) setLoading(false);
        }
    }

    function startAdd() {
        setEditing("new");
        setForm({ ...emptyClient });
        setError("");
        setNotice("");
    }

    function startEdit(client) {
        setEditing(client.id);
        setForm({ ...emptyClient, ...client });
        setError("");
        setNotice("");
    }

    function closeEditor() {
        if (saving) return;
        setEditing(null);
        setError("");
    }

    async function saveClient(event) {
        event.preventDefault();
        setSaving(true);
        setError("");

        try {
            const isEditing = editing !== "new";
            const response = await fetch(isEditing ? `/api/clients/${editing}` : "/api/clients", {
                method: isEditing ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, sortOrder: Number(form.sortOrder) || 0 }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Unable to save client");
            setEditing(null);
            setNotice(isEditing ? "Client updated." : "Client added.");
            await reloadClients(false);
        } catch (saveError) {
            setError(saveError.message || "Unable to save client");
        } finally {
            setSaving(false);
        }
    }

    async function deleteClient(client) {
        if (!window.confirm(`Delete ${client.name}? This cannot be undone.`)) return;
        setPendingId(client.id);
        setError("");
        setNotice("");

        try {
            const response = await fetch(`/api/clients/${client.id}`, { method: "DELETE" });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Unable to delete client");
            setNotice("Client deleted.");
            await reloadClients(false);
        } catch (deleteError) {
            setError(deleteError.message || "Unable to delete client");
        } finally {
            setPendingId(null);
        }
    }

    async function toggleActive(client) {
        setPendingId(client.id);
        setError("");
        setNotice("");

        try {
            const response = await fetch(`/api/clients/${client.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...client, isActive: !client.isActive }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Unable to update client status");
            setNotice(`${client.name} ${client.isActive ? "hidden from" : "shown on"} the public site.`);
            await reloadClients(false);
        } catch (toggleError) {
            setError(toggleError.message || "Unable to update client status");
        } finally {
            setPendingId(null);
        }
    }

    const activeCount = clients.filter((client) => client.isActive).length;

    return (
        <div className="mx-auto max-w-7xl">
            <header className="flex flex-col justify-between gap-5 border-b border-slate-200 pb-7 sm:flex-row sm:items-end">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">Client relationships</p>
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Clients &amp; Partners</h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Manage the organisations represented across the SGR Petropower website.</p>
                </div>
                <button type="button" onClick={startAdd} className="inline-flex items-center justify-center gap-2 self-start bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 sm:self-auto">
                    <Plus size={17} /> Add Client
                </button>
            </header>

            <section className="mt-6 grid gap-3 sm:grid-cols-2" aria-label="Client totals">
                <Metric label="Total clients & partners" value={clients.length} />
                <Metric label="Active on website" value={activeCount} />
            </section>

            {error && editing === null && <Notice tone="error">{error}</Notice>}
            {notice && <Notice tone="success">{notice}</Notice>}

            {loading ? (
                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Loading clients">
                    {[0, 1, 2].map((item) => <div key={item} className="h-72 animate-pulse border border-slate-200 bg-white" />)}
                </div>
            ) : error && clients.length === 0 ? (
                <div className="mt-6 border border-red-200 bg-white px-5 py-12 text-center">
                    <p className="font-semibold text-slate-800">Client records could not be loaded</p>
                    <button type="button" onClick={() => reloadClients()} className="mt-3 text-sm font-semibold text-orange-700 hover:text-orange-800">Try again</button>
                </div>
            ) : clients.length === 0 ? (
                <div className="mt-6 border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
                    <Building2 size={30} className="mx-auto text-slate-300" />
                    <h2 className="mt-3 font-semibold text-slate-800">No clients or partners yet</h2>
                    <p className="mt-1 text-sm text-slate-500">Add an organisation to start building the client library.</p>
                    <button type="button" onClick={startAdd} className="mt-4 text-sm font-semibold text-orange-700 hover:text-orange-800">Add a client</button>
                </div>
            ) : (
                <section className="mt-6" aria-label="Client and partner records">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-slate-700">Client library</h2>
                        <p className="text-xs text-slate-500">Ordered by display position</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {clients.map((client) => <ClientCard key={client.id} client={client} pending={pendingId === client.id} onEdit={() => startEdit(client)} onDelete={() => deleteClient(client)} onToggle={() => toggleActive(client)} />)}
                    </div>
                </section>
            )}

            {editing !== null && (
                <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/50 p-0 sm:items-center sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) closeEditor(); }}>
                    <section role="dialog" aria-modal="true" aria-labelledby="client-editor-title" className="max-h-[94vh] w-full overflow-y-auto border border-slate-200 bg-white shadow-2xl sm:max-w-xl">
                        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-7">
                            <div>
                                <h2 id="client-editor-title" className="text-lg font-semibold text-slate-900">{editing === "new" ? "Add client or partner" : "Edit client or partner"}</h2>
                                <p className="mt-1 text-sm text-slate-500">Logo, website, and public visibility settings.</p>
                            </div>
                            <button type="button" onClick={closeEditor} className="p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900" aria-label="Close editor"><X size={18} /></button>
                        </div>
                        <form onSubmit={saveClient} className="space-y-5 px-5 py-5 sm:px-7">
                            <div className="flex h-40 items-center justify-center border border-slate-200 bg-slate-50 p-5">
                                {form.logoUrl ? (
                                    <img src={form.logoUrl} alt={`${form.name || "Client"} logo preview`} className="max-h-full max-w-full object-contain" onError={(event) => { event.currentTarget.style.display = "none"; }} />
                                ) : (
                                    <div className="text-center text-slate-400"><Building2 size={30} className="mx-auto" /><p className="mt-2 text-xs">Logo preview appears here</p></div>
                                )}
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <FormField label="Company name" value={form.name} required onChange={(value) => setForm((current) => ({ ...current, name: value }))} />
                                <FormField label="Logo URL" type="url" value={form.logoUrl} required onChange={(value) => setForm((current) => ({ ...current, logoUrl: value }))} />
                                <FormField label="Website" type="url" value={form.website} onChange={(value) => setForm((current) => ({ ...current, website: value }))} />
                                <FormField label="Display order" type="number" value={form.sortOrder} onChange={(value) => setForm((current) => ({ ...current, sortOrder: value }))} />
                            </div>
                            <label className="flex cursor-pointer items-start gap-3 border border-slate-200 p-3.5">
                                <input type="checkbox" checked={Boolean(form.isActive)} onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))} className="mt-0.5 h-4 w-4 accent-orange-600" />
                                <span><span className="block text-sm font-medium text-slate-800">Active on the public website</span><span className="mt-1 block text-xs text-slate-500">Inactive clients remain saved here but are hidden publicly.</span></span>
                            </label>
                            {error && <Notice tone="error">{error}</Notice>}
                            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                                <button type="button" onClick={closeEditor} disabled={saving} className="border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60">Cancel</button>
                                <button type="submit" disabled={saving} className="px-5 py-2.5 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 disabled:cursor-wait disabled:opacity-60">{saving ? "Saving..." : editing === "new" ? "Add client" : "Save changes"}</button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </div>
    );
}

function ClientCard({ client, pending, onEdit, onDelete, onToggle }) {
    const websiteHref = client.website ? (/^https?:\/\//i.test(client.website) ? client.website : `https://${client.website}`) : "";

    return (
        <article className={`flex min-h-72 flex-col border bg-white ${client.isActive ? "border-slate-200" : "border-dashed border-slate-300"}`}>
            <div className="relative flex h-44 items-center justify-center overflow-hidden border-b border-slate-100 bg-slate-50 p-7">
                <Building2 size={34} className="absolute text-slate-300" aria-hidden="true" />
                <img src={client.logoUrl} alt={`${client.name} logo`} className="relative max-h-28 max-w-[86%] object-contain" onError={(event) => { event.currentTarget.style.display = "none"; }} />
                <span className={`absolute right-3 top-3 border px-2 py-1 text-[11px] font-semibold uppercase tracking-wide ${client.isActive ? "border-emerald-200 bg-white text-emerald-700" : "border-slate-200 bg-white text-slate-500"}`}>{client.isActive ? "Active" : "Inactive"}</span>
            </div>
            <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h3 className="break-words font-semibold text-slate-900">{client.name}</h3>
                        {websiteHref ? <a href={websiteHref} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex max-w-full items-center gap-1.5 break-all text-xs text-slate-500 hover:text-orange-700">{client.website}<ExternalLink size={12} className="shrink-0" /></a> : <p className="mt-1 text-xs text-slate-400">No website provided</p>}
                    </div>
                    <span className="shrink-0 text-xs text-slate-400">Order {client.sortOrder ?? 0}</span>
                </div>
                <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
                    <button type="button" onClick={onEdit} className="inline-flex items-center gap-1.5 border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"><Pencil size={13} /> Edit</button>
                    <button type="button" disabled={pending} onClick={onToggle} className="inline-flex items-center gap-1.5 border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50" aria-label={`${client.isActive ? "Deactivate" : "Activate"} ${client.name}`}>
                        {client.isActive ? <EyeOff size={13} /> : <Eye size={13} />}{client.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button type="button" disabled={pending} onClick={onDelete} className="ml-auto inline-flex items-center gap-1.5 border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"><Trash2 size={13} /> Delete</button>
                </div>
            </div>
        </article>
    );
}

function Metric({ label, value }) {
    return <div className="flex items-center justify-between border border-slate-200 bg-white px-4 py-3.5"><span className="text-sm text-slate-600">{label}</span><span className="text-xl font-semibold text-slate-900">{value}</span></div>;
}

function FormField({ label, value, onChange, type = "text", required = false }) {
    return (
        <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">{label}{required && <span className="ml-1 text-orange-600">*</span>}</span>
            <input type={type} value={value ?? ""} onChange={(event) => onChange(event.target.value)} required={required} min={type === "number" ? 0 : undefined} className="w-full border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
        </label>
    );
}

function Notice({ tone, children }) {
    const styles = tone === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700";
    return <p role={tone === "error" ? "alert" : "status"} className={`mt-5 border px-4 py-3 text-sm ${styles}`}>{children}</p>;
}