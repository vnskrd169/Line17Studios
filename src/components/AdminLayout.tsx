import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Image,
  MessageSquare,
  Settings,
  Home,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  PanelRightOpen,
  BookOpen,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Projects", href: "/admin/projects", icon: FolderKanban },
  { label: "Services", href: "/admin/services", icon: PanelRightOpen },
  { label: "Journal", href: "/admin/journal", icon: BookOpen },
  { label: "Media", href: "/admin/media", icon: Image },
  { label: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
  { label: "Homepage", href: "/admin/homepage", icon: Home },
  { label: "Settings", href: "/admin/settings", icon: Settings },
  { label: "Users", href: "/admin/users", icon: Users },
];

export default function AdminLayout() {
  const { signOut, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (item: (typeof NAV_ITEMS)[number]) => {
    if (item.exact) return location.pathname === item.href;
    return location.pathname.startsWith(item.href);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 transition-all duration-300",
          sidebarOpen ? "w-64" : "w-16",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-zinc-200 dark:border-zinc-800">
          <Link to="/admin" className="flex items-center gap-3 min-w-0">
            <div className="h-8 w-8 rounded-full bg-zinc-900 dark:bg-zinc-100 flex-shrink-0 flex items-center justify-center">
              <span className="text-xs font-bold text-zinc-100 dark:text-zinc-900">L</span>
            </div>
            <span
              className={cn(
                "font-semibold text-sm whitespace-nowrap transition-opacity",
                sidebarOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden",
              )}
            >
              LINE17 CMS
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive(item)
                  ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800",
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span
                className={cn(
                  "whitespace-nowrap transition-opacity",
                  sidebarOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden",
                )}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        {/* User section */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 p-3">
          <div className={cn("flex items-center gap-3 mb-3", !sidebarOpen && "justify-center")}>
            <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex-shrink-0 flex items-center justify-center">
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                {((user as any)?.email || "A").charAt(0).toUpperCase()}
              </span>
            </div>
            <div className={cn("min-w-0", sidebarOpen ? "block" : "hidden")}>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                {((user as any)?.email || "Admin").split("@")[0]}
              </p>
              <p className="text-xs text-zinc-500 truncate">
                {(user as any)?.email || "admin"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className={cn("w-full text-zinc-500 hover:text-red-500", !sidebarOpen && "px-0 justify-center")}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            <span className={cn("ml-2", sidebarOpen ? "inline" : "hidden")}>Sign out</span>
          </Button>
        </div>

        {/* Collapse toggle (desktop) */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden lg:flex absolute -right-3 top-20 h-6 w-6 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 items-center justify-center text-zinc-400 hover:text-zinc-600"
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Top bar (mobile) */}
        <div className="lg:hidden flex items-center h-14 px-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <button onClick={() => setMobileOpen(true)} className="text-zinc-500">
            <Menu className="h-5 w-5" />
          </button>
          <span className="ml-3 font-semibold text-sm">LINE17 CMS</span>
        </div>

        {/* Page content */}
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
