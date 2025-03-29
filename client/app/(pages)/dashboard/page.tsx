'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Activity, Code, Star, TrendingUp, Users, Zap } from "lucide-react";
import Link from "next/link";
import TransactionGraphs from "./_components/transaction-graphs";
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import ConnectPlaidBanner from "./_components/connect-plaid-banner";
import { CreditCard } from "lucide-react";

// Utility function to format category strings
const formatCategory = (category: string): string => {
  // Replace underscores with spaces and capitalize each word
  return category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function Dashboard() {
  const { user } = useUser();
  const userId = user?.id || "";
  const transactions = useQuery(api.transactions.getTransactionsByUser, { userId });
  const userData = useQuery(api.users.getUserById, { userId });
  
  // Calculate total spending
  const totalSpending = transactions?.reduce((sum, tx) => sum + tx.amount, 0) || 0;
  
  // Calculate spending by category
  const spendingByCategory = transactions?.reduce((categories, tx) => {
    let category = tx.category.split(' > ')[0]; // Get top-level category
    // Format the category
    category = formatCategory(category);
    if (!categories[category]) {
      categories[category] = 0;
    }
    categories[category] += tx.amount;
    return categories;
  }, {} as Record<string, number>) || {};
  
  // Find top category
  let topCategory = 'None';
  let topAmount = 0;
  
  Object.entries(spendingByCategory).forEach(([category, amount]) => {
    if (amount > topAmount) {
      topCategory = category;
      topAmount = amount;
    }
  });
  
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your financial dashboard
        </p>
      </div>
      
      {/* Connect Plaid Banner - only shown if user hasn't connected */}
      <ConnectPlaidBanner />

      {/* Quick Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spending</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpending.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              All time spending
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Category</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topCategory}</div>
            <p className="text-xs text-muted-foreground">
              ${topAmount.toFixed(2)} spent
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total transactions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Transaction</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${transactions?.length ? (totalSpending / transactions.length).toFixed(2) : '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">
              Average per transaction
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Graphs */}
      <TransactionGraphs />

      {/* Featured Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your recent financial transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {transactions && transactions.length > 0 ? (
              <div className="space-y-4">
                {transactions
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 5)
                  .map((transaction) => (
                    <div
                      key={transaction._id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {formatCategory(transaction.category)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(transaction.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          transaction.amount < 0
                            ? "text-green-500 font-medium"
                            : "text-red-500 font-medium"
                        }
                      >
                        ${Math.abs(transaction.amount).toFixed(2)}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-center py-4">No recent transactions</p>
            )}
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>
              Your spending by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(spendingByCategory).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(spendingByCategory)
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, amount]) => (
                    <div key={category} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{category}</p>
                        <p className="text-sm text-muted-foreground">
                          {((amount / totalSpending) * 100).toFixed(1)}% of total
                        </p>
                      </div>
                      <div className="font-medium">${amount.toFixed(2)}</div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-center py-4">No category data available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
