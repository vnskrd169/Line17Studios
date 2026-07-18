import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import {
  FolderKanban,
  FileText,
  MessageSquare,
  Image,
  Users,
  TrendingUp,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router";

export default function AdminDashboard() {
  const stats = useQuery(api.cms.getDashboardStats);
  const inquiries = useQuery(api.cms.listInquiries);
  const navigate = useNavigate();

  const cardData = [
    {
      label: "Projects",
      value: stats?.totalProjects ?? 0,
      detail: `${stats?.publishedProjects ?? 0} published · ${stats?.draftProjects ?? 0} drafts`,
      icon: FolderKanban,
      href: "/admin/projects",
      color: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950",
    },
    {
      label: "Posts",
      value: stats?.totalPosts ?? 0,
      detail: `${stats?.publishedPosts ?? 0} published`,
      icon: FileText,
      href: "/admin/journal",
      color: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950",
    },
    {
      label: "Services",
      value: stats?.totalServices ?? 0,
      detail: `${stats?.publishedServices ?? 0} published`,
      icon: TrendingUp,
      href: "/admin/services",
      color: "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-950",
    },
    {
      label: "Inquiries",
      value: stats?.totalInquiries ?? 0,
      detail: `${stats?.newInquiries ?? 0} new`,
      icon: MessageSquare,
      href: "/admin/inquiries",
      color: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950",
    },
    {
      label: "Media",
      value: stats?.totalMedia ?? 0,
      detail: "files uploaded",
      icon: Image,
      href: "/admin/media",
      color: "text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950",
    },
    {
      label: "Users",
      value: stats?.totalUsers ?? 0,
      detail: "registered",
      icon: Users,
      href: "/admin/users",
      color: "text-cyan-600 bg-cyan-50 dark:text-cyan-400 dark:bg-cyan-950",
    },
  ];

  const newInquiries = (inquiries ?? [])
    .filter((i: any) => i.status === "new")
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Dashboard</h1>
        <p className="text-sm text-zinc-500 mt-1">Overview of your LINE17 STUDIO site.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cardData.map((card) => (
          <Card
            key={card.label}
            className="cursor-pointer hover:shadow-md transition-shadow border-zinc-200 dark:border-zinc-800"
            onClick={() => navigate(card.href)}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500">{card.label}</CardTitle>
              <div className={`p-2 rounded-lg ${card.color}`}>
                <card.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{card.value}</div>
              <p className="text-xs text-zinc-500 mt-1">{card.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent inquiries */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">New Inquiries</h2>
          {newInquiries.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/inquiries")}>
              View all <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          )}
        </div>

        {newInquiries.length === 0 ? (
          <Card className="border-dashed border-zinc-300 dark:border-zinc-700">
            <CardContent className="py-8 text-center">
              <AlertCircle className="mx-auto h-8 w-8 text-zinc-300 dark:text-zinc-600" />
              <p className="mt-2 text-sm text-zinc-500">No new inquiries</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {newInquiries.map((inquiry: any) => (
              <Card
                key={inquiry._id}
                className="cursor-pointer hover:shadow-sm transition-shadow border-zinc-200 dark:border-zinc-800"
                onClick={() => navigate("/admin/inquiries")}
              >
                <CardContent className="py-4 flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
                        {inquiry.name}
                      </p>
                      <Badge
                        variant="outline"
                        className="text-[10px] bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800"
                      >
                        new
                      </Badge>
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5 truncate max-w-md">
                      {inquiry.email} · {inquiry.message?.slice(0, 80)}...
                    </p>
                  </div>
                  <p className="text-xs text-zinc-400 flex-shrink-0">
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
