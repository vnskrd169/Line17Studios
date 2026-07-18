import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Link, useParams } from "react-router";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

export default function JournalDetail() {
  const { slug } = useParams<{ slug: string }>();
  const post = useQuery(api.cms.getPublishedPost, { slug: slug || "" });
  const posts = useQuery(api.cms.listPublishedPosts);

  if (post === undefined) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-300" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Post Not Found</h1>
        <Link to="/journal" className="text-sm text-zinc-500 hover:text-zinc-900 underline">Back to journal</Link>
      </div>
    );
  }

  const p = post as any;
  const related = (posts ?? [])
    .filter((x: any) => x._id !== p._id)
    .slice(0, 3);

  const formattedDate = p.publishedAt
    ? new Date(p.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <article>
      {/* Back link */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <Link
          to="/journal"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to journal
        </Link>
      </div>

      {/* Cover image */}
      {p.coverImage && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="aspect-[2/1] rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800">
            <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-zinc-400 mb-4">
          {p.category && <span>{p.category}</span>}
          {formattedDate && <span>{formattedDate}</span>}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-6">
          {p.title}
        </h1>

        {/* Summary */}
        {p.summary && (
          <p className="text-lg text-zinc-500 leading-relaxed mb-8 border-l-2 border-zinc-200 dark:border-zinc-700 pl-4">
            {p.summary}
          </p>
        )}

        {/* Content */}
        {p.content && (
          <div
            className="prose prose-sm sm:prose-base max-w-none text-zinc-600 dark:text-zinc-400"
            dangerouslySetInnerHTML={{ __html: p.content }}
          />
        )}

        {/* Tags */}
        {p.tags && p.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-zinc-100 dark:border-zinc-800">
            {p.tags.map((tag: string, i: number) => (
              <span
                key={i}
                className="px-3 py-1 text-[10px] rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <div className="border-t border-zinc-100 dark:border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <h2 className="text-xs uppercase tracking-widest text-zinc-400 mb-8">More from the Journal</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((rel: any) => (
                <Link key={rel._id} to={`/journal/${rel.slug}`} className="group block">
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
                  {rel.summary && (
                    <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{rel.summary}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
