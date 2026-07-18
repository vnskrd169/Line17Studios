import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Link, useParams } from "react-router";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = useQuery(api.cms.getPublishedProject, { slug: slug || "" });
  const projects = useQuery(api.cms.listPublishedProjects);

  if (project === undefined) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-300" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Project Not Found</h1>
        <Link to="/projects" className="text-sm text-zinc-500 hover:text-zinc-900 underline">
          Back to projects
        </Link>
      </div>
    );
  }

  const p = project as any;
  const related = (projects ?? [])
    .filter((x: any) => x._id !== p._id && (x.category === p.category || x.tags?.some((t: string) => p.tags?.includes(t))))
    .slice(0, 3);

  return (
    <article>
      {/* Back link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to projects
        </Link>
      </div>

      {/* Cover image */}
      {p.coverImage && (
        <div className="w-full aspect-[2/1] sm:aspect-[3/1] relative overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <img
            src={p.coverImage}
            alt={p.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Title & metadata */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-5xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-6">
            {p.title}
          </h1>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
            {p.category && (
              <div>
                <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-0.5">Category</p>
                <p className="text-zinc-700 dark:text-zinc-300">{p.category}</p>
              </div>
            )}
            {p.year && (
              <div>
                <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-0.5">Year</p>
                <p className="text-zinc-700 dark:text-zinc-300">{p.year}</p>
              </div>
            )}
            {p.location && (
              <div>
                <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-0.5">Location</p>
                <p className="text-zinc-700 dark:text-zinc-300">{p.location}</p>
              </div>
            )}
            {p.services && p.services.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-0.5">Services</p>
                <p className="text-zinc-700 dark:text-zinc-300">{p.services.join(", ")}</p>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {p.description && (
          <div className="prose prose-sm sm:prose-base max-w-none text-zinc-600 dark:text-zinc-400 mb-12">
            <p className="text-lg leading-relaxed">{p.description}</p>
          </div>
        )}

        {/* Content (HTML) */}
        {p.content && (
          <div
            className="prose prose-sm sm:prose-base max-w-none text-zinc-600 dark:text-zinc-400 mb-12"
            dangerouslySetInnerHTML={{ __html: p.content }}
          />
        )}

        {/* Image gallery */}
        {p.images && p.images.length > 0 && (
          <div className="space-y-6 mb-12">
            {p.images.map((url: string, i: number) => (
              <div key={i} className="rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <img
                  src={url}
                  alt={`${p.title} - Image ${i + 1}`}
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related projects */}
      {related.length > 0 && (
        <div className="border-t border-zinc-100 dark:border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <h2 className="text-xs uppercase tracking-widest text-zinc-400 mb-8">Related Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((rel: any) => (
                <Link key={rel._id} to={`/projects/${rel.slug}`} className="group block">
                  <div className="aspect-[4/3] rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 mb-3">
                    {rel.coverImage ? (
                      <img src={rel.coverImage} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-zinc-200 dark:text-zinc-700 font-bold">{rel.title.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                    {rel.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">{rel.category}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Interested in a similar project?
          </h2>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-lg text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            Get in touch <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
