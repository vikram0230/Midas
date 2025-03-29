import { defineSchema, defineTable } from "convex/server"
import { Infer, v } from "convex/values"

export const INTERVALS = {
    MONTH: "month",
    YEAR: "year",
} as const;

export const intervalValidator = v.union(
    v.literal(INTERVALS.MONTH),
    v.literal(INTERVALS.YEAR),
);

export type Interval = Infer<typeof intervalValidator>;

// Define a price object structure that matches your data
const priceValidator = v.object({
    amount: v.number(),
    polarId: v.string(),
});

// Define a prices object structure for a specific interval
const intervalPricesValidator = v.object({
    usd: priceValidator,
});


export default defineSchema({
    users: defineTable({
        name: v.optional(v.string()),
        image: v.optional(v.string()),
        userId: v.string(),
        accountId: v.optional(v.string()),
        subscription: v.optional(v.string()),
        credits: v.optional(v.string()),
        tokenIdentifier: v.string(),
        createdAt: v.string(),
        weeklyBudget: v.optional(v.number()),
        biweeklyBudget: v.optional(v.number()),
        monthlyBudget: v.optional(v.number()),
        email: v.string(),
    }).index("by_token", ["tokenIdentifier"]),
    
    transactions: defineTable({
        transaction_id: v.string(), // Unique transaction identifier (e.g., "tx0001")
        account_id: v.string(), // Account identifier (e.g., 67890)
        amount: v.number(), // Transaction amount
        iso_currency_code: v.string(), // ISO currency code (e.g., "USD")
        unofficial_currency_code: v.optional(v.string()), // Optional unofficial currency code
        category: v.string(), // Category name (e.g., "Food and Drink")
        category_id: v.optional(v.number()), // Numeric category identifier
        date: v.string(), // Transaction date (stored as ISO string)
        authorized_date: v.string(), // Authorized date
        location_address: v.optional(v.string()), // Address where transaction occurred
        location_city: v.optional(v.string()), // City of the transaction
        location_region: v.optional(v.string()), // Region or state
        location_postal_code: v.optional(v.union(v.string(), v.number())), // Postal code (can be string or number)
        location_country: v.optional(v.string()), // Country code (e.g., "US")
        location_lat: v.optional(v.number()), // Latitude coordinate
        location_lon: v.optional(v.number()), // Longitude coordinate
        name: v.optional(v.string()), // Transaction name (e.g., merchant name)
        merchant_name: v.optional(v.string()), // Official merchant name
        payment_channel: v.optional(v.string()), // Payment channel (e.g., "in store", "online")
        pending: v.union(v.boolean(), v.string()), // Whether the transaction is pending
        pending_transaction_id: v.optional(v.string()), // Identifier for a related pending transaction
        account_owner: v.optional(v.string()), // Account owner information
        transaction_code: v.optional(v.string()), // Additional transaction code
        userId: v.string(), // Foreign key to connect to users table
    })
    .index("by_user", ["userId"]) // Index to efficiently query transactions by user
    .index("by_transaction_id", ["transaction_id"]), // Index for looking up by transaction_id
})