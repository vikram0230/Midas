import { mutation } from './_generated/server';
import { v } from 'convex/values';
import fs from 'fs';
import path from 'path';
const csvParse = require('csv-parse/lib/sync');

// This is a one-time script to import transactions from a CSV file
// It should be run from the Convex dashboard or via the CLI

export const importTransactionsFromCSV = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // First check if the user exists and update their accountId if it's not set
    const user = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('userId'), args.userId))
      .first();

    if (!user) {
      throw new Error(`User with ID ${args.userId} not found`);
    }

    // If user doesn't have an accountId, assign one
    if (!user.accountId) {
      await ctx.db.patch(user._id, {
        accountId: args.userId, // Use userId as accountId for simplicity
      });
    }

    const accountId = user.accountId || args.userId;

    // Read the CSV file from the transactions.csv in the client directory
    // In a real app, this would be uploaded by the user or fetched from Plaid
    const csvPath = path.join(process.cwd(), 'transactions.csv');
    const csvContent = await fs.promises.readFile(csvPath, 'utf-8');
    
    // Parse the CSV content
    const records = csvParse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    });

    // Count of transactions imported
    let importedCount = 0;

    // Process each transaction
    for (const record of records) {
      try {
        // Check if transaction already exists
        const existingTransaction = await ctx.db
          .query('transactions')
          .filter((q) => q.eq(q.field('transaction_id'), record.transaction_id))
          .first();

        if (existingTransaction) {
          console.log(`Transaction ${record.transaction_id} already exists, skipping`);
          continue;
        }

        // Create a new transaction with fields that match the schema
        await ctx.db.insert('transactions', {
          transaction_id: record.transaction_id || `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          account_id: accountId,
          amount: parseFloat(record.amount) || 0,
          iso_currency_code: record.iso_currency_code || 'USD',
          unofficial_currency_code: record.unofficial_currency_code || undefined,
          category: record.category || 'Uncategorized',
          category_id: record.category_id || '0',
          date: record.date || new Date().toISOString().split('T')[0],
          authorized_date: record.authorized_date || undefined,
          location_address: record.location_address || undefined,
          location_city: record.location_city || undefined,
          location_region: record.location_region || undefined,
          location_postal_code: record.location_postal_code || undefined,
          location_country: record.location_country || undefined,
          location_lat: record.location_lat ? parseFloat(record.location_lat) : undefined,
          location_lon: record.location_lon ? parseFloat(record.location_lon) : undefined,
          name: record.name || 'Unknown Transaction',
          merchant_name: record.merchant_name || undefined,
          payment_channel: record.payment_channel || 'other',
          pending: record.pending === 'True',
          userId: args.userId,
        });

        importedCount++;
      } catch (error) {
        console.error(`Error importing transaction: ${error}`);
      }
    }

    return {
      success: true,
      importedCount,
      message: `Successfully imported ${importedCount} transactions for user ${args.userId}`,
    };
  },
});

// Function to update existing users with accountId and default budgets
export const updateExistingUsers = mutation({
  handler: async (ctx) => {
    const users = await ctx.db.query('users').collect();
    let updatedCount = 0;

    for (const user of users) {
      // Skip users that already have an accountId
      if (user.accountId) continue;

      // Update user with accountId and default budgets
      await ctx.db.patch(user._id, {
        accountId: user.userId, // Use userId as accountId for simplicity
        weeklyBudget: 500,
        biweeklyBudget: 1000,
        monthlyBudget: 2000,
      });

      updatedCount++;
    }

    return {
      success: true,
      updatedCount,
      message: `Updated ${updatedCount} users with accountId and default budgets`,
    };
  },
});
