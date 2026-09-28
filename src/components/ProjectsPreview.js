import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ProjectsPreview() {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" }, take: 3, include: { media: { orderBy: { sortOrder: "asc" }, take: 1 } } });
  return (
    <section className="bg-slate-100 px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-500">
              Our Work
            </p>

            <h2 className="mt-3 text-4xl font-bold text-slate-900 lg:text-5xl">
              Featured Projects
            </h2>
          </div>

          <Link
            href="/projects"
            className="font-semibold text-slate-900 transition hover:text-orange-500"
          >
            View All Projects →
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {projects.length ? projects.map((project) => (
            <Link
              href={`/projects/${project.slug}`}
              key={project.id}
              className="group relative h-105 overflow-hidden rounded-3xl"
            >
              {project.media[0] ? <img src={project.media[0].url} alt={project.media[0].alt || project.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" /> : <div className="h-full w-full bg-[linear-gradient(135deg,#243d4e,#0c1823)]" />}

              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />

              <div className="absolute bottom-0 p-7">
                <p className="text-sm font-semibold uppercase tracking-wider text-orange-400">
                  {project.status}
                </p>

                <h3 className="mt-2 text-2xl font-bold text-white">
                  {project.title}
                </h3>
              </div>
            </Link>
          )) : <div className="col-span-full border border-dashed border-slate-300 px-6 py-16 text-center text-slate-500">Projects will appear here once they are published from the admin workspace.</div>}
        </div>

      </div>
    </section>
  );
}