"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useUser } from "@clerk/nextjs"
import { format, parseISO, subDays, eachDayOfInterval } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from "recharts"

// Default budget constants - will be overridden by user settings if available
const DEFAULT_WEEKLY_BUDGET = 500
const DEFAULT_BIWEEKLY_BUDGET = 1000
const DEFAULT_MONTHLY_BUDGET = 2000

type Transaction = {
  _id: string
  transaction_id: string
  account_id: string
  amount: number
  date: string
  category: string
  merchant_name?: string
  name?: string
}

type DailySpending = {
  date: string
  amount: number
  cumulative: number
  formattedDate: string
  budget?: number
}

type TimeRange = "weekly" | "biweekly" | "monthly"
type GraphType = "daily" | "cumulative"

export default function TransactionGraphs() {
  const { user } = useUser()
  const userId = user?.id || ""
  
  // Get user data to access budget settings and accountId
  const userData = useQuery(api.users.getUserById, { userId })
  
  // Get transactions for the user's account
  // We use getTransactionsByUser which handles the accountId lookup internally
  const transactions = useQuery(api.transactions.getTransactionsByUser, { userId })

  const [timeRange, setTimeRange] = useState<TimeRange>("weekly")
  const [graphType, setGraphType] = useState<GraphType>("daily")

  // Initialize with empty arrays
  const [weeklyData, setWeeklyData] = useState<DailySpending[]>([])
  const [biWeeklyData, setBiWeeklyData] = useState<DailySpending[]>([])
  const [monthlyData, setMonthlyData] = useState<DailySpending[]>([])

  // Calculated totals
  const [weeklyTotal, setWeeklyTotal] = useState<number>(0)
  const [biWeeklyTotal, setBiWeeklyTotal] = useState<number>(0)
  const [monthlyTotal, setMonthlyTotal] = useState<number>(0)

  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      return
    }

    // Get budget values from user data or use defaults
    const weeklyBudget = userData?.weeklyBudget || DEFAULT_WEEKLY_BUDGET
    const biweeklyBudget = userData?.biweeklyBudget || DEFAULT_BIWEEKLY_BUDGET
    const monthlyBudget = userData?.monthlyBudget || DEFAULT_MONTHLY_BUDGET

    // Process transactions for different time periods
    const now = new Date()
    const weekStart = subDays(now, 7) // Last 7 days
    const biWeekStart = subDays(now, 14) // Last 14 days
    const monthStart = subDays(now, 30) // Last 30 days

    // Filter transactions for each time period
    const weeklyTransactions = transactions.filter((tx) => {
      try {
        const txDate = new Date(tx.date)
        return txDate >= weekStart && txDate <= now
      } catch (e) {
        console.error("Error parsing date:", tx.date, e)
        return false
      }
    })

    const biWeeklyTransactions = transactions.filter((tx) => {
      try {
        const txDate = new Date(tx.date)
        return txDate >= biWeekStart && txDate <= now
      } catch (e) {
        console.error("Error parsing date:", tx.date, e)
        return false
      }
    })

    const monthlyTransactions = transactions.filter((tx) => {
      try {
        const txDate = new Date(tx.date)
        return txDate >= monthStart && txDate <= now
      } catch (e) {
        console.error("Error parsing date:", tx.date, e)
        return false
      }
    })

    // Process data for each time period using the user's budget values
    const weeklyByDate = processTransactionData(weeklyTransactions, weekStart, now, weeklyBudget, 7)
    const biWeeklyByDate = processTransactionData(biWeeklyTransactions, biWeekStart, now, biweeklyBudget, 14)
    const monthlyByDate = processTransactionData(monthlyTransactions, monthStart, now, monthlyBudget, 30)

    // Calculate totals
    const weeklySum = weeklyTransactions.reduce((sum, tx) => sum + tx.amount, 0)
    const biWeeklySum = biWeeklyTransactions.reduce((sum, tx) => sum + tx.amount, 0)
    const monthlySum = monthlyTransactions.reduce((sum, tx) => sum + tx.amount, 0)

    // Update state with actual data
    setWeeklyData(weeklyByDate)
    setWeeklyTotal(weeklySum)

    setBiWeeklyData(biWeeklyByDate)
    setBiWeeklyTotal(biWeeklySum)

    setMonthlyData(monthlyByDate)
    setMonthlyTotal(monthlySum)
  }, [transactions, userData])

  // Process transaction data to include all days in the range and calculate cumulative spending
  const processTransactionData = (
    transactions: Transaction[],
    startDate: Date,
    endDate: Date,
    budget: number,
    days: number,
  ): DailySpending[] => {
    // Group transactions by date
    const grouped: { [key: string]: number } = {}

    transactions.forEach((tx) => {
      try {
        // Handle different date formats
        let dateObj: Date
        if (typeof tx.date === "string") {
          if (tx.date.includes("T")) {
            // ISO format
            dateObj = new Date(tx.date)
          } else {
            // YYYY-MM-DD format
            dateObj = parseISO(tx.date)
          }
        } else {
          dateObj = new Date(tx.date)
        }

        const date = format(dateObj, "yyyy-MM-dd")
        if (!grouped[date]) {
          grouped[date] = 0
        }
        grouped[date] += tx.amount
      } catch (e) {
        console.error("Error processing transaction date:", tx.date, e)
      }
    })

    // Create an array with all days in the range
    const allDays = eachDayOfInterval({ start: startDate, end: endDate })

    // Create data array with all days, including days with no transactions
    const data: DailySpending[] = allDays.map((day, index) => {
      const dateStr = format(day, "yyyy-MM-dd")
      const amount = grouped[dateStr] || 0

      // Calculate daily budget (evenly distributed)
      const dailyBudget = budget / days

      return {
        date: dateStr,
        amount,
        cumulative: 0, // Will be calculated below
        formattedDate: format(day, "MMM dd"),
        budget: dailyBudget * (index + 1), // Cumulative budget line
      }
    })

    // Calculate cumulative spending
    let runningTotal = 0
    data.forEach((day, index) => {
      runningTotal += day.amount
      data[index].cumulative = runningTotal
    })

    return data
  }

  // Get the appropriate data based on selected time range
  const getData = () => {
    switch (timeRange) {
      case "weekly":
        return weeklyData
      case "biweekly":
        return biWeeklyData
      case "monthly":
        return monthlyData
      default:
        return weeklyData
    }
  }

  // Get the appropriate budget based on selected time range
  const getBudget = () => {
    // Use user's budget values if available, otherwise use defaults
    const weeklyBudget = userData?.weeklyBudget || DEFAULT_WEEKLY_BUDGET
    const biweeklyBudget = userData?.biweeklyBudget || DEFAULT_BIWEEKLY_BUDGET
    const monthlyBudget = userData?.monthlyBudget || DEFAULT_MONTHLY_BUDGET

    switch (timeRange) {
      case "weekly":
        return weeklyBudget
      case "biweekly":
        return biweeklyBudget
      case "monthly":
        return monthlyBudget
      default:
        return weeklyBudget
    }
  }

  // Get the total spending based on selected time range
  const getTotal = () => {
    switch (timeRange) {
      case "weekly":
        return weeklyTotal
      case "biweekly":
        return biWeeklyTotal
      case "monthly":
        return monthlyTotal
      default:
        return weeklyTotal
    }
  }

  // Calculate budget progress percentage
  const getBudgetPercentage = () => {
    const total = getTotal()
    const budget = getBudget()
    return Math.min(Math.round((total / budget) * 100), 100)
  }

  // Get title based on selections
  const getTitle = () => {
    const timeRangeTitle = timeRange.charAt(0).toUpperCase() + timeRange.slice(1)
    const graphTypeTitle = graphType.charAt(0).toUpperCase() + graphType.slice(1)
    return `${timeRangeTitle} ${graphTypeTitle} Spending`
  }

  const currentData = getData()

  // Custom tooltip formatter
  const formatTooltip = (value: number) => {
    return [`$${value.toFixed(2)}`, "Amount"]
  }

  // Render bar chart using Recharts
  const renderBarChart = () => {
    if (currentData.length === 0) {
      return (
        <div className="flex flex-col h-[300px] items-center justify-center">
          <p className="text-muted-foreground">No data available for this period</p>
        </div>
      )
    }

    // For monthly view, we may need to show fewer bars
    const displayData =
      timeRange === "monthly"
        ? currentData.filter((_, i) => i % 2 === 0) // Show every other day for monthly
        : currentData

    return (
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={displayData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="formattedDate" 
            tick={{ fontSize: 12 }} 
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis 
            tickFormatter={(value) => `$${value}`} 
            tick={{ fontSize: 12 }} 
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <Tooltip formatter={formatTooltip} />
          <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  // Render line chart using Recharts
  const renderLineChart = () => {
    if (currentData.length < 2) {
      return (
        <div className="flex flex-col h-[300px] items-center justify-center">
          <p className="text-muted-foreground">Not enough data for a line chart</p>
        </div>
      )
    }

    // Calculate daily budget
    const dailyBudget = getBudget() / currentData.length

    return (
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={currentData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="formattedDate" 
            tick={{ fontSize: 12 }} 
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis 
            tickFormatter={(value) => `$${value}`} 
            tick={{ fontSize: 12 }} 
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <Tooltip formatter={formatTooltip} />
          <Line 
            type="monotone" 
            dataKey="cumulative" 
            stroke="#3b82f6" 
            strokeWidth={2} 
            dot={{ r: 3, fill: "#3b82f6", stroke: "#fff", strokeWidth: 1 }} 
            activeDot={{ r: 5 }}
          />
          <Line 
            type="monotone" 
            dataKey="budget" 
            stroke="#94a3b8" 
            strokeWidth={2} 
            strokeDasharray="5 5" 
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-medium">{getTitle()}</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
              <SelectTrigger className="h-8 w-[120px] text-xs">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            <Tabs value={graphType} onValueChange={(value) => setGraphType(value as GraphType)}>
              <TabsList className="h-8">
                <TabsTrigger value="daily" className="text-xs">
                  Daily
                </TabsTrigger>
                <TabsTrigger value="cumulative" className="text-xs">
                  Cumulative
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="px-2 pb-2">
          <div className="space-y-4">
            {/* Budget Progress */}
            <div className="space-y-1 px-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium">Budget Progress</span>
                <span className="text-muted-foreground">
                  ${getTotal().toFixed(2)} of ${getBudget().toFixed(2)}
                </span>
              </div>
              <Progress value={getBudgetPercentage()} className="h-1.5" />
              <p className="text-xs text-muted-foreground">
                {getBudgetPercentage()}% of {timeRange} budget used
              </p>
            </div>

            {/* Chart */}
            <div className="px-2">{graphType === "daily" ? renderBarChart() : renderLineChart()}</div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-2 px-2">
              <div className="bg-muted p-2 rounded-md">
                <h4 className="text-xs font-medium">Total</h4>
                <p className="text-base font-bold">${getTotal().toFixed(2)}</p>
              </div>
              <div className="bg-muted p-2 rounded-md">
                <h4 className="text-xs font-medium">Daily Avg</h4>
                <p className="text-base font-bold">${(getTotal() / (currentData.length || 1)).toFixed(2)}</p>
              </div>
              <div className="bg-muted p-2 rounded-md">
                <h4 className="text-xs font-medium">Remaining</h4>
                <p className="text-base font-bold">${Math.max(getBudget() - getTotal(), 0).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
