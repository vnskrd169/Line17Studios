import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
import { Users, Trash2, Loader2, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function AdminUsers() {
  const users = useQuery(api.cms.listUsers);
  const updateUserRole = useMutation(api.cms.updateUserRole);
  const deleteUser = useMutation(api.cms.deleteUser);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, role: string) => {
    setRoleLoading(userId);
    try {
      await updateUserRole({ userId: userId as any, role: role as any });
      toast.success("User role updated");
    } catch (err: any) {
      toast.error(err.message || "Failed to update role");
    } finally {
      setRoleLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteUser({ userId: deleteId as any });
      toast.success("User deleted");
      setDeleteId(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Users</h1>
        <p className="text-sm text-zinc-500 mt-1">Manage user accounts and roles.</p>
      </div>

      {users === undefined ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-zinc-400" /></div>
      ) : users.length === 0 ? (
        <Card className="border-dashed border-zinc-300 dark:border-zinc-700">
          <CardContent className="py-12 text-center">
            <Users className="mx-auto h-8 w-8 text-zinc-300 dark:text-zinc-600" />
            <p className="mt-2 text-sm text-zinc-500">No users found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {users.map((user: any) => (
            <Card key={user._id} className="border-zinc-200 dark:border-zinc-800">
              <CardContent className="py-4 flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                        {(user.email || "?").charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
                          {user.name || user.email?.split("@")[0] || "Anonymous"}
                        </p>
                        <Badge
                          variant={user.role === "admin" ? "default" : "secondary"}
                          className="text-[10px]"
                        >
                          {user.role || "user"}
                        </Badge>
                        {user.isAnonymous && (
                          <Badge variant="outline" className="text-[10px] text-zinc-400">Guest</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5">
                        {user.email ? (
                          <>
                            <Mail className="h-3 w-3" />
                            <span>{user.email}</span>
                          </>
                        ) : (
                          <span className="italic">No email</span>
                        )}
                        {user.emailVerificationTime && (
                          <span className="text-emerald-500 flex items-center gap-1">
                            <ShieldCheck className="h-3 w-3" /> Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                  <Select
                    value={user.role || "user"}
                    onValueChange={(v) => handleRoleChange(user._id, v)}
                    disabled={roleLoading === user._id}
                  >
                    <SelectTrigger className="w-28 h-8 text-xs">
                      {roleLoading === user._id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <SelectValue />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                  {user.role !== "admin" && (
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(user._id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
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
