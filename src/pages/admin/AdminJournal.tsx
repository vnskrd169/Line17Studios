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
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminJournal() {
  const posts = useQuery(api.cms.listAllPosts);
  const createPost = useMutation(api.cms.createPost);
  const updatePost = useMutation(api.cms.updatePost);
  const deletePost = useMutation(api.cms.deletePost);

  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    summary: "",
    content: "",
    category: "",
    status: "draft",
    featured: false,
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ title: "", slug: "", summary: "", content: "", category: "", status: "draft", featured: false });
    setShowDialog(true);
  };

  const openEdit = (item: any) => {
    setEditing(item);
    setForm({
      title: item.title || "",
      slug: item.slug || "",
      summary: item.summary || "",
      content: item.content || "",
      category: item.category || "",
      status: item.status || "draft",
      featured: item.featured || false,
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
        content: form.content || undefined,
        category: form.category || undefined,
        status: form.status as any,
        featured: form.featured,
      };
      if (editing) {
        await updatePost({ id: editing._id, ...data });
        toast.success("Post updated");
      } else {
        await createPost(data);
        toast.success("Post created");
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
      await deletePost({ id: deleteId as any });
      toast.success("Post deleted");
      setDeleteId(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    }
  };

  const toggleStatus = async (post: any) => {
    const newStatus = post.status === "published" ? "draft" : "published";
    try {
      await updatePost({ id: post._id, status: newStatus });
      toast.success(newStatus === "published" ? "Post published" : "Post unpublished");
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Journal</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage journal posts and articles.</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" /> New Post</Button>
      </div>

      {posts === undefined ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-zinc-400" /></div>
      ) : posts.length === 0 ? (
        <Card className="border-dashed border-zinc-300 dark:border-zinc-700">
          <CardContent className="py-12 text-center">
            <p className="text-zinc-500">No posts yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {posts.map((post: any) => (
            <Card key={post._id} className="border-zinc-200 dark:border-zinc-800">
              <CardContent className="py-4 flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium text-zinc-900 dark:text-zinc-100 truncate">{post.title}</h3>
                    <Badge variant={post.status === "published" ? "default" : "secondary"} className="text-[10px]">
                      {post.status}
                    </Badge>
                    {post.featured && (
                      <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-300">Featured</Badge>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 mt-1 truncate max-w-lg">{post.summary}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0 ml-4">
                  <Button variant="ghost" size="icon" onClick={() => toggleStatus(post)}>
                    {post.status === "published" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(post)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteId(post._id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Post" : "New Post"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Post title" />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="Auto-generated" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Design" />
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
              <Label>Summary</Label>
              <Textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Content (HTML)</Label>
              <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={8} placeholder="Article content as HTML..." />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="featured" checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="rounded border-zinc-300" />
              <Label htmlFor="featured" className="cursor-pointer">Featured post</Label>
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
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
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
