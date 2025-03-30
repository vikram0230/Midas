"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useUser } from "@clerk/nextjs"
import { format, parseISO, subDays, eachDayOfInterval, addDays } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
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
  Legend,
} from "recharts"
import { formatCategory } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-mobile"

// Default budget constants - will be overridden by user settings if available
const DEFAULT_WEEKLY_BUDGET = 500
const DEFAULT_BIWEEKLY_BUDGET = 1000
const DEFAULT_MONTHLY_BUDGET = 2000

type Transaction = {
  _id: Id<"transactions">
  _creationTime: number
  transaction_id: number
  account_id: string
  amount: number
  date: string
  category: string
  time?: string
  activity?: string
  type?: string
  vendor_name?: string
  userId?: string
}

type DailySpending = {
  date: string
  amount: number
  cumulative: number
  formattedDate: string
  isPredicted?: boolean
}

type PredictedData = {
  predictedTransactions: any[]
  predictedDailyData: DailySpending[]
}

type TimeRange = "weekly" | "biweekly" | "monthly"
type GraphType = "daily" | "cumulative"

export default function TransactionGraphs() {
  const { user } = useUser()
  const userId = user?.id || ""
  const isMobile = useMediaQuery("(max-width: 640px)")

  // Get user data to access budget settings and accountId
  const userData = useQuery(api.users.getUserById, { userId })

  // Get transactions for the user's account
  // We use getTransactionsByUser which handles the accountId lookup internally
  const transactions = useQuery(api.transactions.getTransactionsByUser, { userId })

  const [timeRange, setTimeRange] = useState<TimeRange>("weekly")
  const [graphType, setGraphType] = useState<GraphType>("daily")
  const [showPredictions, setShowPredictions] = useState(false)
  const [isPredicting, setIsPredicting] = useState(false)
  const [predictedData, setPredictedData] = useState<{
    predictedTransactions: any[]
    predictedDailyData: DailySpending[]
  } | null>(null)

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
    _budget: number, // Unused parameter
    _days: number,  // Unused parameter
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

        // Format the category if it exists
        if (tx.category) {
          tx.category = formatCategory(tx.category)
        }

        const date = format(dateObj, "yyyy-MM-dd")
        if (!grouped[date]) {
          grouped[date] = 0
        }
        grouped[date] += tx.amount
      } catch (e) {
        console.error("Error processing transaction:", tx, e)
      }
    })

    // Get all dates in range
    const allDates = eachDayOfInterval({ start: startDate, end: endDate })

    // Create daily spending data with cumulative amounts
    let cumulative = 0
    return allDates.map((date) => {
      const dateStr = format(date, "yyyy-MM-dd")
      const amount = grouped[dateStr] || 0
      cumulative += amount
      return {
        date: dateStr,
        amount,
        cumulative,
        formattedDate: format(date, "MMM dd"),
      }
    })
  }

  // Get the appropriate data based on selected time range
  const getData = () => {
    let data = [] as DailySpending[]

    switch (timeRange) {
      case "weekly":
        data = weeklyData
        break
      case "biweekly":
        data = biWeeklyData
        break
      case "monthly":
        data = monthlyData
        break
      default:
        data = weeklyData
    }

    // If predictions are enabled and we have predicted data, append it
    if (showPredictions && predictedData?.predictedDailyData) {
      // Get the last date from our actual data
      const lastDate = data.length > 0 ? new Date(data[data.length - 1].date) : new Date()

      // Filter predicted data to only include dates after our last actual date
      const filteredPredictions = predictedData.predictedDailyData.filter((item) => {
        const predDate = new Date(item.date)
        return predDate > lastDate
      })

      // If we're showing cumulative data, adjust the cumulative values to continue from our last actual value
      if (graphType === "cumulative" && data.length > 0 && filteredPredictions.length > 0) {
        const lastCumulative = data[data.length - 1].cumulative

        // Adjust each prediction's cumulative value
        filteredPredictions.forEach((item, index) => {
          if (index === 0) {
            item.cumulative = lastCumulative + item.amount
          } else {
            item.cumulative = filteredPredictions[index - 1].cumulative + item.amount
          }
        })
      }

      // Combine actual and predicted data
      return [...data, ...filteredPredictions]
    }

    return data
  }

  // Function to generate sample predicted data
  // In a real implementation, this would be an API call to localhost:8000
  const fetchPredictions = async () => {
    setIsPredicting(true)

    try {
      // Get the current data to find the last date
      const currentData = getData()
      const lastDate = currentData.length > 0 ? new Date(currentData[currentData.length - 1].date) : new Date()

      // For now, we'll generate sample predicted data
      // In a real implementation, this would be:
      // const response = await fetch('http://localhost:8000/predict', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     userId,
      //     timeRange,
      //     startDate: lastDate.toISOString()
      //   })
      // });
      // const data = await response.json();

      // Generate sample predicted data
      const predictedTransactions = []
      const predictedDailyData = []
      let cumulativeAmount = 0

      // Determine number of days to predict based on timeRange
      let daysToPredict = 7
      if (timeRange === "biweekly") {
        daysToPredict = 14
      } else if (timeRange === "monthly") {
        daysToPredict = 30
      }

      // Sample categories and amounts based on typical spending
      const sampleCategories = [
        { category: "Food & Dining", avgAmount: 25 },
        { category: "Shopping", avgAmount: 50 },
        { category: "Transportation", avgAmount: 15 },
        { category: "Entertainment", avgAmount: 35 },
        { category: "Bills & Utilities", avgAmount: 75 },
      ]

      for (let i = 0; i < daysToPredict; i++) {
        const currentDate = addDays(lastDate, i + 1) // Start from the day after last date
        const dateStr = format(currentDate, "yyyy-MM-dd")
        const formattedDate = format(currentDate, "MMM dd")

        // Randomly determine how many transactions to generate for this day (1-3)
        const transactionsForDay = Math.floor(Math.random() * 3) + 1

        let dailyTotal = 0

        for (let j = 0; j < transactionsForDay; j++) {
          // Randomly select a category
          const randomCategory = sampleCategories[Math.floor(Math.random() * sampleCategories.length)]

          // Add some randomness to the amount (±20%)
          const randomFactor = 0.8 + Math.random() * 0.4 // Between 0.8 and 1.2
          const amount = randomCategory.avgAmount * randomFactor

          // Create a predicted transaction
          predictedTransactions.push({
            transaction_id: 10000 + predictedTransactions.length, // Use high IDs to avoid conflicts
            account_id: userData?.accountId || "unknown",
            date: dateStr,
            amount: amount,
            category: randomCategory.category,
            vendor_name: `Predicted ${randomCategory.category}`,
            isPredicted: true,
          })

          dailyTotal += amount
        }

        cumulativeAmount += dailyTotal

        // Add to daily data for graphing
        predictedDailyData.push({
          date: dateStr,
          formattedDate: formattedDate,
          amount: dailyTotal,
          cumulative: cumulativeAmount,
          isPredicted: true,
        })
      }

      // Set the predicted data
      setPredictedData({
        predictedTransactions,
        predictedDailyData,
      })

      setShowPredictions(true)
    } catch (error) {
      console.error("Error generating predictions:", error)
    } finally {
      setIsPredicting(false)
    }
  }

  // Toggle predictions on/off
  const togglePredictions = () => {
    if (showPredictions) {
      // Hide predictions
      setShowPredictions(false)
    } else {
      // Show predictions
      fetchPredictions()
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
  const formatTooltip = (value: number, name: string, props: any) => {
    // Check if this is a predicted value
    const isPredicted = props.payload && props.payload.isPredicted
    const label = isPredicted ? `${name} (Predicted)` : name
    return [`$${value.toFixed(2)}`, label]
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
        ? currentData.filter((_, i) => i % (isMobile ? 4 : 2) === 0) // Show fewer bars on mobile
        : isMobile && timeRange === "biweekly"
          ? currentData.filter((_, i) => i % 2 === 0) // Show every other day for biweekly on mobile
          : currentData

    return (
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={displayData} margin={{ top: 10, right: 10, left: isMobile ? -15 : 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="formattedDate"
            tick={{ fontSize: isMobile ? 10 : 12 }}
            tickLine={false}
            axisLine={{ stroke: "#e5e7eb" }}
            interval={isMobile ? 1 : 0} // Skip some labels on mobile
            angle={isMobile ? -45 : 0} // Angle labels on mobile
            textAnchor={isMobile ? "end" : "middle"}
            height={isMobile ? 50 : 30} // More space for angled labels
          />
          <YAxis
            tickFormatter={(value) => `$${value}`}
            tick={{ fontSize: isMobile ? 10 : 12 }}
            tickLine={false}
            axisLine={{ stroke: "#e5e7eb" }}
            width={isMobile ? 40 : 60} // Narrower on mobile
          />
          <Tooltip formatter={formatTooltip} />
          <Bar dataKey="amount" fill="currentColor" radius={[4, 4, 0, 0]} />
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

    // Identify where actual data ends and predictions begin
    const predictedStartIndex = currentData.findIndex((item) => item.isPredicted)
    const hasPredictions = predictedStartIndex !== -1

    // For monthly view on mobile, show fewer data points
    const displayData = isMobile && timeRange === "monthly" ? currentData.filter((_, i) => i % 3 === 0) : currentData

    return (
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={displayData} margin={{ top: 10, right: 10, left: isMobile ? -15 : 0, bottom: 0 }}>
          <XAxis
            dataKey="formattedDate"
            tick={{ fontSize: isMobile ? 10 : 12 }}
            tickLine={false}
            axisLine={{ stroke: "#e5e7eb" }}
            interval={isMobile ? 1 : 0}
            angle={isMobile ? -45 : 0}
            textAnchor={isMobile ? "end" : "middle"}
            height={isMobile ? 50 : 30}
          />
          <YAxis
            tickFormatter={(value) => `$${value}`}
            tick={{ fontSize: isMobile ? 10 : 12 }}
            tickLine={false}
            axisLine={{ stroke: "#e5e7eb" }}
            width={isMobile ? 40 : 60}
          />
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <Tooltip formatter={formatTooltip} />
          <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />

          {/* Actual spending line */}
          <Line
            type="monotone"
            dataKey="cumulative"
            name="Actual Spending"
            stroke="currentColor"
            strokeWidth={2}
            dot={isMobile ? false : { r: 3, fill: "currentColor", stroke: "#fff", strokeWidth: 1 }}
            activeDot={{ r: 5 }}
          />

          {/* Predicted spending line (only if we have predictions) */}
          {hasPredictions && (
            <Line
              type="monotone"
              dataKey="cumulative"
              name="Predicted Spending"
              stroke="#d4af37"
              strokeWidth={2}
              strokeDasharray="3 3"
              dot={isMobile ? false : { r: 3, fill: "#d4af37", stroke: "#fff", strokeWidth: 1 }}
              activeDot={{ r: 5 }}
              isAnimationActive={true}
              connectNulls={true}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    )
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader className={`flex ${isMobile ? "flex-col" : "flex-row"} items-center justify-between pb-2`}>
          <CardTitle className="text-base font-medium mb-2">{getTitle()}</CardTitle>
          <div className={`flex ${isMobile ? "flex-col w-full" : "flex-row"} items-center gap-2`}>
            <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
              <SelectTrigger className={`h-8 ${isMobile ? "w-full" : "w-[120px]"} text-xs`}>
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            <div className={`flex ${isMobile ? "w-full" : ""} gap-2`}>
              <Tabs
                value={graphType}
                onValueChange={(value) => setGraphType(value as GraphType)}
                className={isMobile ? "flex-1" : ""}
              >
                <TabsList className={`h-8 ${isMobile ? "w-full" : ""}`}>
                  <TabsTrigger value="daily" className="text-xs flex-1">
                    Daily
                  </TabsTrigger>
                  <TabsTrigger value="cumulative" className="text-xs flex-1">
                    Cumulative
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Button
                variant={showPredictions ? "default" : "outline"}
                size="sm"
                onClick={togglePredictions}
                disabled={isPredicting}
                className={`h-8 text-xs ${isMobile ? "flex-1" : ""}`}
              >
                {isPredicting ? "Loading..." : showPredictions ? "Hide" : "Predict"}
              </Button>
            </div>
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
                <p className={`${isMobile ? "text-sm" : "text-base"} font-bold`}>${getTotal().toFixed(2)}</p>
              </div>
              <div className="bg-muted p-2 rounded-md">
                <h4 className="text-xs font-medium">Daily Avg</h4>
                <p className={`${isMobile ? "text-sm" : "text-base"} font-bold`}>
                  ${(getTotal() / (currentData.length || 1)).toFixed(2)}
                </p>
              </div>
              <div className="bg-muted p-2 rounded-md">
                <h4 className="text-xs font-medium">Remaining</h4>
                <p className={`${isMobile ? "text-sm" : "text-base"} font-bold`}>
                  ${Math.max(getBudget() - getTotal(), 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
