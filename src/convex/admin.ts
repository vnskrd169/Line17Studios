import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ROLES } from "./schema";

/**
 * Promote the current authenticated user to admin.
 * The user must:
 * 1. Be signed in with a verified email (not anonymous)
 * 2. Have a valid email address
 *
 * Call this from AdminLogin after the user signs in with email OTP.
 */
export const promoteMeToAdmin = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return { success: false, message: "You must be signed in first." };
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      return { success: false, message: "User not found." };
    }

    // Must have a verified email (no anonymous users)
    if (!(user as any).email || (user as any).isAnonymous) {
      return { success: false, message: "Please sign in with your email first." };
    }

    // Already admin
    if ((user as any).role === ROLES.ADMIN) {
      return { success: true, message: "You are already an admin." };
    }

    await ctx.db.patch(userId, { role: ROLES.ADMIN });
    return { success: true, message: "You are now an admin!" };
  },
});

/**
 * Check if the current user is an admin.
 */
export const isAdmin = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;
    const user = await ctx.db.get(userId);
    return (user as any)?.role === ROLES.ADMIN;
  },
});
