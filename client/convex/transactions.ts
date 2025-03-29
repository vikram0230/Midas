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
 * Get transaction by ID
 */
export const getTransactionById = query({
  args: { transactionId: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("transactions")
      .filter((q) => q.eq(q.field("transaction_id"), args.transactionId))
      .first();
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
      .withIndex("by_user", (q) => q.eq("userId", user.userId || ""))
      .collect();
  },
});

/**
 * Store a new transaction in the database
 */
export const storeTransaction = mutation({
  args: {
    transaction_id: v.number(),
    account_id: v.string(),
    date: v.string(),
    time: v.optional(v.string()),
    activity: v.optional(v.string()),
    amount: v.number(),
    category: v.string(),
    type: v.optional(v.string()),
    vendor_name: v.optional(v.string()),
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
      .filter((q) => q.eq(q.field("transaction_id"), args.transaction_id))
      .first();

    if (existingTransaction) {
      throw new Error("Transaction already exists");
    }

    // Insert the new transaction
    return await ctx.db.insert("transactions", {
      transaction_id: args.transaction_id,
      account_id: args.account_id,
      date: args.date,
      time: args.time ? args.time.trim() : undefined,
      activity: args.activity ? args.activity.trim() : undefined,
      amount: args.amount,
      category: args.category.trim(),
      type: args.type ? args.type.trim() : undefined,
      vendor_name: args.vendor_name ? args.vendor_name.trim() : undefined,
      userId: user.userId,
    });
  },
});

/**
 * Update all transaction dates to Feb-March 2025
 */
export const updateTransactionDatesToCurrentYear = mutation({
  handler: async (ctx) => {
    // Get all transactions
    const transactions = await ctx.db.query("transactions").collect();
    
    // Current year is 2025
    const currentYear = 2025;
    
    // Update each transaction with a date in Feb-March 2025
    for (const transaction of transactions) {
      const originalDate = new Date(transaction.date);
      
      // Generate a random date between Feb 1, 2025 and March 29, 2025
      const startDate = new Date(2025, 1, 1); // Feb 1, 2025
      const endDate = new Date(2025, 2, 29);  // March 29, 2025
      
      const randomTimestamp = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
      const newDate = new Date(randomTimestamp);
      
      // Format the date as YYYY-MM-DD
      const formattedDate = newDate.toISOString().split('T')[0];
      
      // Update the transaction with the new date
      await ctx.db.patch(transaction._id, { date: formattedDate });
    }
    
    return { success: true, updatedCount: transactions.length };
  },
});
