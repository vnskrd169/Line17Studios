import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Link } from "react-router";
import { ArrowRight, Loader2 } from "lucide-react";

export default function Journal() {
  const posts = useQuery(api.cms.listPublishedPosts);
  const homepage = useQuery(api.cms.getHomepage);

  const featured = (posts ?? []).filter((p: any) => p.featured);
  const recent = (posts ?? []).filter((p: any) => !p.featured);

  return (
    <div>
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <p className="text-xs uppercase tracking-widest text-zinc-400 mb-4">Journal</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          {homepage?.journalTitle || "Thoughts & Ideas"}
        </h1>
        <p className="mt-4 text-zinc-500 max-w-xl text-sm leading-relaxed">
          {homepage?.journalDescription || "Insights on architecture, design, and the spaces we create."}
        </p>
      </div>

      {posts === undefined ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-300" />
        </div>
      ) : posts.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 text-center">
          <p className="text-zinc-400 text-sm">Journal entries coming soon.</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24 space-y-16">
          {/* Featured post */}
          {featured.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-6">Featured</p>
              {featured.slice(0, 1).map((post: any) => (
                <Link
                  key={post._id}
                  to={`/journal/${post.slug}`}
                  className="group grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
                >
                  <div className="aspect-[4/3] rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    {post.coverImage ? (
                      <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl font-bold text-zinc-200 dark:text-zinc-700">{post.title.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 text-xs text-zinc-400 mb-3">
                      {post.category && <span>{post.category}</span>}
                      {post.publishedAt && (
                        <span>{new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                      )}
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-3 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                      {post.title}
                    </h2>
                    {post.summary && (
                      <p className="text-sm text-zinc-500 leading-relaxed">{post.summary}</p>
                    )}
                    <div className="mt-4 flex items-center gap-1 text-xs font-medium text-zinc-900 dark:text-zinc-100 group-hover:gap-2 transition-all">
                      Read more <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Recent posts */}
          {recent.length > 0 && (
            <div>
              {featured.length > 0 && (
                <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-6">Recent</p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {(featured.length > 0 ? recent : [...featured, ...recent]).map((post: any) => (
                  <Link key={post._id} to={`/journal/${post.slug}`} className="group block">
                    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 mb-4">
                      {post.coverImage ? (
                        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-2xl font-bold text-zinc-200 dark:text-zinc-700">{post.title.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-400 mb-2">
                      {post.category && <span>{post.category}</span>}
                      {post.publishedAt && <span>{new Date(post.publishedAt).toLocaleDateString()}</span>}
                    </div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors mb-1">
                      {post.title}
                    </h3>
                    {post.summary && (
                      <p className="text-xs text-zinc-500 line-clamp-2">{post.summary}</p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
