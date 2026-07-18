import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const DEFAULT_SETTINGS = [
  { key: "siteName", label: "Site Name", type: "public" },
  { key: "siteDescription", label: "Site Description", type: "public" },
  { key: "siteEmail", label: "Contact Email", type: "public" },
  { key: "sitePhone", label: "Contact Phone", type: "public" },
  { key: "siteAddress", label: "Address", type: "public" },
  { key: "socialInstagram", label: "Instagram URL", type: "public" },
  { key: "socialTwitter", label: "Twitter/X URL", type: "public" },
  { key: "socialLinkedIn", label: "LinkedIn URL", type: "public" },
  { key: "socialPinterest", label: "Pinterest URL", type: "public" },
  { key: "socialVimeo", label: "Vimeo URL", type: "public" },
  { key: "footerCopyright", label: "Footer Copyright Text", type: "public" },
  { key: "footerDescription", label: "Footer Description", type: "public" },
  { key: "seoGoogleAnalytics", label: "Google Analytics ID", type: "private" },
];

export default function AdminSettings() {
  const allSettings = useQuery(api.cms.getAllSettings);
  const updateSetting = useMutation(api.cms.updateSetting);
  const deleteSetting = useMutation(api.cms.deleteSetting);

  const [saving, setSaving] = useState<string | null>(null);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newType, setNewType] = useState("public");

  const getValue = (key: string): string => {
    if (!allSettings) return "";
    const entry = (allSettings as Record<string, any>)[key];
    return entry?.value !== undefined ? String(entry.value) : "";
  };

  const getType = (key: string): string => {
    if (!allSettings) return "public";
    const entry = (allSettings as Record<string, any>)[key];
    return entry?.type || "public";
  };

  const handleSave = async (key: string, value: string, type: string) => {
    setSaving(key);
    try {
      await updateSetting({ key, value, type: type as any });
      toast.success(`"${key}" updated`);
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(null);
    }
  };

  const handleAddNew = async () => {
    if (!newKey.trim()) { toast.error("Key is required"); return; }
    setSaving("__new__");
    try {
      await updateSetting({ key: newKey.trim(), value: newValue, type: newType as any });
      toast.success(`"${newKey}" added`);
      setNewKey("");
      setNewValue("");
    } catch (err: any) {
      toast.error(err.message || "Failed to add");
    } finally {
      setSaving(null);
    }
  };

  const handleDelete = async (key: string) => {
    try {
      await deleteSetting({ key });
      toast.success(`"${key}" deleted`);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Settings</h1>
        <p className="text-sm text-zinc-500 mt-1">Manage site-wide settings. Public settings are visible to everyone.</p>
      </div>

      {allSettings === undefined ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-zinc-400" /></div>
      ) : (
        <>
          {DEFAULT_SETTINGS.map((setting) => (
            <EditableSetting
              key={setting.key}
              label={setting.label}
              keyName={setting.key}
              value={getValue(setting.key)}
              type={getType(setting.key)}
              defaultType={setting.type}
              saving={saving === setting.key}
              onSave={(value, type) => handleSave(setting.key, value, type)}
            />
          ))}

          {/* Custom settings */}
          {allSettings && Object.keys(allSettings as Record<string, any>)
            .filter((key) => !DEFAULT_SETTINGS.find((s) => s.key === key))
            .map((key) => {
              const entry = (allSettings as Record<string, any>)[key];
              return (
                <EditableSetting
                  key={key}
                  label={key}
                  keyName={key}
                  value={entry?.value !== undefined ? String(entry.value) : ""}
                  type={entry?.type || "public"}
                  defaultType="public"
                  saving={saving === key}
                  onSave={(value, type) => handleSave(key, value, type)}
                  onDelete={() => handleDelete(key)}
                />
              );
            })}

          {/* Add new */}
          <Card className="border-dashed border-zinc-300 dark:border-zinc-700">
            <CardHeader><CardTitle className="text-base">Add Custom Setting</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Key</Label>
                  <Input value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="settingKey" />
                </div>
                <div className="space-y-2">
                  <Label>Value</Label>
                  <Input value={newValue} onChange={(e) => setNewValue(e.target.value)} placeholder="Value" />
                </div>
                <div className="space-y-2">
                  <Label>Visibility</Label>
                  <Select value={newType} onValueChange={setNewType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="secret">Secret</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleAddNew} disabled={saving === "__new__"}>
                {saving === "__new__" ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                Add Setting
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function EditableSetting({
  label,
  keyName,
  value,
  type,
  defaultType,
  saving,
  onSave,
  onDelete,
}: {
  label: string;
  keyName: string;
  value: string;
  type: string;
  defaultType: string;
  saving: boolean;
  onSave: (value: string, type: string) => void;
  onDelete?: () => void;
}) {
  const [editValue, setEditValue] = useState(value);
  const [editType, setEditType] = useState(type);
  const [editing, setEditing] = useState(false);

  return (
    <Card className="border-zinc-200 dark:border-zinc-800">
      <CardContent className="py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{label}</p>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                {keyName}
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                editType === "public"
                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
                  : "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
              }`}>
                {editType}
              </span>
            </div>
            {editing ? (
              <div className="flex items-center gap-2 mt-2">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1 h-8 text-sm"
                />
                <Select value={editType} onValueChange={setEditType}>
                  <SelectTrigger className="w-24 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="secret">Secret</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="sm" variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                <Button size="sm" onClick={() => { onSave(editValue, editType); setEditing(false); }} disabled={saving}>
                  {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate max-w-md">
                  {value || <span className="italic text-zinc-300 dark:text-zinc-600">Not set</span>}
                </p>
                <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => { setEditValue(value); setEditing(true); }}>
                  Edit
                </Button>
                {onDelete && (
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onDelete}>
                    <Trash2 className="h-3 w-3 text-red-400" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
