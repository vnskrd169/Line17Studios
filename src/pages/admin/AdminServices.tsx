import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminServices() {
  const services = useQuery(api.cms.listAllServices);
  const createService = useMutation(api.cms.createService);
  const updateService = useMutation(api.cms.updateService);
  const deleteService = useMutation(api.cms.deleteService);

  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    summary: "",
    description: "",
    order: "",
    status: "draft",
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ title: "", slug: "", summary: "", description: "", order: "", status: "draft" });
    setShowDialog(true);
  };

  const openEdit = (item: any) => {
    setEditing(item);
    setForm({
      title: item.title || "",
      slug: item.slug || "",
      summary: item.summary || "",
      description: item.description || "",
      order: item.order?.toString() || "",
      status: item.status || "draft",
    });
    setShowDialog(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    try {
      const data = {
        title: form.title,
        slug: form.slug || undefined,
        summary: form.summary || undefined,
        description: form.description || undefined,
        order: form.order ? parseInt(form.order) : undefined,
        status: form.status as any,
      };
      if (editing) {
        await updateService({ id: editing._id, ...data });
        toast.success("Service updated");
      } else {
        await createService(data);
        toast.success("Service created");
      }
      setShowDialog(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteService({ id: deleteId as any });
      toast.success("Service deleted");
      setDeleteId(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Services</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage your service offerings.</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" /> New Service</Button>
      </div>

      {services === undefined ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-zinc-400" /></div>
      ) : services.length === 0 ? (
        <Card className="border-dashed border-zinc-300 dark:border-zinc-700">
          <CardContent className="py-12 text-center">
            <p className="text-zinc-500">No services yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {services.map((service: any) => (
            <Card key={service._id} className="border-zinc-200 dark:border-zinc-800">
              <CardContent className="py-4 flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-400 font-mono">#{service.order || "-"}</span>
                    <h3 className="font-medium text-zinc-900 dark:text-zinc-100 truncate">{service.title}</h3>
                    <Badge variant={service.status === "published" ? "default" : "secondary"} className="text-[10px]">
                      {service.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1 truncate max-w-lg">{service.summary}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0 ml-4">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(service)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteId(service._id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Edit Service" : "New Service"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Service title" />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="Auto-generated" />
            </div>
            <div className="space-y-2">
              <Label>Summary</Label>
              <Textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Display Order</Label>
                <Input value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} type="number" placeholder="1" />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} />
            </div>
          </div>
          <div className="flex justify-end gap-3 border-t border-zinc-200 dark:border-zinc-800 pt-4">
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editing ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
