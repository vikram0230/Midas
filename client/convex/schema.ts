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
        account_owner: v.optional(v.string()), // Account owner information
        amount: v.number(), // Transaction amount
        category: v.string(), // Transaction category (e.g., "Food and Drink")
        category_id: v.optional(v.number()), // Category identifier
        check_number: v.optional(v.string()), // Check number if applicable
        counterparty_confidence_level: v.optional(v.string()), // Confidence level for counterparty identification
        counterparty_entity_id: v.optional(v.string()), // Entity ID for counterparty
        counterparty_logo_url: v.optional(v.string()), // Logo URL for counterparty
        counterparty_name: v.optional(v.string()), // Name of counterparty
        counterparty_phone_number: v.optional(v.string()), // Phone number of counterparty
        counterparty_type: v.optional(v.string()), // Type of counterparty
        counterparty_website: v.optional(v.string()), // Website of counterparty
        date: v.string(), // Transaction date
        datetime: v.optional(v.string()), // Transaction datetime with time component
        iso_currency_code: v.string(), // ISO currency code (e.g., "USD")
        location_address: v.optional(v.string()), // Location address
        location_city: v.optional(v.string()), // Location city
        location_country: v.optional(v.string()), // Location country
        location_lat: v.optional(v.number()), // Location latitude
        location_lon: v.optional(v.number()), // Location longitude
        location_postal_code: v.optional(v.string()), // Location postal code
        location_region: v.optional(v.string()), // Location region/state
        location_store_number: v.optional(v.number()), // Store number
        logo_url: v.optional(v.string()), // Logo URL
        merchant_entity_id: v.optional(v.string()), // Merchant entity ID
        merchant_name: v.optional(v.string()), // Merchant name
        name: v.optional(v.string()), // Transaction name
        payment_channel: v.optional(v.string()), // Payment channel (e.g., "online", "in store")
        payment_meta_by_order_of: v.optional(v.string()), // Payment metadata: by order of
        payment_meta_payee: v.optional(v.string()), // Payment metadata: payee
        payment_meta_payer: v.optional(v.string()), // Payment metadata: payer
        payment_meta_payment_method: v.optional(v.string()), // Payment metadata: payment method
        payment_meta_payment_processor: v.optional(v.string()), // Payment metadata: payment processor
        payment_meta_ppd_id: v.optional(v.string()), // Payment metadata: PPD ID
        payment_meta_reason: v.optional(v.string()), // Payment metadata: reason
        payment_meta_reference_number: v.optional(v.string()), // Payment metadata: reference number
        pending: v.union(v.boolean(), v.string()), // Whether transaction is pending
        pending_transaction_id: v.optional(v.string()), // ID of pending transaction
        personal_finance_category_confidence_level: v.optional(v.string()), // Confidence level for personal finance category
        personal_finance_category_detailed: v.optional(v.string()), // Detailed personal finance category
        personal_finance_category_primary: v.optional(v.string()), // Primary personal finance category
        personal_finance_category_icon_url: v.optional(v.string()), // Icon URL for personal finance category
        transaction_code: v.optional(v.string()), // Transaction code
        transaction_type: v.optional(v.string()), // Transaction type
        unauthorized_date: v.optional(v.string()), // Date transaction was authorized
        unofficial_currency_code: v.optional(v.string()), // Optional unofficial currency code
        website: v.optional(v.string()), // Website associated with transaction
        userId: v.optional(v.string()), // User ID associated with transaction
    }).index("by_user", ["userId"]).index("by_transaction_id", ["transaction_id"]),
})