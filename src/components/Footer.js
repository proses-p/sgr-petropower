import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import ClientLogoStrip from "@/components/ClientLogoStrip";
import { prisma } from "@/lib/prisma";

const companyLinks = [
	{ label: "Home", href: "/" },
	{ label: "About", href: "/about" },
	{ label: "Projects", href: "/projects" },
	{ label: "Services", href: "/services" },
	{ label: "Contact", href: "/contact" },
];
const officialWebsite = "https://www.sgrpetropower.co.tz/";
const officialPhoneNumbers = ["(+255) 789 451899", "(+255) 783 099377", "(+255) 784 498077"];
const officialEmail = "enquiry@petropowerengineering.com";
const officialAddress = "Plot 13A, Potwe Street, Nyerere Road, P.O. Box 12927, Dar-Es-Salaam, Tanzania.";

function ContactItem({ icon: Icon, label, href, children }) {
	return (
		<div className="flex items-start gap-3">
			<Icon size={16} strokeWidth={1.7} className="mt-0.5 shrink-0 text-orange-400" aria-hidden="true" />
			<div className="min-w-0">
				<p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
				{href ? (
					<a href={href} className="mt-1 block break-words text-sm leading-5 text-slate-200 transition-colors hover:text-white">
						{children}
					</a>
				) : (
					<p className="mt-1 break-words text-sm leading-5 text-slate-200">{children}</p>
				)}
			</div>
		</div>
	);
}

export default async function Footer({ showClientLogos = true }) {
	const [profile, services] = await Promise.all([
		prisma.companyProfile.findUnique({
			where: { id: 1 },
			select: { about: true, phone: true, email: true, address: true },
		}),
		prisma.service.findMany({
			orderBy: { id: "asc" },
			take: 6,
			select: { id: true, title: true, slug: true },
		}),
	]);
	const companyDescription = profile?.about?.trim()
		? profile.about.trim().length > 150
			? `${profile.about.trim().slice(0, 147).trimEnd()}...`
			: profile.about.trim()
		: "Engineering, construction, power and petroleum solutions built around quality, safety and lasting performance.";
	const phoneNumbers = profile?.phone?.trim() ? [profile.phone.trim()] : officialPhoneNumbers;
	const email = profile?.email?.trim() || officialEmail;
	const address = profile?.address?.trim() || officialAddress;

	return (
		<footer className="bg-[#0b1118] px-6 text-white lg:px-8">
			<div className="mx-auto max-w-7xl">
				<section className="border-b border-white/10 py-8 sm:py-9" aria-labelledby="footer-cta-title">
					<div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
						<div className="max-w-2xl">
							<p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-400">Let&apos;s build together</p>
							<h2 id="footer-cta-title" className="mt-2 text-2xl font-semibold leading-tight tracking-normal text-white sm:text-[1.75rem]">
								Have an engineering project in mind?
							</h2>
							<p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
								Talk with SGR Petropower about your engineering, construction, power or petroleum requirements.
							</p>
						</div>
						<Link
							href="/contact"
							className="group inline-flex min-h-11 shrink-0 items-center justify-center gap-3 self-start bg-orange-500 px-5 text-sm font-semibold text-white transition-colors hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300 sm:self-center motion-reduce:transition-none"
						>
							Talk to Our Team
							<ArrowRight size={16} className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden="true" />
						</Link>
					</div>
				</section>

				<section className="grid gap-9 border-b border-white/10 py-9 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-8 lg:grid-cols-[1.25fr_0.7fr_1.15fr_1.25fr] lg:gap-8 lg:py-10">
					<div>
						<Link href="/" aria-label="SGR Petropower Engineering home" className="inline-flex">
							<img
								src="https://www.sgrpetropower.co.tz/images/pet.png"
								alt="SGR Petropower Engineering Ltd"
								className="h-auto w-[148px] object-contain sm:w-[164px]"
							/>
						</Link>
						<p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">{companyDescription}</p>
						<div className="mt-4 flex flex-wrap items-center gap-2">
							<a
								href={officialWebsite}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex min-h-9 items-center border border-white/15 px-3 text-xs font-medium text-slate-300 transition-colors hover:border-orange-400 hover:text-orange-400 motion-reduce:transition-none"
							>
								Website
							</a>
							<span className="inline-flex min-h-9 items-center border border-white/15 px-3 text-xs font-medium text-slate-300">LinkedIn</span>
							<span className="inline-flex min-h-9 items-center border border-white/15 px-3 text-xs font-medium text-slate-300">Instagram</span>
						</div>
					</div>

					<nav aria-label="Company">
						<h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-white">Company</h2>
						<ul className="mt-4 space-y-2.5 text-sm text-slate-400">
							{companyLinks.map(({ label, href }) => (
								<li key={href}><Link href={href} className="transition-colors hover:text-white">{label}</Link></li>
							))}
						</ul>
					</nav>

					<nav aria-label="Services">
						<h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-white">Services</h2>
						<ul className="mt-4 space-y-2.5 text-sm text-slate-400">
							{services.map((service) => (
								<li key={service.id}>
									<Link href={`/services/${service.slug}`} className="block leading-5 transition-colors hover:text-white">{service.title}</Link>
								</li>
							))}
						</ul>
					</nav>

					<section aria-labelledby="footer-contact-title">
						<h2 id="footer-contact-title" className="text-xs font-semibold uppercase tracking-[0.16em] text-white">Contact</h2>
						<div className="mt-4 space-y-4">
							{phoneNumbers.map((phone) => (
								<ContactItem key={phone} icon={Phone} label="Phone" href={`tel:${phone.replace(/[^\d+]/g, "")}`}>
									{phone}
								</ContactItem>
							))}
							<ContactItem icon={Mail} label="Email" href={`mailto:${email}`}>{email}</ContactItem>
							<ContactItem icon={MapPin} label="Location">{address}</ContactItem>
						</div>
					</section>
				</section>

				{showClientLogos && <ClientLogoStrip />}

				<div className="flex flex-col justify-between gap-2 py-4 text-xs text-slate-500 sm:flex-row sm:items-center">
					<p>© {new Date().getFullYear()} SGR Petropower Engineering Ltd. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
}
