import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

export default function AdminHomepage() {
  const homepage = useQuery(api.cms.getHomepage);
  const updateHomepage = useMutation(api.cms.updateHomepage);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    heroTitle: "",
    heroSubtitle: "",
    heroDescription: "",
    heroImage: "",
    featuredProjectsTitle: "",
    featuredProjectsDescription: "",
    servicesTitle: "",
    servicesDescription: "",
    journalTitle: "",
    journalDescription: "",
    ctaTitle: "",
    ctaDescription: "",
    ctaButtonText: "",
    ctaButtonLink: "",
    seoTitle: "",
    seoDescription: "",
  });

  // Sync form when data loads
  if (homepage && !form.heroTitle && homepage.heroTitle) {
    setForm({
      heroTitle: homepage.heroTitle || "",
      heroSubtitle: homepage.heroSubtitle || "",
      heroDescription: homepage.heroDescription || "",
      heroImage: homepage.heroImage || "",
      featuredProjectsTitle: homepage.featuredProjectsTitle || "",
      featuredProjectsDescription: homepage.featuredProjectsDescription || "",
      servicesTitle: homepage.servicesTitle || "",
      servicesDescription: homepage.servicesDescription || "",
      journalTitle: homepage.journalTitle || "",
      journalDescription: homepage.journalDescription || "",
      ctaTitle: homepage.ctaTitle || "",
      ctaDescription: homepage.ctaDescription || "",
      ctaButtonText: homepage.ctaButtonText || "",
      ctaButtonLink: homepage.ctaButtonLink || "",
      seoTitle: homepage.seoTitle || "",
      seoDescription: homepage.seoDescription || "",
    });
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateHomepage(form);
      toast.success("Homepage updated");
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Homepage</h1>
          <p className="text-sm text-zinc-500 mt-1">Edit the content of your homepage.</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      {/* Hero Section */}
      <Card className="border-zinc-200 dark:border-zinc-800">
        <CardHeader><CardTitle className="text-base">Hero Section</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Hero Title</Label>
            <Input value={form.heroTitle} onChange={(e) => setForm({ ...form, heroTitle: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Hero Subtitle</Label>
            <Input value={form.heroSubtitle} onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Hero Description</Label>
            <Textarea value={form.heroDescription} onChange={(e) => setForm({ ...form, heroDescription: e.target.value })} rows={2} />
          </div>
          <div className="space-y-2">
            <Label>Hero Image URL</Label>
            <Input value={form.heroImage} onChange={(e) => setForm({ ...form, heroImage: e.target.value })} placeholder="https://..." />
          </div>
        </CardContent>
      </Card>

      {/* Featured Projects */}
      <Card className="border-zinc-200 dark:border-zinc-800">
        <CardHeader><CardTitle className="text-base">Featured Projects Section</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Section Title</Label>
            <Input value={form.featuredProjectsTitle} onChange={(e) => setForm({ ...form, featuredProjectsTitle: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Section Description</Label>
            <Textarea value={form.featuredProjectsDescription} onChange={(e) => setForm({ ...form, featuredProjectsDescription: e.target.value })} rows={2} />
          </div>
        </CardContent>
      </Card>

      {/* Services */}
      <Card className="border-zinc-200 dark:border-zinc-800">
        <CardHeader><CardTitle className="text-base">Services Section</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Section Title</Label>
            <Input value={form.servicesTitle} onChange={(e) => setForm({ ...form, servicesTitle: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Section Description</Label>
            <Textarea value={form.servicesDescription} onChange={(e) => setForm({ ...form, servicesDescription: e.target.value })} rows={2} />
          </div>
        </CardContent>
      </Card>

      {/* Journal */}
      <Card className="border-zinc-200 dark:border-zinc-800">
        <CardHeader><CardTitle className="text-base">Journal Section</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Section Title</Label>
            <Input value={form.journalTitle} onChange={(e) => setForm({ ...form, journalTitle: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Section Description</Label>
            <Textarea value={form.journalDescription} onChange={(e) => setForm({ ...form, journalDescription: e.target.value })} rows={2} />
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <Card className="border-zinc-200 dark:border-zinc-800">
        <CardHeader><CardTitle className="text-base">Call to Action</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>CTA Title</Label>
            <Input value={form.ctaTitle} onChange={(e) => setForm({ ...form, ctaTitle: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>CTA Description</Label>
            <Textarea value={form.ctaDescription} onChange={(e) => setForm({ ...form, ctaDescription: e.target.value })} rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Button Text</Label>
              <Input value={form.ctaButtonText} onChange={(e) => setForm({ ...form, ctaButtonText: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Button Link</Label>
              <Input value={form.ctaButtonLink} onChange={(e) => setForm({ ...form, ctaButtonLink: e.target.value })} placeholder="/contact" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO */}
      <Card className="border-zinc-200 dark:border-zinc-800">
        <CardHeader><CardTitle className="text-base">SEO</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>SEO Title</Label>
            <Input value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>SEO Description</Label>
            <Textarea value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} rows={2} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
