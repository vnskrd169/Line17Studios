import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { ROLES } from "./schema";

/**
 * Bootstrap: promote the current user to admin.
 * Only works if no admin exists yet.
 */
export const bootstrapAdmin = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if any admin exists
    const allUsers = await ctx.db.query("users").collect();
    const existingAdmin = (allUsers as any[]).find((u: any) => u.role === ROLES.ADMIN);

    if (existingAdmin) {
      return {
        success: false,
        message:
          "An admin already exists. Have an existing admin promote you, or use the Convex dashboard to set a user's role to admin.",
      };
    }

    // No admin exists — promote the current user
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return { success: false, message: "You must be signed in first." };
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      return { success: false, message: "User not found." };
    }

    if (!(user as any).email) {
      return { success: false, message: "Please sign in with a valid email first." };
    }

    await ctx.db.patch(userId, { role: ROLES.ADMIN });
    return { success: true, message: `You are now the first admin!` };
  },
});

/**
 * Force-promote a specific user by email (Convex dashboard use only).
 * Only works if no admin exists yet.
 */
export const promoteByEmail = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const allUsers = await ctx.db.query("users").collect();
    const existingAdmin = (allUsers as any[]).find((u: any) => u.role === ROLES.ADMIN);

    if (existingAdmin) {
      return {
        success: false,
        message: "An admin already exists. Use the Convex dashboard to manage roles.",
      };
    }

    const user = (allUsers as any[]).find(
      (u: any) => u.email?.toLowerCase() === args.email.toLowerCase(),
    );

    if (!user) {
      return { success: false, message: `No user found with email ${args.email}.` };
    }

    await ctx.db.patch(user._id, { role: ROLES.ADMIN });
    return { success: true, message: `${args.email} promoted to admin.` };
  },
});
