import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

export const PUBLICATION_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
} as const;

export const publicationStatusValidator = v.union(
  v.literal(PUBLICATION_STATUS.DRAFT),
  v.literal(PUBLICATION_STATUS.PUBLISHED),
  v.literal(PUBLICATION_STATUS.ARCHIVED),
);
export type PublicationStatus = Infer<typeof publicationStatusValidator>;

export const INQUIRY_STATUS = {
  NEW: "new",
  READ: "read",
  REPLIED: "replied",
  ARCHIVED: "archived",
  SPAM: "spam",
} as const;

export const inquiryStatusValidator = v.union(
  v.literal(INQUIRY_STATUS.NEW),
  v.literal(INQUIRY_STATUS.READ),
  v.literal(INQUIRY_STATUS.REPLIED),
  v.literal(INQUIRY_STATUS.ARCHIVED),
  v.literal(INQUIRY_STATUS.SPAM),
);

const schema = defineSchema(
  {
    ...authTables,

    users: defineTable({
      name: v.optional(v.string()),
      image: v.optional(v.string()),
      email: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
      isAnonymous: v.optional(v.boolean()),
      role: v.optional(roleValidator),
    }).index("email", ["email"]),

    projects: defineTable({
      title: v.string(),
      slug: v.string(),
      summary: v.optional(v.string()),
      description: v.optional(v.string()),
      content: v.optional(v.string()),
      category: v.optional(v.string()),
      location: v.optional(v.string()),
      year: v.optional(v.number()),
      status: publicationStatusValidator,
      services: v.optional(v.array(v.string())),
      coverImage: v.optional(v.string()),
      images: v.optional(v.array(v.string())),
      featured: v.optional(v.boolean()),
      sortOrder: v.optional(v.number()),
      seoTitle: v.optional(v.string()),
      seoDescription: v.optional(v.string()),
      tags: v.optional(v.array(v.string())),
      createdBy: v.optional(v.id("users")),
      updatedBy: v.optional(v.id("users")),
    })
      .index("slug", ["slug"])
      .index("status", ["status"])
      .index("featured", ["featured"])
      .index("sortOrder", ["sortOrder"])
      .index("status_sort", ["status", "sortOrder"]),

    services: defineTable({
      title: v.string(),
      slug: v.string(),
      summary: v.optional(v.string()),
      description: v.optional(v.string()),
      content: v.optional(v.string()),
      icon: v.optional(v.string()),
      image: v.optional(v.string()),
      order: v.optional(v.number()),
      status: publicationStatusValidator,
      deliverables: v.optional(v.array(v.string())),
      seoTitle: v.optional(v.string()),
      seoDescription: v.optional(v.string()),
      createdBy: v.optional(v.id("users")),
      updatedBy: v.optional(v.id("users")),
    })
      .index("slug", ["slug"])
      .index("status", ["status"])
      .index("order", ["order"]),

    posts: defineTable({
      title: v.string(),
      slug: v.string(),
      summary: v.optional(v.string()),
      content: v.optional(v.string()),
      coverImage: v.optional(v.string()),
      category: v.optional(v.string()),
      tags: v.optional(v.array(v.string())),
      featured: v.optional(v.boolean()),
      status: publicationStatusValidator,
      publishedAt: v.optional(v.number()),
      seoTitle: v.optional(v.string()),
      seoDescription: v.optional(v.string()),
      createdBy: v.optional(v.id("users")),
      updatedBy: v.optional(v.id("users")),
    })
      .index("slug", ["slug"])
      .index("status", ["status"])
      .index("featured", ["featured"])
      .index("publishedAt", ["publishedAt"]),

    inquiries: defineTable({
      name: v.string(),
      email: v.string(),
      phone: v.optional(v.string()),
      company: v.optional(v.string()),
      projectType: v.optional(v.string()),
      budget: v.optional(v.string()),
      message: v.string(),
      status: inquiryStatusValidator,
      internalNotes: v.optional(v.string()),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
      .index("status", ["status"])
      .index("createdAt", ["createdAt"]),

    settings: defineTable({
      key: v.string(),
      value: v.any(),
      type: v.union(v.literal("public"), v.literal("private"), v.literal("secret")),
    })
      .index("key", ["key"])
      .index("type", ["type"]),

    homepage: defineTable({
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
      updatedBy: v.optional(v.id("users")),
      updatedAt: v.optional(v.number()),
    }),

    media: defineTable({
      storageId: v.id("_storage"),
      url: v.string(),
      filename: v.string(),
      originalName: v.string(),
      mimeType: v.string(),
      size: v.number(),
      width: v.optional(v.number()),
      height: v.optional(v.number()),
      alt: v.optional(v.string()),
      caption: v.optional(v.string()),
      uploadedBy: v.optional(v.id("users")),
      createdAt: v.number(),
    })
      .index("uploadedBy", ["uploadedBy"])
      .index("createdAt", ["createdAt"]),
  },
  {
    schemaValidation: true,
  },
);

export default schema;
