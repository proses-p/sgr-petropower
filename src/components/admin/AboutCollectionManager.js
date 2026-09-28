"use client";

import { useCallback, useEffect, useState } from "react";
import { Award, Check, CircleUserRound, ExternalLink, Eye, EyeOff, FileText, Pencil, Plus, ShieldCheck, Trash2, X } from "lucide-react";

const configurations = {
    values: {
        endpoint: "/api/company-values",
        title: "Company values",
        description: "Set the principles that shape how your teams work and deliver.",
        singular: "value",
        fields: [
            { name: "title", label: "Title", required: true },
            { name: "description", label: "Description", required: true, textarea: true },
        ],
    },
    stats: {
        endpoint: "/api/company-stats",
        title: "Company statistics",
        description: "Maintain the figures and indicators used to communicate company capability.",
        singular: "statistic",
        fields: [
            { name: "label", label: "Label", required: true },
            { name: "value", label: "Value", required: true },
        ],
    },
    certifications: {
        endpoint: "/api/certifications",
        title: "Licences & certifications",
        description: "Manage the credentials and supporting documents approved for publication.",
        singular: "credential",
        fields: [
            { name: "title", label: "Title", required: true },
            { name: "issuingOrganization", label: "Issuing organization" },
            { name: "year", label: "Year" },
            { name: "description", label: "Description", textarea: true },
            { name: "documentUrl", label: "Document URL", type: "url" },
            { name: "type", label: "Type", type: "select", required: true, options: [{ value: "CERTIFICATION", label: "Certification" }, { value: "LICENCE", label: "Licence" }, { value: "HSE", label: "HSE" }], initialValue: "CERTIFICATION" },
        ],
    },
    leadership: {
        endpoint: "/api/leadership",
        title: "Leadership",
        description: "Introduce leaders and their experience with an optional portrait and profile link.",
        singular: "profile",
        fields: [
            { name: "name", label: "Name", required: true },
            { name: "position", label: "Position", required: true },
            { name: "photoUrl", label: "Photo URL", type: "url" },
            { name: "biography", label: "Biography", textarea: true },
            { name: "profileUrl", label: "Profile URL", type: "url" },
        ],
    },
    documents: {
        endpoint: "/api/corporate-documents",
        title: "Corporate documents",
        description: "Publish company profiles, policies, terms, certificates, and other approved resources.",
        singular: "document",
        fields: [
            { name: "title", label: "Title", required: true },
            { name: "type", label: "Type", type: "select", required: true, options: ["Company Profile", "Policies", "Terms", "Certificates", "Other"].map((value) => ({ value, label: value })), initialValue: "Company Profile" },
            { name: "description", label: "Description", textarea: true },
            { name: "documentUrl", label: "Document URL", type: "url", required: true },
        ],
    },
};

function emptyRecord(config) {
    return {
        ...Object.fromEntries(config.fields.map((field) => [field.name, field.initialValue || ""])),
        sortOrder: 0,
        isActive: true,
    };
}

export default function AboutCollectionManager({ section }) {
    const config = configurations[section];
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [pendingId, setPendingId] = useState(null);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [editing, setEditing] = useState(null);
    const [draft, setDraft] = useState(() => emptyRecord(config));

    const loadRecords = useCallback(async (showLoading = true) => {
        if (showLoading) setLoading(true);
        setError("");
        try {
            const response = await fetch(`${config.endpoint}?includeInactive=true`, { cache: "no-store" });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || `Unable to load ${config.title.toLowerCase()}`);
            setRecords(result.data || []);
        } catch (loadError) {
            setError(loadError.message || `Unable to load ${config.title.toLowerCase()}`);
        } finally {
            if (showLoading) setLoading(false);
        }
    }, [config]);

    useEffect(() => {
        let cancelled = false;

        async function fetchRecords() {
            try {
                const response = await fetch(`${config.endpoint}?includeInactive=true`, { cache: "no-store" });
                const result = await response.json();
                if (!response.ok) throw new Error(result.error || `Unable to load ${config.title.toLowerCase()}`);
                if (!cancelled) setRecords(result.data || []);
            } catch (loadError) {
                if (!cancelled) setError(loadError.message || `Unable to load ${config.title.toLowerCase()}`);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchRecords();
        return () => { cancelled = true; };
    }, [config]);

    function openNew() {
        setEditing("new");
        setDraft(emptyRecord(config));
        setError("");
        setNotice("");
        // setEditing("new");
    }

    function openEdit(record) {
        setEditing(record.id);
        setDraft({ ...emptyRecord(config), ...record });
        setError("");
        setNotice("");
    }

    function closeEditor() {
        if (saving) return;
        setEditing(null);
        setError("");
    }

    async function saveRecord(event) {
        event.preventDefault();
        setSaving(true);
        setError("");

        try {
            // const response = await fetch(editing ? `${config.endpoint}/${editing}` : config.endpoint, {
            //     method: editing ? "PUT" : "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({ ...draft, sortOrder: Number(draft.sortOrder) || 0 }),
            // });

            const isNew = editing === "new";

            const response = await fetch(
                isNew ? config.endpoint : `${config.endpoint}/${editing}`, {
                    method: isNew ? "POST" : "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ...draft,
                        sortOrder: Number(draft.sortOrder) || 0,
                    }),
                }
            );
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || `Unable to save ${config.singular}`);
            setEditing(null);
            setNotice(`${config.singular[0].toUpperCase()}${config.singular.slice(1)} ${isNew ? "added" : "updated"}.`);
            await loadRecords(false);
        } catch (saveError) {
            setError(saveError.message || `Unable to save ${config.singular}`);
        } finally {
            setSaving(false);
        }
    }

    async function deleteRecord(record) {
        if (!window.confirm(`Delete ${record.title || record.label || record.name}? This cannot be undone.`)) return;
        setPendingId(record.id);
        setError("");
        setNotice("");
        try {
            const response = await fetch(`${config.endpoint}/${record.id}`, { method: "DELETE" });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || `Unable to delete ${config.singular}`);
            setNotice(`${config.singular[0].toUpperCase()}${config.singular.slice(1)} deleted.`);
            await loadRecords(false);
        } catch (deleteError) {
            setError(deleteError.message || `Unable to delete ${config.singular}`);
        } finally {
            setPendingId(null);
        }
    }

    async function toggleActive(record) {
        setPendingId(record.id);
        setError("");
        setNotice("");
        try {
            const response = await fetch(`${config.endpoint}/${record.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...record, isActive: !record.isActive }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || `Unable to update ${config.singular} status`);
            setNotice(`${config.singular[0].toUpperCase()}${config.singular.slice(1)} ${record.isActive ? "hidden" : "activated"}.`);
            await loadRecords(false);
        } catch (toggleError) {
            setError(toggleError.message || `Unable to update ${config.singular} status`);
        } finally {
            setPendingId(null);
        }
    }

    const activeCount = records.filter((record) => record.isActive).length;

    return (
        <div>
            <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end">
                <div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-semibold text-slate-900">{config.title}</h2>
                        <span className="border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">{records.length} total</span>
                    </div>
                    <p className="mt-1 max-w-2xl text-sm text-slate-500">{config.description}</p>
                    {!loading && <p className="mt-2 text-xs font-medium text-slate-400">{activeCount} active on the public page</p>}
                </div>
                <button type="button" onClick={openNew} className="inline-flex items-center justify-center gap-2 self-start bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700 sm:self-auto">
                    <Plus size={16} /> Add {config.singular}
                </button>
            </div>

            {error && !editing && <Notice tone="error">{error}</Notice>}
            {notice && <Notice tone="success">{notice}</Notice>}

            {loading ? (
                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label={`Loading ${config.title}`}>
                    {[0, 1, 2].map((item) => <div key={item} className="h-52 animate-pulse border border-slate-200 bg-white" />)}
                </div>
            ) : error && records.length === 0 ? (
                <div className="mt-5 border border-red-200 bg-white px-5 py-10 text-center">
                    <p className="font-medium text-slate-800">Content could not be loaded</p>
                    <button type="button" onClick={() => loadRecords()} className="mt-3 text-sm font-semibold text-orange-700 hover:text-orange-800">Try again</button>
                </div>
            ) : records.length === 0 ? (
                <div className="mt-5 border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
                    <FileText size={27} className="mx-auto text-slate-300" />
                    <h3 className="mt-3 font-semibold text-slate-800">No {config.title.toLowerCase()} yet</h3>
                    <p className="mt-1 text-sm text-slate-500">Add the first {config.singular} to publish content on the About page.</p>
                    <button type="button" onClick={openNew} className="mt-4 text-sm font-semibold text-orange-700 hover:text-orange-800">Add {config.singular}</button>
                </div>
            ) : (
                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {records.map((record) => (
                        <RecordCard
                            key={record.id}
                            section={section}
                            record={record}
                            pending={pendingId === record.id}
                            onEdit={() => openEdit(record)}
                            onDelete={() => deleteRecord(record)}
                            onToggle={() => toggleActive(record)}
                        />
                    ))}
                </div>
            )}

            {editing !== null && (
                <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/50 p-0 sm:items-center sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) closeEditor(); }}>
                    <section role="dialog" aria-modal="true" aria-labelledby="content-editor-title" className="max-h-[94vh] w-full overflow-y-auto border border-slate-200 bg-white shadow-2xl sm:max-w-2xl">
                        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-7">
                            <div>
                                <h3 id="content-editor-title" className="text-lg font-semibold text-slate-900">{editing === "new" ? `Add ${config.singular}` : `Edit ${config.singular}`}</h3>
                                <p className="mt-1 text-sm text-slate-500">Fields marked with * are required.</p>
                            </div>
                            <button type="button" onClick={closeEditor} className="p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900" aria-label="Close editor"><X size={18} /></button>
                        </div>
                        <form onSubmit={saveRecord} className="space-y-5 px-5 py-5 sm:px-7">
                            <div className="grid gap-4 sm:grid-cols-2">
                                {config.fields.map((field) => <FormField key={field.name} field={field} value={draft[field.name]} onChange={(value) => setDraft((current) => ({ ...current, [field.name]: value }))} />)}
                                <FormField field={{ name: "sortOrder", label: "Display order", type: "number" }} value={draft.sortOrder} onChange={(value) => setDraft((current) => ({ ...current, sortOrder: value }))} />
                            </div>
                            <label className="flex cursor-pointer items-start gap-3 border border-slate-200 p-3.5">
                                <input type="checkbox" checked={Boolean(draft.isActive)} onChange={(event) => setDraft((current) => ({ ...current, isActive: event.target.checked }))} className="mt-0.5 h-4 w-4 accent-orange-600" />
                                <span><span className="block text-sm font-medium text-slate-800">Active on the public About page</span><span className="mt-1 block text-xs text-slate-500">Turn off to keep this record in admin without displaying it publicly.</span></span>
                            </label>
                            {error && <Notice tone="error">{error}</Notice>}
                            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                                <button type="button" onClick={closeEditor} disabled={saving} className="border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60">Cancel</button>
                                <button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:cursor-wait disabled:opacity-60">
                                    <Check size={16} />{saving ? "Saving..." : editing === "new" ? `Add ${config.singular}` : "Save changes"}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </div>
    );

}

function FormField({ field, value, onChange }) {
    const common = "w-full border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";
    return (
        <label className={`block ${field.textarea ? "sm:col-span-2" : ""}`}>
            <span className="mb-2 block text-sm font-medium text-slate-700">{field.label}{field.required && <span className="ml-1 text-orange-600">*</span>}</span>
            {field.type === "select" ? (
                <select value={value ?? ""} onChange={(event) => onChange(event.target.value)} required={field.required} className={common}>
                    {field.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
            ) : field.textarea ? (
                <textarea value={value || ""} onChange={(event) => onChange(event.target.value)} required={field.required} rows={4} className={`${common} resize-y`} />
            ) : (
                <input type={field.type || "text"} value={value ?? ""} onChange={(event) => onChange(event.target.value)} required={field.required} min={field.type === "number" ? 0 : undefined} className={common} />
            )}
        </label>
    );
}

function RecordCard({ section, record, pending, onEdit, onDelete, onToggle }) {
    const name = record.title || record.label || record.name;
    const documentUrl = record.documentUrl;

    return (
        <article className={`flex min-h-52 flex-col border bg-white ${record.isActive ? "border-slate-200" : "border-dashed border-slate-300 opacity-80"}`}>
            <div className="flex-1 p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        {section === "leadership" ? (
                            <div className="mb-4 flex items-center gap-4">
                                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden bg-slate-100 text-slate-400">
                                    <CircleUserRound size={30} strokeWidth={1.3} />
                                    {record.photoUrl && <img src={record.photoUrl} alt={record.name} className="absolute inset-0 h-full w-full bg-slate-100 object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} />}
                                </div>
                                <div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-orange-700">{record.position}</p><h3 className="mt-1 break-words font-semibold text-slate-900">{record.name}</h3></div>
                            </div>
                        ) : section === "stats" ? (
                            <><p className="text-3xl font-semibold text-orange-700">{record.value}</p><h3 className="mt-2 font-semibold text-slate-900">{record.label}</h3></>
                        ) : (
                            <div className="flex items-start gap-3">
                                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border border-orange-200 bg-orange-50 text-orange-700">{section === "certifications" ? <ShieldCheck size={17} /> : section === "documents" ? <FileText size={17} /> : <Award size={17} />}</span>
                                <div className="min-w-0"><h3 className="break-words font-semibold text-slate-900">{name}</h3>{section === "certifications" && <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-orange-700">{record.type}</p>}</div>
                            </div>
                        )}
                    </div>
                    <span className={`shrink-0 border px-2 py-1 text-[11px] font-semibold uppercase tracking-wide ${record.isActive ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-100 text-slate-500"}`}>{record.isActive ? "Active" : "Inactive"}</span>
                </div>

                {section === "values" && <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-600">{record.description}</p>}
                {section === "certifications" && <div className="mt-3 space-y-1 text-sm text-slate-600">{record.issuingOrganization && <p>{record.issuingOrganization}</p>}{record.year && <p className="text-xs font-medium text-slate-400">{record.year}</p>}{record.description && <p className="line-clamp-3 leading-5">{record.description}</p>}</div>}
                {section === "leadership" && record.biography && <p className="line-clamp-3 text-sm leading-5 text-slate-600">{record.biography}</p>}
                {section === "documents" && <><p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{record.type}</p>{record.description && <p className="mt-2 line-clamp-3 text-sm leading-5 text-slate-600">{record.description}</p>}</>}
                <div className="mt-4 flex items-center gap-3 text-xs text-slate-400">
                    <span>Order {record.sortOrder ?? 0}</span>
                    {record.profileUrl && <a href={record.profileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-slate-600 hover:text-orange-700">Profile <ExternalLink size={12} /></a>}
                    {documentUrl && <a href={documentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-orange-700 hover:text-orange-800">View document <ExternalLink size={12} /></a>}
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 px-4 py-3">
                <button type="button" onClick={onEdit} className="inline-flex items-center gap-1.5 border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"><Pencil size={13} /> Edit</button>
                <button type="button" disabled={pending} onClick={onToggle} className="inline-flex items-center gap-1.5 border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50" aria-label={`${record.isActive ? "Deactivate" : "Activate"} ${name}`}>
                    {record.isActive ? <EyeOff size={13} /> : <Eye size={13} />}{record.isActive ? "Deactivate" : "Activate"}
                </button>
                <button type="button" disabled={pending} onClick={onDelete} className="ml-auto inline-flex items-center gap-1.5 border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"><Trash2 size={13} /> Delete</button>
            </div>
        </article>
    );
}

function Notice({ tone, children }) {
    const styles = tone === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700";
    return <p role={tone === "error" ? "alert" : "status"} className={`mt-4 border px-4 py-3 text-sm ${styles}`}>{children}</p>;
}