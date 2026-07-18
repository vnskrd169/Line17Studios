import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { Mail, Phone, Building, Trash2, Loader2, Eye } from "lucide-react";
import { toast } from "sonner";

const STATUS_COLORS: Record<string, string> = {
  new: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800",
  read: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800",
  replied: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800",
  archived: "bg-zinc-50 text-zinc-500 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-700",
  spam: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800",
};

export default function AdminInquiries() {
  const inquiries = useQuery(api.cms.listInquiries);
  const updateStatus = useMutation(api.cms.updateInquiryStatus);
  const deleteInquiry = useMutation(api.cms.deleteInquiry);

  const [selected, setSelected] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [internalNotes, setInternalNotes] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = (inquiries ?? []).filter((i: any) =>
    statusFilter === "all" ? true : i.status === statusFilter
  );

  const openDetail = (inquiry: any) => {
    setSelected(inquiry);
    setInternalNotes(inquiry.internalNotes || "");
  };

  const handleStatusChange = async (status: string) => {
    if (!selected) return;
    try {
      await updateStatus({ id: selected._id, status: status as any, internalNotes: internalNotes || undefined });
      toast.success("Status updated");
      setSelected({ ...selected, status, internalNotes });
    } catch (err: any) {
      toast.error(err.message || "Failed to update");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteInquiry({ id: deleteId as any });
      toast.success("Inquiry deleted");
      setDeleteId(null);
      if (selected?._id === deleteId) setSelected(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Inquiries</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage contact form submissions.</p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="read">Read</SelectItem>
            <SelectItem value="replied">Replied</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
            <SelectItem value="spam">Spam</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {inquiries === undefined ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-zinc-400" /></div>
      ) : filtered.length === 0 ? (
        <Card className="border-dashed border-zinc-300 dark:border-zinc-700">
          <CardContent className="py-12 text-center">
            <Mail className="mx-auto h-8 w-8 text-zinc-300 dark:text-zinc-600" />
            <p className="mt-2 text-sm text-zinc-500">No inquiries found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* List */}
          <div className="space-y-3">
            {filtered.slice(0, 50).map((inquiry: any) => (
              <Card
                key={inquiry._id}
                className={`cursor-pointer hover:shadow-sm transition-shadow border-zinc-200 dark:border-zinc-800 ${
                  selected?._id === inquiry._id ? "ring-2 ring-zinc-900 dark:ring-zinc-100" : ""
                }`}
                onClick={() => openDetail(inquiry)}
              >
                <CardContent className="py-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate">{inquiry.name}</p>
                      <Badge className={`text-[10px] ${STATUS_COLORS[inquiry.status] || ""}`}>{inquiry.status}</Badge>
                    </div>
                    <p className="text-[10px] text-zinc-400 flex-shrink-0 ml-2">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-xs text-zinc-500 truncate">{inquiry.email}</p>
                  <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{inquiry.message}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detail */}
          <div>
            {selected ? (
              <Card className="border-zinc-200 dark:border-zinc-800 sticky top-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{selected.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Select value={selected.status} onValueChange={handleStatusChange}>
                        <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="read">Read</SelectItem>
                          <SelectItem value="replied">Replied</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                          <SelectItem value="spam">Spam</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(selected._id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-zinc-400" />
                      <a href={`mailto:${selected.email}`} className="text-blue-600 hover:underline">{selected.email}</a>
                    </div>
                    {selected.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-zinc-400" />
                        <a href={`tel:${selected.phone}`} className="text-blue-600 hover:underline">{selected.phone}</a>
                      </div>
                    )}
                    {selected.company && (
                      <div className="flex items-center gap-2 text-sm">
                        <Building className="h-4 w-4 text-zinc-400" />
                        <span>{selected.company}</span>
                      </div>
                    )}
                    {selected.projectType && (
                      <p className="text-sm"><span className="text-zinc-500">Project type:</span> {selected.projectType}</p>
                    )}
                    {selected.budget && (
                      <p className="text-sm"><span className="text-zinc-500">Budget:</span> {selected.budget}</p>
                    )}
                    <p className="text-[10px] text-zinc-400">
                      Received {new Date(selected.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
                    <p className="text-sm font-medium mb-2">Message</p>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">{selected.message}</p>
                  </div>

                  <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 space-y-2">
                    <Label>Internal Notes</Label>
                    <Textarea
                      value={internalNotes}
                      onChange={(e) => setInternalNotes(e.target.value)}
                      rows={3}
                      placeholder="Add internal notes..."
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(selected.status)}
                      disabled={internalNotes === (selected.internalNotes || "")}
                    >
                      Save Notes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-dashed border-zinc-300 dark:border-zinc-700">
                <CardContent className="py-12 text-center">
                  <Eye className="mx-auto h-8 w-8 text-zinc-300 dark:text-zinc-600" />
                  <p className="mt-2 text-sm text-zinc-500">Select an inquiry to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Inquiry</AlertDialogTitle>
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
