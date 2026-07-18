import { Link, Outlet, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { label: "Projects", href: "/projects" },
  { label: "Services", href: "/services" },
  { label: "Journal", href: "/journal" },
  { label: "Studio", href: "/studio" },
  { label: "Contact", href: "/contact" },
];

export default function PublicLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center">
                <span className="text-xs font-bold text-zinc-100 dark:text-zinc-900">L</span>
              </div>
              <span className="font-semibold tracking-tight text-sm">LINE17 STUDIO</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "px-3 py-2 text-sm rounded-lg transition-colors",
                    location.pathname === item.href || location.pathname.startsWith(item.href + "/")
                      ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800",
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/admin/login"
                className="ml-2 px-3 py-2 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
              >
                Admin
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="md:hidden border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <div className="px-4 py-3 space-y-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block px-3 py-2.5 text-sm rounded-lg transition-colors",
                    location.pathname === item.href
                      ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium"
                      : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100",
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/admin/login"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-xs text-zinc-400"
              >
                Admin
              </Link>
            </div>
          </nav>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-3">
                <div className="h-7 w-7 rounded-full bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-zinc-100 dark:text-zinc-900">L</span>
                </div>
                <span className="font-semibold text-xs tracking-tight">LINE17 STUDIO</span>
              </Link>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Architecture & interior design studio crafting spaces that resonate.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-3 uppercase tracking-wider">
                Pages
              </h4>
              <ul className="space-y-2">
                {NAV_ITEMS.map((item) => (
                  <li key={item.href}>
                    <Link to={item.href} className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-3 uppercase tracking-wider">
                Connect
              </h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors">Instagram</a></li>
                <li><a href="#" className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors">LinkedIn</a></li>
                <li><a href="#" className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors">Pinterest</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-3 uppercase tracking-wider">
                Legal
              </h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors">Privacy</a></li>
                <li><a href="#" className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
            <p className="text-[10px] text-zinc-400 text-center">
              &copy; {new Date().getFullYear()} LINE17 STUDIO. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
