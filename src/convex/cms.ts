import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { query, mutation, QueryCtx, MutationCtx } from "./_generated/server";
import { ROLES, PUBLICATION_STATUS, INQUIRY_STATUS, publicationStatusValidator, inquiryStatusValidator } from "./schema";

// ─── Authorization Helpers ───────────────────────────────────────────

async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Authentication required.");
  const user = await ctx.db.get(userId);
  if (!user || (user as any).role !== ROLES.ADMIN) {
    throw new Error("Admin access required.");
  }
  return userId;
}

async function requireAuthenticated(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Authentication required.");
  return userId;
}

function normalizeSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// ─── Projects ─────────────────────────────────────────────────────────

export const listPublishedProjects = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("projects")
      .withIndex("status_sort", (q) => q.eq("status", PUBLICATION_STATUS.PUBLISHED))
      .order("desc")
      .collect();
  },
});

export const getPublishedProject = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("slug", (q) => q.eq("slug", args.slug))
      .filter((q) => q.eq(q.field("status"), PUBLICATION_STATUS.PUBLISHED))
      .collect();
    return projects[0] ?? null;
  },
});

export const listFeaturedProjects = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("projects")
      .withIndex("featured", (q) => q.eq("featured", true))
      .filter((q) => q.eq(q.field("status"), PUBLICATION_STATUS.PUBLISHED))
      .collect();
  },
});

export const listAllProjects = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db.query("projects").order("desc").collect();
  },
});

export const getProject = query({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.get(args.id);
  },
});

export const getProjectBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const projects = await ctx.db
      .query("projects")
      .withIndex("slug", (q) => q.eq("slug", args.slug))
      .collect();
    return projects[0] ?? null;
  },
});

export const createProject = mutation({
  args: {
    title: v.string(),
    slug: v.optional(v.string()),
    summary: v.optional(v.string()),
    description: v.optional(v.string()),
    content: v.optional(v.string()),
    category: v.optional(v.string()),
    location: v.optional(v.string()),
    year: v.optional(v.number()),
    services: v.optional(v.array(v.string())),
    coverImage: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    featured: v.optional(v.boolean()),
    sortOrder: v.optional(v.number()),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    status: publicationStatusValidator,
  },
  handler: async (ctx, args) => {
    const userId = await requireAdmin(ctx);

    // Build a guaranteed-non-null slug
    const rawSlug = args.slug !== undefined ? args.slug : normalizeSlug(args.title);

    // Ensure unique slug
    const existing = await ctx.db
      .query("projects")
      .withIndex("slug", (q) => q.eq("slug", rawSlug))
      .collect();
    const slug = existing.length > 0 ? `${rawSlug}-${Date.now()}` : rawSlug;

    return await ctx.db.insert("projects", {
      ...args,
      slug,
      createdBy: userId,
      updatedBy: userId,
    });
  },
});

export const updateProject = mutation({
  args: {
    id: v.id("projects"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    summary: v.optional(v.string()),
    description: v.optional(v.string()),
    content: v.optional(v.string()),
    category: v.optional(v.string()),
    location: v.optional(v.string()),
    year: v.optional(v.number()),
    services: v.optional(v.array(v.string())),
    coverImage: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    featured: v.optional(v.boolean()),
    sortOrder: v.optional(v.number()),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    status: v.optional(publicationStatusValidator),
  },
  handler: async (ctx, args) => {
    const userId = await requireAdmin(ctx);
    const { id, ...fields } = args;

    const patchFields: Record<string, unknown> = { ...fields, updatedBy: userId };

    if (fields.slug !== undefined) {
      const rawSlug: string = fields.slug;
      const existing = await ctx.db
        .query("projects")
        .withIndex("slug", (q) => q.eq("slug", rawSlug))
        .collect();
      if (existing.length > 0 && existing[0]._id !== id) {
        patchFields.slug = `${rawSlug}-${Date.now()}`;
      } else {
        patchFields.slug = rawSlug;
      }
    }

    await ctx.db.patch(id, patchFields);
    return { success: true };
  },
});

export const deleteProject = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// ─── Services ─────────────────────────────────────────────────────────

export const listPublishedServices = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("services")
      .withIndex("status", (q) => q.eq("status", PUBLICATION_STATUS.PUBLISHED))
      .order("asc")
      .collect();
  },
});

export const getPublishedService = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const services = await ctx.db
      .query("services")
      .withIndex("slug", (q) => q.eq("slug", args.slug))
      .filter((q) => q.eq(q.field("status"), PUBLICATION_STATUS.PUBLISHED))
      .collect();
    return services[0] ?? null;
  },
});

export const listAllServices = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db.query("services").order("asc").collect();
  },
});

export const getService = query({
  args: { id: v.id("services") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.get(args.id);
  },
});

export const createService = mutation({
  args: {
    title: v.string(),
    slug: v.optional(v.string()),
    summary: v.optional(v.string()),
    description: v.optional(v.string()),
    content: v.optional(v.string()),
    icon: v.optional(v.string()),
    image: v.optional(v.string()),
    order: v.optional(v.number()),
    deliverables: v.optional(v.array(v.string())),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    status: publicationStatusValidator,
  },
  handler: async (ctx, args) => {
    const userId = await requireAdmin(ctx);
    const rawSlug = args.slug !== undefined ? args.slug : normalizeSlug(args.title);

    const existing = await ctx.db
      .query("services")
      .withIndex("slug", (q) => q.eq("slug", rawSlug))
      .collect();
    const slug = existing.length > 0 ? `${rawSlug}-${Date.now()}` : rawSlug;

    return await ctx.db.insert("services", {
      ...args,
      slug,
      createdBy: userId,
      updatedBy: userId,
    });
  },
});

export const updateService = mutation({
  args: {
    id: v.id("services"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    summary: v.optional(v.string()),
    description: v.optional(v.string()),
    content: v.optional(v.string()),
    icon: v.optional(v.string()),
    image: v.optional(v.string()),
    order: v.optional(v.number()),
    deliverables: v.optional(v.array(v.string())),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    status: v.optional(publicationStatusValidator),
  },
  handler: async (ctx, args) => {
    const userId = await requireAdmin(ctx);
    const { id, ...fields } = args;

    const patchFields: Record<string, unknown> = { ...fields, updatedBy: userId };

    if (fields.slug !== undefined) {
      const rawSlug: string = fields.slug;
      const existing = await ctx.db
        .query("services")
        .withIndex("slug", (q) => q.eq("slug", rawSlug))
        .collect();
      if (existing.length > 0 && existing[0]._id !== id) {
        patchFields.slug = `${rawSlug}-${Date.now()}`;
      } else {
        patchFields.slug = rawSlug;
      }
    }

    await ctx.db.patch(id, patchFields);
    return { success: true };
  },
});

export const deleteService = mutation({
  args: { id: v.id("services") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// ─── Journal / Posts ──────────────────────────────────────────────────

export const listPublishedPosts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("posts")
      .withIndex("status", (q) => q.eq("status", PUBLICATION_STATUS.PUBLISHED))
      .order("desc")
      .collect();
  },
});

export const getPublishedPost = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("slug", (q) => q.eq("slug", args.slug))
      .filter((q) => q.eq(q.field("status"), PUBLICATION_STATUS.PUBLISHED))
      .collect();
    return posts[0] ?? null;
  },
});

export const listAllPosts = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db.query("posts").order("desc").collect();
  },
});

export const getPost = query({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.get(args.id);
  },
});

export const createPost = mutation({
  args: {
    title: v.string(),
    slug: v.optional(v.string()),
    summary: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    featured: v.optional(v.boolean()),
    status: publicationStatusValidator,
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAdmin(ctx);
    const rawSlug = args.slug !== undefined ? args.slug : normalizeSlug(args.title);

    const existing = await ctx.db
      .query("posts")
      .withIndex("slug", (q) => q.eq("slug", rawSlug))
      .collect();
    const slug = existing.length > 0 ? `${rawSlug}-${Date.now()}` : rawSlug;

    return await ctx.db.insert("posts", {
      ...args,
      slug,
      publishedAt: args.status === PUBLICATION_STATUS.PUBLISHED ? Date.now() : undefined,
      createdBy: userId,
      updatedBy: userId,
    });
  },
});

export const updatePost = mutation({
  args: {
    id: v.id("posts"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    summary: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    featured: v.optional(v.boolean()),
    status: v.optional(publicationStatusValidator),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAdmin(ctx);
    const { id, ...fields } = args;

    const patchFields: Record<string, unknown> = { ...fields, updatedBy: userId };

    if (fields.slug !== undefined) {
      const rawSlug: string = fields.slug;
      const existing = await ctx.db
        .query("posts")
        .withIndex("slug", (q) => q.eq("slug", rawSlug))
        .collect();
      if (existing.length > 0 && existing[0]._id !== id) {
        patchFields.slug = `${rawSlug}-${Date.now()}`;
      } else {
        patchFields.slug = rawSlug;
      }
    }

    // Set publish timestamp when transitioning to published
    if (fields.status === PUBLICATION_STATUS.PUBLISHED) {
      const existing = await ctx.db.get(id);
      if (existing && !(existing as any).publishedAt) {
        patchFields.publishedAt = Date.now();
      }
    }

    await ctx.db.patch(id, patchFields);
    return { success: true };
  },
});

export const deletePost = mutation({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// ─── Inquiries ────────────────────────────────────────────────────────

export const submitInquiry = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    projectType: v.optional(v.string()),
    budget: v.optional(v.string()),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.name.length < 2 || args.name.length > 100) {
      throw new Error("Name must be between 2 and 100 characters.");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(args.email)) {
      throw new Error("Invalid email address.");
    }
    if (args.message.length < 10 || args.message.length > 5000) {
      throw new Error("Message must be between 10 and 5000 characters.");
    }
    if (args.phone && args.phone.length > 30) {
      throw new Error("Phone number is too long.");
    }
    if (args.company && args.company.length > 200) {
      throw new Error("Company name is too long.");
    }

    const now = Date.now();

    const id = await ctx.db.insert("inquiries", {
      name: args.name.trim(),
      email: args.email.trim().toLowerCase(),
      phone: args.phone?.trim(),
      company: args.company?.trim(),
      projectType: args.projectType,
      budget: args.budget,
      message: args.message.trim(),
      status: INQUIRY_STATUS.NEW,
      createdAt: now,
      updatedAt: now,
    });

    return { success: true, id };
  },
});

export const listInquiries = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db.query("inquiries").order("desc").collect();
  },
});

export const getInquiry = query({
  args: { id: v.id("inquiries") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.get(args.id);
  },
});

export const updateInquiryStatus = mutation({
  args: {
    id: v.id("inquiries"),
    status: inquiryStatusValidator,
    internalNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, {
      status: args.status,
      internalNotes: args.internalNotes,
      updatedAt: Date.now(),
    });
    return { success: true };
  },
});

export const deleteInquiry = mutation({
  args: { id: v.id("inquiries") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// ─── Media ────────────────────────────────────────────────────────────

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const saveMedia = mutation({
  args: {
    storageId: v.id("_storage"),
    filename: v.string(),
    mimeType: v.string(),
    size: v.number(),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    alt: v.optional(v.string()),
    caption: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAdmin(ctx);

    if (!ALLOWED_IMAGE_TYPES.includes(args.mimeType)) {
      throw new Error(`File type ${args.mimeType} is not allowed. Allowed: JPEG, PNG, WebP, AVIF`);
    }

    if (args.size > MAX_FILE_SIZE) {
      throw new Error(`File is too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
    }

    const url = await ctx.storage.getUrl(args.storageId);
    if (!url) {
      throw new Error("Failed to get URL for uploaded file.");
    }

    const id = await ctx.db.insert("media", {
      storageId: args.storageId,
      url,
      filename: args.filename.replace(/[^a-zA-Z0-9._-]/g, "_"),
      originalName: args.filename,
      mimeType: args.mimeType,
      size: args.size,
      width: args.width,
      height: args.height,
      alt: args.alt,
      caption: args.caption,
      uploadedBy: userId,
      createdAt: Date.now(),
    });

    return { success: true, id, url };
  },
});

export const listMedia = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db.query("media").order("desc").collect();
  },
});

export const getMedia = query({
  args: { id: v.id("media") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.get(args.id);
  },
});

export const deleteMedia = mutation({
  args: { id: v.id("media") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const media = await ctx.db.get(args.id);
    if (!media) throw new Error("Media not found.");

    const mediaDoc = media as any;

    const projects = await ctx.db.query("projects").collect();
    for (const project of projects) {
      const p = project as any;
      if (p.coverImage === mediaDoc.url) {
        throw new Error("Cannot delete: This image is used as a cover image on a project.");
      }
      if (p.images?.includes(mediaDoc.url)) {
        throw new Error("Cannot delete: This image is used in a project gallery.");
      }
    }

    const posts = await ctx.db.query("posts").collect();
    for (const post of posts) {
      const p = post as any;
      if (p.coverImage === mediaDoc.url) {
        throw new Error("Cannot delete: This image is used as a cover image on a journal post.");
      }
    }

    const homepage = await ctx.db.query("homepage").collect();
    for (const h of homepage) {
      const hpage = h as any;
      if (hpage.heroImage === mediaDoc.url) {
        throw new Error("Cannot delete: This image is used on the homepage.");
      }
    }

    await ctx.storage.delete(mediaDoc.storageId);
    await ctx.db.delete(args.id);

    return { success: true };
  },
});

// ─── Homepage ─────────────────────────────────────────────────────────

export const getHomepage = query({
  args: {},
  handler: async (ctx) => {
    const homepage = await ctx.db.query("homepage").collect();
    return homepage[0] ?? null;
  },
});

export const updateHomepage = mutation({
  args: {
    heroTitle: v.optional(v.string()),
    heroSubtitle: v.optional(v.string()),
    heroDescription: v.optional(v.string()),
    heroImage: v.optional(v.string()),
    featuredProjectsTitle: v.optional(v.string()),
    featuredProjectsDescription: v.optional(v.string()),
    servicesTitle: v.optional(v.string()),
    servicesDescription: v.optional(v.string()),
    journalTitle: v.optional(v.string()),
    journalDescription: v.optional(v.string()),
    ctaTitle: v.optional(v.string()),
    ctaDescription: v.optional(v.string()),
    ctaButtonText: v.optional(v.string()),
    ctaButtonLink: v.optional(v.string()),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAdmin(ctx);
    const homepage = await ctx.db.query("homepage").collect();

    const data: Record<string, unknown> = {
      ...args,
      updatedBy: userId,
      updatedAt: Date.now(),
    };

    if (homepage.length === 0) {
      await ctx.db.insert("homepage", data);
    } else {
      await ctx.db.patch(homepage[0]._id, data);
    }

    return { success: true };
  },
});

// ─── Settings ─────────────────────────────────────────────────────────

export const getPublicSettings = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db
      .query("settings")
      .withIndex("type", (q) => q.eq("type", "public"))
      .collect();

    const result: Record<string, unknown> = {};
    for (const s of settings) {
      result[s.key] = s.value;
    }
    return result;
  },
});

export const getAllSettings = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const settings = await ctx.db.query("settings").collect();
    const result: Record<string, unknown> = {};
    for (const s of settings) {
      result[s.key] = { value: s.value, type: s.type };
    }
    return result;
  },
});

export const updateSetting = mutation({
  args: {
    key: v.string(),
    value: v.any(),
    type: v.union(v.literal("public"), v.literal("private"), v.literal("secret")),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const existing = await ctx.db
      .query("settings")
      .withIndex("key", (q) => q.eq("key", args.key))
      .collect();

    if (existing.length > 0) {
      await ctx.db.patch(existing[0]._id, {
        value: args.value,
        type: args.type,
      });
    } else {
      await ctx.db.insert("settings", {
        key: args.key,
        value: args.value,
        type: args.type,
      });
    }

    return { success: true };
  },
});

export const deleteSetting = mutation({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const existing = await ctx.db
      .query("settings")
      .withIndex("key", (q) => q.eq("key", args.key))
      .collect();
    for (const s of existing) {
      await ctx.db.delete(s._id);
    }
    return { success: true };
  },
});

// ─── Users ────────────────────────────────────────────────────────────

export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db.query("users").collect();
  },
});

export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("user"), v.literal("member")),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.userId, { role: args.role });
    return { success: true };
  },
});

export const deleteUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const currentUserId = await getAuthUserId(ctx);
    if (currentUserId === args.userId) {
      throw new Error("Cannot delete your own account.");
    }
    await ctx.db.delete(args.userId);
    return { success: true };
  },
});

// ─── Dashboard Stats ─────────────────────────────────────────────────

export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const projects = await ctx.db.query("projects").collect();
    const posts = await ctx.db.query("posts").collect();
    const services = await ctx.db.query("services").collect();
    const inquiries = await ctx.db.query("inquiries").collect();
    const media = await ctx.db.query("media").collect();
    const users = await ctx.db.query("users").collect();

    return {
      totalProjects: projects.length,
      publishedProjects: projects.filter((p) => (p as any).status === PUBLICATION_STATUS.PUBLISHED).length,
      draftProjects: projects.filter((p) => (p as any).status === PUBLICATION_STATUS.DRAFT).length,
      totalPosts: posts.length,
      publishedPosts: posts.filter((p) => (p as any).status === PUBLICATION_STATUS.PUBLISHED).length,
      totalServices: services.length,
      publishedServices: services.filter((s) => (s as any).status === PUBLICATION_STATUS.PUBLISHED).length,
      newInquiries: inquiries.filter((i) => (i as any).status === INQUIRY_STATUS.NEW).length,
      totalInquiries: inquiries.length,
      totalMedia: media.length,
      totalUsers: users.length,
    };
  },
});
