import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

/**
 * Get all transactions for a specific user
 */
export const getTransactionsByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    // Get user to find their accountId
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();
    
    // If user doesn't have an accountId, return empty array
    if (!user || !user.accountId) {
      return [];
    }

    // Use accountId to fetch transactions
    return await ctx.db
      .query("transactions")
      .filter((q) => q.eq(q.field("account_id"), user.accountId))
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
 * Get transactions by account ID
 */
export const getTransactionsByAccountId = query({
  args: { accountId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("transactions")
      .filter((q) => q.eq(q.field("account_id"), args.accountId))
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
    account_owner: v.optional(v.string()),
    amount: v.number(),
    category: v.string(),
    category_id: v.optional(v.number()),
    check_number: v.optional(v.string()),
    counterparty_confidence_level: v.optional(v.string()),
    counterparty_entity_id: v.optional(v.string()),
    counterparty_logo_url: v.optional(v.string()),
    counterparty_name: v.optional(v.string()),
    counterparty_phone_number: v.optional(v.string()),
    counterparty_type: v.optional(v.string()),
    counterparty_website: v.optional(v.string()),
    date: v.string(),
    datetime: v.optional(v.string()),
    iso_currency_code: v.string(),
    location_address: v.optional(v.string()),
    location_city: v.optional(v.string()),
    location_country: v.optional(v.string()),
    location_lat: v.optional(v.number()),
    location_lon: v.optional(v.number()),
    location_postal_code: v.optional(v.string()),
    location_region: v.optional(v.string()),
    location_store_number: v.optional(v.number()),
    logo_url: v.optional(v.string()),
    merchant_entity_id: v.optional(v.string()),
    merchant_name: v.optional(v.string()),
    name: v.optional(v.string()),
    payment_channel: v.optional(v.string()),
    payment_meta_by_order_of: v.optional(v.string()),
    payment_meta_payee: v.optional(v.string()),
    payment_meta_payer: v.optional(v.string()),
    payment_meta_payment_method: v.optional(v.string()),
    payment_meta_payment_processor: v.optional(v.string()),
    payment_meta_ppd_id: v.optional(v.string()),
    payment_meta_reason: v.optional(v.string()),
    payment_meta_reference_number: v.optional(v.string()),
    pending: v.union(v.boolean(), v.string()),
    pending_transaction_id: v.optional(v.string()),
    personal_finance_category_confidence_level: v.optional(v.string()),
    personal_finance_category_detailed: v.optional(v.string()),
    personal_finance_category_primary: v.optional(v.string()),
    personal_finance_category_icon_url: v.optional(v.string()),
    transaction_code: v.optional(v.string()),
    transaction_type: v.optional(v.string()),
    unauthorized_date: v.optional(v.string()),
    unofficial_currency_code: v.optional(v.string()),
    website: v.optional(v.string()),
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
