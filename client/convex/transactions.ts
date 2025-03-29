import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

/**
 * Get all transactions for a specific user
 */
export const getTransactionsByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

/**
 * Get a specific transaction by its ID
 */
export const getTransactionById = query({
  args: { transactionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("transactions")
      .withIndex("by_transaction_id", (q) => q.eq("transaction_id", args.transactionId))
      .unique();
  },
});

/**
 * Get transactions for the currently authenticated user
 */
export const getMyTransactions = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the user from the database
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    // Get all transactions for this user
    return await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", user.userId))
      .collect();
  },
});

/**
 * Store a new transaction in the database
 */
export const storeTransaction = mutation({
  args: {
    transaction_id: v.string(),
    account_id: v.string(),
    amount: v.number(),
    iso_currency_code: v.string(),
    unofficial_currency_code: v.optional(v.string()),
    category: v.string(),
    category_id: v.optional(v.number()),
    date: v.string(),
    authorized_date: v.string(),
    location_address: v.optional(v.string()),
    location_city: v.optional(v.string()),
    location_region: v.optional(v.string()),
    location_postal_code: v.optional(v.union(v.string(), v.number())),
    location_country: v.optional(v.string()),
    location_lat: v.optional(v.number()),
    location_lon: v.optional(v.number()),
    name: v.optional(v.string()),
    merchant_name: v.optional(v.string()),
    payment_channel: v.optional(v.string()),
    pending: v.union(v.boolean(), v.string()),
    pending_transaction_id: v.optional(v.string()),
    account_owner: v.optional(v.string()),
    transaction_code: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the user from the database
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    // Check if this transaction already exists
    const existingTransaction = await ctx.db
      .query("transactions")
      .withIndex("by_transaction_id", (q) => q.eq("transaction_id", args.transaction_id))
      .unique();

    if (existingTransaction) {
      throw new Error("Transaction already exists");
    }

    // Insert the new transaction
    return await ctx.db.insert("transactions", {
      ...args,
      userId: user.userId,
    });
  },
});
