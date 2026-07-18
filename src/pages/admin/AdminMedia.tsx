import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
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
import { Upload, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

export default function AdminMedia() {
  const media = useQuery(api.cms.listMedia);
  const generateUploadUrl = useMutation(api.cms.generateUploadUrl);
  const saveMedia = useMutation(api.cms.saveMedia);
  const deleteMedia = useMutation(api.cms.deleteMedia);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type)) {
      toast.error("Only JPEG, PNG, WebP, and AVIF images are allowed.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File must be under 10MB.");
      return;
    }

    setUploading(true);
    try {
      // Generate upload URL
      const uploadUrl = await generateUploadUrl();

      // Upload file directly
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!response.ok) throw new Error("Upload failed");

      const { storageId } = await response.json();

      // Get image dimensions
      const dimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);
        const timeout = setTimeout(() => {
          URL.revokeObjectURL(objectUrl);
          reject(new Error("Image load timed out"));
        }, 10000);

        img.onload = () => {
          clearTimeout(timeout);
          URL.revokeObjectURL(objectUrl);
          resolve({ width: img.naturalWidth, height: img.naturalHeight });
        };
        img.onerror = () => {
          clearTimeout(timeout);
          URL.revokeObjectURL(objectUrl);
          reject(new Error("Failed to load image"));
        };
        img.src = objectUrl;
      });

      // Save media metadata
      await saveMedia({
        storageId,
        filename: file.name,
        mimeType: file.type,
        size: file.size,
        width: dimensions.width,
        height: dimensions.height,
      });

      toast.success("File uploaded successfully");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMedia({ id: deleteId as any });
      toast.success("Media deleted");
      setDeleteId(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Media Library</h1>
          <p className="text-sm text-zinc-500 mt-1">Upload and manage images.</p>
        </div>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="hidden"
          />
          <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            {uploading ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading...</>
            ) : (
              <><Upload className="h-4 w-4 mr-2" /> Upload</>
            )}
          </Button>
        </div>
      </div>

      {media === undefined ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-zinc-400" /></div>
      ) : media.length === 0 ? (
        <Card className="border-dashed border-zinc-300 dark:border-zinc-700">
          <CardContent className="py-12 text-center">
            <ImageIcon className="mx-auto h-8 w-8 text-zinc-300 dark:text-zinc-600" />
            <p className="mt-2 text-sm text-zinc-500">No media uploaded yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {media.map((item: any) => (
            <div key={item._id} className="group relative rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
              <div className="aspect-square relative">
                <img
                  src={item.url}
                  alt={item.alt || item.filename}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => setDeleteId(item._id)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-2">
                <p className="text-[10px] text-zinc-500 truncate">{item.filename}</p>
                <p className="text-[10px] text-zinc-400">
                  {item.width}x{item.height} · {(item.size / 1024).toFixed(0)}KB
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Media</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this file? If it's used anywhere on the site, deletion will be blocked.
            </AlertDialogDescription>
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
