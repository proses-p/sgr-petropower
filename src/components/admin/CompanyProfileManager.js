"use client";

import { useEffect, useState } from "react";
import { Award, Building2, FileText, Flag, Goal, Save, Users, ChartNoAxesColumnIncreasing } from "lucide-react";
import AboutCollectionManager from "@/components/admin/AboutCollectionManager";
// import { type } from '../../../.next/types/routes.d';

const initial = {
    companyName: "",
    about: "",
    mission: "",
    vision: "",
    phones: [""],
    email: "",
    address: "",
    website: "",
    linkedin: "",
    instagram: "",
};

const sections = [
    { id: "profile", label: "Company Profile", icon: Building2 },
    { id: "direction", label: "Mission & Vision", icon: Goal },
    { id: "values", label: "Values", icon: Flag },
    { id: "stats", label: "Statistics", icon: ChartNoAxesColumnIncreasing },
    { id: "certifications", label: "Certifications", icon: Award },
    { id: "leadership", label: "Leadership", icon: Users },
    { id: "documents", label: "Documents", icon: FileText },
];

export default function CompanyProfileManager() {
    const [form, setForm] = useState(initial);
    const [activeSection, setActiveSection] = useState("profile");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    useEffect(() => {
        let mounted = true;

        async function loadProfile() {
            try {
                const response = await fetch("/api/company-profile", { cache: "no-store" });
                const result = await response.json();
                if (!response.ok) throw new Error(result.error || "Unable to load company profile");
                if (mounted && result.data) setForm({ ...initial, ...result.data });
            } catch (loadError) {
                if (mounted) setError(loadError.message || "Unable to load company profile");
            } finally {
                if (mounted) setLoading(false);
            }
        }

        loadProfile();
        return () => { mounted = false; };
    }, []);

    function change(event) {
        setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    }

    const handlePhoneChange = (index, value) => {
        setForm((prev) => ({
            ...prev,
            phones: prev.phones.map((phone,i) => i === index ? value : phone),
        }));
    };

    const addPhone = () => {
        setForm((prev) => ({
            ...prev,
            phones: [...prev.phones, ""],
        }));
    };

    const removePhone = (index) => {
        setForm((prev) => ({
            ...prev,
            phones: prev.phones.filter((_, i) => i !== index),
        }));
    };

    async function save(event) {
        event.preventDefault();
        setSaving(true);
        setError("");
        setNotice("");

        try {
            const response = await fetch("/api/company-profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Unable to save company profile");
            setForm({ ...initial, ...result.data });
            setNotice("Company profile saved.");
        } catch (saveError) {
            setError(saveError.message || "Unable to save company profile");
        } finally {
            setSaving(false);
        }
    }

    const selected = sections.find((section) => section.id === activeSection);

    return (
        <div className="mx-auto max-w-7xl">
            <header className="flex flex-col justify-between gap-5 border-b border-slate-200 pb-7 sm:flex-row sm:items-end">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">Website content</p>
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">About management</h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Manage company information, credibility content, and corporate resources shown on the About page.</p>
                </div>
                <span className="inline-flex w-fit items-center gap-2 border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-orange-700">
                    <span className="h-2 w-2 rounded-full bg-orange-500" /> About page CMS
                </span>
            </header>

            <nav className="mt-6 -mx-1 flex gap-1 overflow-x-auto border-b border-slate-200 px-1" role="tablist" aria-label="About page sections">
                {sections.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        id={`about-tab-${id}`}
                        type="button"
                        role="tab"
                        aria-selected={activeSection === id}
                        aria-controls={`about-panel-${id}`}
                        onClick={() => { setActiveSection(id); setError(""); setNotice(""); }}
                        className={`flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition-colors ${activeSection === id ? "border-orange-500 text-orange-700" : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800"}`}
                    >
                        <Icon size={16} aria-hidden="true" />{label}
                    </button>
                ))}
            </nav>

            <section id={`about-panel-${activeSection}`} role="tabpanel" aria-labelledby={`about-tab-${activeSection}`} className="pt-7">
                {activeSection === "profile" || activeSection === "direction" ? (
                    <form onSubmit={save} className="max-w-5xl">
                        <div className="mb-5">
                            <h2 className="text-xl font-semibold text-slate-900">{selected.label}</h2>
                            <p className="mt-1 text-sm text-slate-500">
                                {activeSection === "profile" ? "Company identity and public contact details." : "Set the mission and vision that guide your company."}
                            </p>
                        </div>

                        {loading ? (
                            <div className="space-y-4 border border-slate-200 bg-white p-6">
                                <div className="h-10 animate-pulse bg-slate-100" />
                                <div className="h-28 animate-pulse bg-slate-100" />
                                <div className="h-10 animate-pulse bg-slate-100" />
                            </div>
                        ) : (
                            <div className="space-y-6 border border-slate-200 bg-white p-5 sm:p-7">
                                {activeSection === "profile" ? (
                                    <>
                                        <div className="grid gap-5 sm:grid-cols-2">
                                            <Field label="Company name" name="companyName" value={form.companyName} change={change} required />
                                            <Field label="Public email" name="email" type="email" value={form.email} change={change} />
                                            {/* <Field label="Phone" name="phone" type="tel" value={form.phone || ""} change={change} /> */}
                                            <Field label="Address" name="address" value={form.address} change={change} />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-slate-700">Phone Numbers</label>
                                            <div className="space-y-3">
                                                {(form.phones || [""]).map((phone, index) => (
                                                    <div key={index} className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={phone}
                                                            onChange={(e) => handlePhoneChange(index, e.target.value)

                                                            }

                                                            placeholder="+255/0 XXX XXX XXX"
                                                            className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm font-semibold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                                                        />

                                                        {form.phones.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removePhone(index)}
                                                                className="rounded-xl border border-red-200 px-4 text-sm font-semibold text-red-600 hover:bg-red-50"
                                                            >
                                                                Remove
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            <button 
                                                type="button"
                                                onClick={addPhone}
                                                className="mt-3 text-sm font-semibold text-orange-600 hover:text-orange-700"
                                            >
                                                + 
                                            </button>
                                        </div>
                                        <Field label="About description" name="about" value={form.about} change={change} required textarea />
                                        <div className="border-t border-slate-100 pt-5">
                                            <h3 className="text-sm font-semibold text-slate-800">Social and web presence</h3>
                                            <div className="mt-4 grid gap-5 sm:grid-cols-3">
                                                <Field label="Website" name="website" type="url" value={form.website} change={change} />
                                                <Field label="LinkedIn" name="linkedin" type="url" value={form.linkedin} change={change} />
                                                <Field label="Instagram" name="instagram" type="url" value={form.instagram} change={change} />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="grid gap-6 lg:grid-cols-2">
                                        <Field label="Mission" name="mission" value={form.mission} change={change} textarea help="The purpose behind the work your company does." />
                                        <Field label="Vision" name="vision" value={form.vision} change={change} textarea help="The future your company is working toward." />
                                    </div>
                                )}

                                {error && <Notice tone="error">{error}</Notice>}
                                {notice && <Notice tone="success">{notice}</Notice>}

                                <div className="flex justify-end border-t border-slate-100 pt-5">
                                    <button disabled={saving || loading} className="inline-flex items-center justify-center gap-2 bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60">
                                        <Save size={16} />{saving ? "Saving..." : "Save changes"}
                                    </button>
                                </div>
                            </div>
                        )}
                        {loading && error && <Notice tone="error">{error}</Notice>}
                    </form>
                ) : (
                    <AboutCollectionManager key={activeSection} section={activeSection} />
                )}
            </section>
        </div>
    );
}

function Field({ label, name, value, change, required = false, textarea = false, help, ...props }) {
    const Input = textarea ? "textarea" : "input";

    return (
        <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">{label}{required && <span className="ml-1 text-orange-600">*</span>}</span>
            <Input name={name} value={value || ""} onChange={change} required={required} rows={textarea ? 6 : undefined} className="w-full border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100" {...props} />
            {help && <span className="mt-2 block text-xs text-slate-500">{help}</span>}
        </label>
    );
}

function Notice({ tone, children }) {
    const styles = tone === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700";
    return <p role={tone === "error" ? "alert" : "status"} className={`border px-4 py-3 text-sm ${styles}`}>{children}</p>;
}