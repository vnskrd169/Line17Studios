import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useState } from "react";
import { Link } from "react-router";
import { cn } from "@/lib/utils";
import { ArrowRight, Loader2 } from "lucide-react";

export default function Gallery() {
  const projects = useQuery(api.cms.listPublishedProjects);
  const [filter, setFilter] = useState<string | null>(null);

  const categories = projects
    ? [...new Set(projects.map((p: any) => p.category).filter(Boolean))]
    : [];

  const filtered = filter
    ? (projects ?? []).filter((p: any) => p.category === filter)
    : (projects ?? []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      {/* Header */}
      <div className="mb-12">
        <p className="text-xs uppercase tracking-widest text-zinc-400 mb-4">Portfolio</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Selected Projects
        </h1>
        <p className="mt-4 text-zinc-500 max-w-xl text-sm leading-relaxed">
          A curated selection of our work across residential, commercial, and cultural projects.
        </p>
      </div>

      {/* Category filters */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-12">
          <button
            onClick={() => setFilter(null)}
            className={cn(
              "px-4 py-2 text-xs rounded-full border transition-colors",
              !filter
                ? "bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100"
                : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400 dark:bg-zinc-950 dark:text-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500",
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat as string}
              onClick={() => setFilter(cat as string)}
              className={cn(
                "px-4 py-2 text-xs rounded-full border transition-colors",
                filter === cat
                  ? "bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100"
                  : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400 dark:bg-zinc-950 dark:text-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500",
              )}
            >
              {cat as string}
            </button>
          ))}
        </div>
      )}

      {/* Projects grid */}
      {projects === undefined ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-300" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-zinc-400 text-sm">No projects yet. Check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filtered.map((project: any, i: number) => (
            <Link
              key={project._id}
              to={`/projects/${project.slug}`}
              className="group block"
            >
              <div className="aspect-[4/3] relative overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800 mb-4">
                {project.coverImage ? (
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-zinc-200 dark:text-zinc-700">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                    {project.title}
                  </h3>
                  <ArrowRight className="h-3 w-3 text-zinc-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
                {(project.category || project.year) && (
                  <p className="text-xs text-zinc-400">
                    {[project.category, project.year].filter(Boolean).join(" · ")}
                  </p>
                )}
                {project.summary && (
                  <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">{project.summary}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
