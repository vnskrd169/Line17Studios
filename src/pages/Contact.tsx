import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Send, CheckCircle } from "lucide-react";

const PROJECT_TYPES = [
  "Residential",
  "Commercial",
  "Hospitality",
  "Cultural",
  "Master Planning",
  "Interior Design",
  "Renovation",
  "Other",
];

const BUDGET_RANGES = [
  "Under $100K",
  "$100K – $250K",
  "$250K – $500K",
  "$500K – $1M",
  "$1M – $5M",
  "$5M+",
  "Not specified",
];

export default function Contact() {
  const submitInquiry = useMutation(api.cms.submitInquiry);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    projectType: "",
    budget: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await submitInquiry({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        company: form.company || undefined,
        projectType: form.projectType || undefined,
        budget: form.budget || undefined,
        message: form.message,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to send inquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-50 dark:bg-emerald-950 mb-6">
            <CheckCircle className="h-8 w-8 text-emerald-500" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
            Thank You
          </h1>
          <p className="text-zinc-500 text-sm leading-relaxed max-w-md mx-auto">
            Your inquiry has been received. We'll review it and get back to you within 1–2 business days.
          </p>
          <Button
            variant="outline"
            className="mt-8"
            onClick={() => {
              setSuccess(false);
              setForm({ name: "", email: "", phone: "", company: "", projectType: "", budget: "", message: "" });
            }}
          >
            Send another inquiry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        {/* Left: Info */}
        <div>
          <p className="text-xs uppercase tracking-widest text-zinc-400 mb-4">Get in Touch</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-6">
            Let's discuss your project
          </h1>
          <p className="text-sm text-zinc-500 leading-relaxed mb-8">
            Tell us about your project — whether it's a new build, renovation, or interior design. 
            We'll get back to you to discuss how we can help.
          </p>
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1">Email</p>
              <p className="text-zinc-700 dark:text-zinc-300">studio@line17.com</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1">Phone</p>
              <p className="text-zinc-700 dark:text-zinc-300">+1 (555) 123-4567</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1">Studio</p>
              <p className="text-zinc-700 dark:text-zinc-300">123 Architecture Lane<br />San Francisco, CA 94102</p>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  required
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  required
                  className="h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="Company name"
                  className="h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Project Type</Label>
                <Select
                  value={form.projectType}
                  onValueChange={(v) => setForm({ ...form, projectType: v })}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Budget Range</Label>
                <Select
                  value={form.budget}
                  onValueChange={(v) => setForm({ ...form, budget: v })}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    {BUDGET_RANGES.map((range) => (
                      <SelectItem key={range} value={range}>{range}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell us about your project..."
                rows={5}
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/50 px-3 py-2 rounded-md">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full h-11" disabled={submitting}>
              {submitting ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending...</>
              ) : (
                <><Send className="h-4 w-4 mr-2" /> Send Inquiry</>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
