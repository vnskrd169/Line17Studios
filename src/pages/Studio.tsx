import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

const VALUES = [
  {
    title: "Craft",
    description: "Every detail matters. We approach each project with meticulous attention to materiality, light, and proportion.",
  },
  {
    title: "Context",
    description: "Great design responds to its environment. We study site, history, and culture before putting pencil to paper.",
  },
  {
    title: "Collaboration",
    description: "The best work emerges from dialogue. We partner closely with clients, builders, and craftspeople throughout the process.",
  },
  {
    title: "Sustainability",
    description: "Responsible design is not optional. We integrate sustainable strategies that endure — for our clients and the planet.",
  },
];

export default function Studio() {
  return (
    <div>
      {/* Hero section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-400 mb-4">About</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight">
              Architecture & design rooted in context and craft
            </h1>
          </div>
          <div>
            <p className="text-sm text-zinc-500 leading-relaxed mb-6">
              LINE17 STUDIO is an architecture and interior design practice founded on the belief that 
              exceptional spaces emerge from a deep understanding of place, purpose, and materiality.
            </p>
            <p className="text-sm text-zinc-500 leading-relaxed mb-6">
              Based in San Francisco, we work across residential, commercial, and cultural projects — 
              from intimate interiors to large-scale master plans. Our approach is collaborative, 
              research-driven, and rigorously detailed.
            </p>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Every project begins with listening. We take time to understand how our clients live, 
              work, and aspire to inhabit space. From there, we craft environments that are at once 
              functional, poetic, and enduring.
            </p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="border-t border-zinc-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <p className="text-xs uppercase tracking-widest text-zinc-400 mb-12">Our Values</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUES.map((value, i) => (
              <div key={i}>
                <span className="text-3xl font-bold text-zinc-100 dark:text-zinc-800 leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mt-4 mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Approach */}
      <div className="border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            <div>
              <p className="text-xs uppercase tracking-widest text-zinc-400 mb-4">Our Approach</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                From concept to completion
              </h2>
            </div>
            <div className="space-y-8">
              {[
                {
                  phase: "01",
                  title: "Discovery",
                  desc: "We immerse ourselves in your vision, site, and program. Through conversations, site analysis, and research, we build a foundation of understanding.",
                },
                {
                  phase: "02",
                  title: "Concept Design",
                  desc: "Ideas take form through sketches, models, and renderings. We explore multiple directions before converging on a design that resonates.",
                },
                {
                  phase: "03",
                  title: "Design Development",
                  desc: "The concept is refined into a detailed design with material selections, systems integration, and construction documentation.",
                },
                {
                  phase: "04",
                  title: "Construction",
                  desc: "We stay engaged through construction, working closely with contractors to ensure every detail is realized as intended.",
                },
              ].map((step) => (
                <div key={step.phase} className="flex gap-4">
                  <span className="text-xs font-bold text-zinc-300 dark:text-zinc-600 w-6 flex-shrink-0">
                    {step.phase}
                  </span>
                  <div>
                    <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 mb-1">{step.title}</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="border-t border-zinc-100 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Start a conversation
          </h2>
          <p className="text-sm text-zinc-500 mb-8 max-w-md mx-auto">
            We'd love to hear about your project. Reach out and let's explore what we can create together.
          </p>
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
