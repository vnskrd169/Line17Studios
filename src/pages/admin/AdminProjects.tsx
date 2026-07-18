import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminProjects() {
  const projects = useQuery(api.cms.listAllProjects);
  const createProject = useMutation(api.cms.createProject);
  const updateProject = useMutation(api.cms.updateProject);
  const deleteProject = useMutation(api.cms.deleteProject);

  const [showDialog, setShowDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    summary: "",
    description: "",
    category: "",
    location: "",
    year: "",
    status: "draft",
    featured: false,
  });

  const openCreate = () => {
    setEditingProject(null);
    setForm({ title: "", slug: "", summary: "", description: "", category: "", location: "", year: "", status: "draft", featured: false });
    setShowDialog(true);
  };

  const openEdit = (project: any) => {
    setEditingProject(project);
    setForm({
      title: project.title || "",
      slug: project.slug || "",
      summary: project.summary || "",
      description: project.description || "",
      category: project.category || "",
      location: project.location || "",
      year: project.year?.toString() || "",
      status: project.status || "draft",
      featured: project.featured || false,
    });
    setShowDialog(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      if (editingProject) {
        await updateProject({
          id: editingProject._id,
          title: form.title,
          slug: form.slug || undefined,
          summary: form.summary || undefined,
          description: form.description || undefined,
          category: form.category || undefined,
          location: form.location || undefined,
          year: form.year ? parseInt(form.year) : undefined,
          status: form.status as any,
          featured: form.featured,
        });
        toast.success("Project updated");
      } else {
        await createProject({
          title: form.title,
          slug: form.slug || undefined,
          summary: form.summary || undefined,
          description: form.description || undefined,
          category: form.category || undefined,
          location: form.location || undefined,
          year: form.year ? parseInt(form.year) : undefined,
          status: form.status as any,
          featured: form.featured,
        });
        toast.success("Project created");
      }
      setShowDialog(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteProject({ id: deleteId as any });
      toast.success("Project deleted");
      setDeleteId(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete project");
    }
  };

  const toggleStatus = async (project: any) => {
    const newStatus = project.status === "published" ? "draft" : "published";
    try {
      await updateProject({ id: project._id, status: newStatus });
      toast.success(newStatus === "published" ? "Project published" : "Project unpublished");
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Projects</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage your portfolio projects.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" /> New Project
        </Button>
      </div>

      {projects === undefined ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
        </div>
      ) : projects.length === 0 ? (
        <Card className="border-dashed border-zinc-300 dark:border-zinc-700">
          <CardContent className="py-12 text-center">
            <p className="text-zinc-500">No projects yet. Create your first project.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {projects.map((project: any) => (
            <Card key={project._id} className="border-zinc-200 dark:border-zinc-800">
              <CardContent className="py-4 flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                      {project.title}
                    </h3>
                    <Badge
                      variant={project.status === "published" ? "default" : "secondary"}
                      className="text-[10px]"
                    >
                      {project.status}
                    </Badge>
                    {project.featured && (
                      <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-300">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 mt-1 truncate max-w-lg">
                    /projects/{project.slug}
                    {project.category && <span className="ml-2">· {project.category}</span>}
                    {project.year && <span className="ml-2">· {project.year}</span>}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0 ml-4">
                  <Button variant="ghost" size="icon" onClick={() => toggleStatus(project)} title="Toggle publish status">
                    {project.status === "published" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(project)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteId(project._id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProject ? "Edit Project" : "New Project"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Project title"
              />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="Auto-generated from title"
              />
            </div>
            <div className="space-y-2">
              <Label>Summary</Label>
              <Textarea
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                placeholder="Brief project summary"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm({ ...form, status: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Input
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="e.g. Residential"
                />
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Input
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  placeholder="e.g. 2024"
                  type="number"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. San Francisco, CA"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="rounded border-zinc-300"
              />
              <Label htmlFor="featured" className="cursor-pointer">Featured project</Label>
            </div>
          </div>
          <div className="flex justify-end gap-3 border-t border-zinc-200 dark:border-zinc-800 pt-4">
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingProject ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
