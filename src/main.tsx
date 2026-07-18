import { Toaster } from "@/components/ui/sonner";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import React, { StrictMode, useEffect, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import "./index.css";

// Public pages
const Landing = lazy(() => import("./pages/Landing.tsx"));
const PublicLayout = lazy(() => import("./components/PublicLayout.tsx"));
const Gallery = lazy(() => import("./pages/Gallery.tsx"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail.tsx"));
const Services = lazy(() => import("./pages/Services.tsx"));
const Journal = lazy(() => import("./pages/Journal.tsx"));
const JournalDetail = lazy(() => import("./pages/JournalDetail.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const Studio = lazy(() => import("./pages/Studio.tsx"));
const AuthPage = lazy(() => import("./pages/Auth.tsx"));
const AdminLogin = lazy(() => import("./pages/AdminLogin.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

// Admin pages
const AdminLayout = lazy(() => import("./components/AdminLayout.tsx"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.tsx"));
const AdminProjects = lazy(() => import("./pages/admin/AdminProjects.tsx"));
const AdminServices = lazy(() => import("./pages/admin/AdminServices.tsx"));
const AdminJournal = lazy(() => import("./pages/admin/AdminJournal.tsx"));
const AdminMedia = lazy(() => import("./pages/admin/AdminMedia.tsx"));
const AdminInquiries = lazy(() => import("./pages/admin/AdminInquiries.tsx"));
const AdminHomepage = lazy(() => import("./pages/admin/AdminHomepage.tsx"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings.tsx"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers.tsx"));

function RouteLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>
  );
}

/** Admin route guard */
function AdminGuard({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

/** Silent error boundary for VlyToolbar */
class ToolbarErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: Error) {
    console.warn("[VlyToolbar] Caught error, toolbar disabled:", err.message);
  }
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

/** Root error boundary */
class RootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string; stack: string }
> {
  state = { hasError: false, message: "", stack: "" };
  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      message: error.message || "Unknown runtime error",
      stack: error.stack || "",
    };
  }
  componentDidCatch(err: Error) {
    console.error("[WebContainer preview] Root crash:", err);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
          <div className="max-w-lg text-center">
            <p className="text-sm font-semibold">Preview runtime error</p>
            <p className="mt-2 text-xs text-muted-foreground break-words">
              {this.state.message}
            </p>
            {this.state.stack && (
              <pre className="mt-3 text-left text-[10px] leading-4 text-muted-foreground/80 max-h-40 overflow-auto rounded border border-border/60 p-2">
                {this.state.stack}
              </pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

function RouteSyncer() {
  const location = useLocation();
  useEffect(() => {
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname },
      "*",
    );
  }, [location.pathname]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootErrorBoundary>
      <ToolbarErrorBoundary>
        <VlyToolbar />
      </ToolbarErrorBoundary>
      <ConvexAuthProvider client={convex}>
        <BrowserRouter>
          <RouteSyncer />
          <Suspense fallback={<RouteLoading />}>
            <Routes>
              {/* Public routes with shared layout */}
              <Route element={<PublicLayout />}>
                <Route index element={<Landing />} />
                <Route path="projects" element={<Gallery />} />
                <Route path="projects/:slug" element={<ProjectDetail />} />
                <Route path="services" element={<Services />} />
                <Route path="journal" element={<Journal />} />
                <Route path="journal/:slug" element={<JournalDetail />} />
                <Route path="contact" element={<Contact />} />
                <Route path="studio" element={<Studio />} />
              </Route>

              {/* Standalone routes */}
              <Route path="/auth" element={<AuthPage redirectAfterAuth="/" />} />
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Admin routes */}
              <Route
                path="/admin"
                element={
                  <AdminGuard>
                    <AdminLayout />
                  </AdminGuard>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="journal" element={<AdminJournal />} />
                <Route path="media" element={<AdminMedia />} />
                <Route path="inquiries" element={<AdminInquiries />} />
                <Route path="homepage" element={<AdminHomepage />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="users" element={<AdminUsers />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Toaster />
      </ConvexAuthProvider>
    </RootErrorBoundary>
  </StrictMode>,
);
