"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Code, Star, TrendingUp, Users, Zap } from "lucide-react";
import Link from "next/link";
import TransactionGraphs from "./_components/transaction-graphs";
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { formatCategory } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import ConnectPlaidBanner from "./_components/connect-plaid-banner";
import { CreditCard } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Anomaly {
  amount: number;
  date: string;
  normal_range: [number, number];
  percent_deviation: number;
  transaction_id: string;
}

interface AnomalyData {
  high_spending_anomalies: Anomaly[];
  low_spending_anomalies: Anomaly[];
}

type TimePeriod = "weekly" | "biweekly" | "monthly";

export default function Dashboard() {
  const { user } = useUser();
  const userId = user?.id || "";
  const [anomalies, setAnomalies] = useState<AnomalyData | null>(null);
  const [loadingAnomalies, setLoadingAnomalies] = useState(false);
  const sentEmailRef = useRef(false);
  const [timePeriod, setTimePeriod] = useState<TimePeriod | null>("weekly");
  const lastTransactionCountRef = useRef(0);

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

  // Get date range based on time period
  const getDateRange = (period: TimePeriod) => {
    const now = new Date();
    const endDate = now.toISOString().split("T")[0];
    let startDate: string;

    switch (period) {
      case "weekly":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        startDate = weekAgo.toISOString().split("T")[0];
        break;
      case "biweekly":
        const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        startDate = twoWeeksAgo.toISOString().split("T")[0];
        break;
      case "monthly":
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        startDate = monthAgo.toISOString().split("T")[0];
        break;
    }

    return { startDate, endDate };
  };

  // Fetch anomalies when time period is selected
  const fetchAnomalies = async (period: TimePeriod) => {
    if (!userId || !transactions?.[0]?.account_id) return;
    
    setLoadingAnomalies(true);
    try {
      const { startDate, endDate } = getDateRange(period);
      const response = await fetch("http://172.16.5.57:8000/api/anomalies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: transactions[0].account_id,
          startDate,
          endDate,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch anomalies");
      }

      const data = await response.json();
      setAnomalies(data);

      // Send email if any anomalies are detected and email hasn't been sent yet
      if ((data.high_spending_anomalies.length > 0 || data.low_spending_anomalies.length > 0) && 
          !sentEmailRef.current && 
          user?.emailAddresses?.[0]?.emailAddress) {
        try {
          const emailResponse = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: user.emailAddresses[0].emailAddress,
              highSpendingAnomalies: data.high_spending_anomalies,
              lowSpendingAnomalies: data.low_spending_anomalies,
            }),
          });

          if (!emailResponse.ok) {
            throw new Error('Failed to send email');
          }

          sentEmailRef.current = true;
        } catch (error) {
          console.error("Failed to send anomaly alert email:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching anomalies:", error);
    } finally {
      setLoadingAnomalies(false);
    }
  };

  // Listen for new transactions and check for anomalies
  useEffect(() => {
    if (!transactions) return;

    const currentTransactionCount = transactions.length;
    
    // Check if we have new transactions
    if (currentTransactionCount > lastTransactionCountRef.current) {
      // If we have a time period selected, automatically check for new anomalies
      if (timePeriod) {
        // Reset email sent flag so we can send a new email if anomalies are found
        sentEmailRef.current = false;
        fetchAnomalies(timePeriod);
      }
    }

    // Update the transaction count reference
    lastTransactionCountRef.current = currentTransactionCount;
  }, [transactions, timePeriod]);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-500">Welcome back, {user?.firstName}!</p>
      </div>

      {/* Connect Plaid Banner - only shown if user hasn't connected */}
      <ConnectPlaidBanner />

      {/* Time Period Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Time Period:</span>
        <Select 
          value={timePeriod || ""} 
          onValueChange={(value: TimePeriod) => {
            setTimePeriod(value);
            fetchAnomalies(value);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="biweekly">Biweekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
        {loadingAnomalies && <span className="text-sm text-gray-500">Loading anomalies...</span>}
      </div>

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

      {/* Anomaly Alerts */}
      {anomalies?.high_spending_anomalies.length || anomalies?.low_spending_anomalies.length ? (
        <div className="space-y-4">
          {anomalies?.high_spending_anomalies.map((anomaly) => (
            <Alert key={anomaly.transaction_id} variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>High Spending Anomaly Detected</AlertTitle>
              <AlertDescription>
                A transaction of ${anomaly.amount.toFixed(2)} on {new Date(anomaly.date).toLocaleDateString()} 
                is {anomaly.percent_deviation.toFixed(2)}% above your normal spending pattern. 
                Normal range for this period is ${anomaly.normal_range[0].toFixed(2)} - ${anomaly.normal_range[1].toFixed(2)}.
              </AlertDescription>
            </Alert>
          ))}
          {anomalies?.low_spending_anomalies.map((anomaly) => (
            <Alert key={anomaly.transaction_id} variant="default" className="border-green-500 bg-green-50">
              <AlertTriangle className="h-4 w-4 text-green-500" />
              <AlertTitle className="text-green-700">Low Spending Anomaly Detected</AlertTitle>
              <AlertDescription className="text-green-600">
                A transaction of ${anomaly.amount.toFixed(2)} on {new Date(anomaly.date).toLocaleDateString()} 
                is {anomaly.percent_deviation.toFixed(2)}% below your normal spending pattern. 
                Normal range for this period is ${anomaly.normal_range[0].toFixed(2)} - ${anomaly.normal_range[1].toFixed(2)}.
              </AlertDescription>
            </Alert>
          ))}
        </div>
      ) : null}

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
