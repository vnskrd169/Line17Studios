import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Link } from "react-router";
import { ArrowRight, Loader2 } from "lucide-react";

export default function Services() {
  const services = useQuery(api.cms.listPublishedServices);
  const homepage = useQuery(api.cms.getHomepage);

  return (
    <div>
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <p className="text-xs uppercase tracking-widest text-zinc-400 mb-4">What We Do</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          {homepage?.servicesTitle || "Our Services"}
        </h1>
        <p className="mt-4 text-zinc-500 max-w-xl text-sm leading-relaxed">
          {homepage?.servicesDescription || "From concept to completion, we offer a comprehensive range of architectural and interior design services."}
        </p>
      </div>

      {services === undefined ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-300" />
        </div>
      ) : services.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <p className="text-zinc-400 text-sm">Services coming soon.</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
          <div className="space-y-12">
            {services.map((service: any, i: number) => {
              const s = service as any;
              return (
                <div
                  key={s._id}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center"
                >
                  {/* Number + Content */}
                  <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                    <span className="text-5xl sm:text-6xl font-bold text-zinc-100 dark:text-zinc-800 leading-none">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mt-4 mb-3">
                      {s.title}
                    </h2>
                    {s.summary && (
                      <p className="text-sm text-zinc-500 leading-relaxed mb-4">{s.summary}</p>
                    )}
                    {s.deliverables && s.deliverables.length > 0 && (
                      <div className="space-y-1.5 mb-6">
                        <p className="text-[10px] uppercase tracking-widest text-zinc-400">Deliverables</p>
                        <ul className="space-y-1">
                          {s.deliverables.map((d: string, di: number) => (
                            <li key={di} className="text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                              <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                              {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Image */}
                  <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                    {s.image ? (
                      <div className="aspect-[4/3] rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                        <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="aspect-[4/3] rounded-lg bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border border-zinc-100 dark:border-zinc-800">
                        <span className="text-6xl font-bold text-zinc-200 dark:text-zinc-800">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Ready to start your project?
          </h2>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-lg text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            Get in touch <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
