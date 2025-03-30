"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Categories that can be used in the what-if scenarios
const CATEGORIES = [
  "food_and_drink",
  "travel",
  "shopping",
  "entertainment",
  "auto",
  "business",
  "healthcare",
  "education",
  "other",
] as const

type Category = (typeof CATEGORIES)[number]

interface Scenario {
  skip_expense: {
    category: Category
    active: boolean
  }
  new_expense: {
    category: Category
    active: boolean
    percent: number
  }
  reduce_expense: {
    category: Category
    active: boolean
    percent: number
  }
}

interface WhatIfResponse {
  predicted_without_params: Array<{
    amount: number
    date: string
    category: string
  }>
  predicted_with_params: Array<{
    amount: number
    date: string
    category: string
  }>
}

type TimePeriod = "weekly" | "biweekly" | "monthly"

export default function Oracle() {
  const { user } = useUser()
  const userId = user?.id || ""
  const transactions = useQuery(api.transactions.getTransactionsByUser, { userId })

  const [loading, setLoading] = useState(false)
  const [prediction, setPrediction] = useState<WhatIfResponse | null>(null)
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("monthly")
  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const [scenario, setScenario] = useState<Scenario>({
    skip_expense: {
      category: "food_and_drink",
      active: false,
    },
    new_expense: {
      category: "business",
      active: false,
      percent: 20,
    },
    reduce_expense: {
      category: "auto",
      active: false,
      percent: 20,
    },
  })

  // Detect theme changes
  useEffect(() => {
    // Check if document is available (client-side)
    if (typeof document !== "undefined") {
      // Initial check
      setIsDarkTheme(document.documentElement.classList.contains("dark"))

      // Create observer to watch for class changes on html element
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === "class") {
            setIsDarkTheme(document.documentElement.classList.contains("dark"))
          }
        })
      })

      // Start observing
      observer.observe(document.documentElement, { attributes: true })

      // Cleanup
      return () => observer.disconnect()
    }
  }, [])

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate sample data based on time period
      const generateSampleData = () => {
        const data = []
        const startDate = new Date()
        startDate.setMonth(startDate.getMonth() + 1)
        startDate.setDate(1)

        // Determine number of days based on time period
        const days = timePeriod === "weekly" ? 7 : timePeriod === "biweekly" ? 14 : 30

        for (let i = 0; i < days; i++) {
          const date = new Date(startDate)
          date.setDate(date.getDate() + i)

          // Base amount between 50 and 200
          const baseAmount = 50 + Math.random() * 150

          data.push({
            amount: baseAmount,
            date: date.toISOString().split("T")[0],
            category: "food_and_drink",
          })
        }
        return data
      }

      // Generate baseline data
      const baselineData = generateSampleData()

      // Generate modified data based on the scenario
      const modifiedData = baselineData.map((item) => {
        let amount = item.amount

        // Apply skip expense
        if (scenario.skip_expense.active && item.category === scenario.skip_expense.category) {
          amount = 0
        }

        // Apply new expense
        if (scenario.new_expense.active && Math.random() > 0.7) {
          // 30% chance of new expense
          amount += amount * (scenario.new_expense.percent / 100)
        }

        // Apply reduce expense
        if (scenario.reduce_expense.active) {
          amount *= 1 - scenario.reduce_expense.percent / 100
        }

        return {
          ...item,
          amount,
        }
      })

      setPrediction({
        predicted_without_params: baselineData,
        predicted_with_params: modifiedData,
      })
    } catch (error) {
      console.error("Error generating prediction:", error)
    } finally {
      setLoading(false)
    }
  }

  // Prepare chart data
  const chartData = prediction
    ? prediction.predicted_with_params.map((pred, index) => ({
        date: new Date(pred.date).toLocaleDateString(),
        baseline: prediction.predicted_without_params[index].amount,
        modified: pred.amount,
      }))
    : []

  // Determine baseline color based on theme
  const baselineColor = isDarkTheme ? "#FFFFFF" : "#000000"

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Oracle</CardTitle>
          <CardDescription>
            Simulate different spending scenarios to see how they might affect your future finances.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Time Period Section */}
            <div className="space-y-4">
              <Label>Time Period</Label>
              <Select value={timePeriod} onValueChange={(value: TimePeriod) => setTimePeriod(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Skip Expense Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="skip-expense">Skip Expense Category</Label>
                <Switch
                  id="skip-active"
                  checked={scenario.skip_expense.active}
                  onCheckedChange={(checked) =>
                    setScenario((prev) => ({
                      ...prev,
                      skip_expense: { ...prev.skip_expense, active: checked },
                    }))
                  }
                />
              </div>
              <Select
                disabled={!scenario.skip_expense.active}
                value={scenario.skip_expense.category}
                onValueChange={(value: Category) =>
                  setScenario((prev) => ({
                    ...prev,
                    skip_expense: { ...prev.skip_expense, category: value },
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* New Expense Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="new-expense">New Expense Category</Label>
                <Switch
                  id="new-active"
                  checked={scenario.new_expense.active}
                  onCheckedChange={(checked) =>
                    setScenario((prev) => ({
                      ...prev,
                      new_expense: { ...prev.new_expense, active: checked },
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Select
                  disabled={!scenario.new_expense.active}
                  value={scenario.new_expense.category}
                  onValueChange={(value: Category) =>
                    setScenario((prev) => ({
                      ...prev,
                      new_expense: { ...prev.new_expense, category: value },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    disabled={!scenario.new_expense.active}
                    value={scenario.new_expense.percent}
                    onChange={(e) =>
                      setScenario((prev) => ({
                        ...prev,
                        new_expense: {
                          ...prev.new_expense,
                          percent: Number.parseFloat(e.target.value) || 0,
                        },
                      }))
                    }
                    min="0"
                    max="100"
                  />
                  <span>%</span>
                </div>
              </div>
            </div>

            {/* Reduce Expense Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="reduce-expense">Reduce Expense Category</Label>
                <Switch
                  id="reduce-active"
                  checked={scenario.reduce_expense.active}
                  onCheckedChange={(checked) =>
                    setScenario((prev) => ({
                      ...prev,
                      reduce_expense: { ...prev.reduce_expense, active: checked },
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Select
                  disabled={!scenario.reduce_expense.active}
                  value={scenario.reduce_expense.category}
                  onValueChange={(value: Category) =>
                    setScenario((prev) => ({
                      ...prev,
                      reduce_expense: { ...prev.reduce_expense, category: value },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    disabled={!scenario.reduce_expense.active}
                    value={scenario.reduce_expense.percent}
                    onChange={(e) =>
                      setScenario((prev) => ({
                        ...prev,
                        reduce_expense: {
                          ...prev.reduce_expense,
                          percent: Number.parseFloat(e.target.value) || 0,
                        },
                      }))
                    }
                    min="0"
                    max="100"
                  />
                  <span>%</span>
                </div>
              </div>
            </div>

            <Button onClick={handleSubmit} disabled={loading || !transactions?.[0]?.account_id} className="w-full">
              {loading ? "Calculating..." : "Calculate Prediction"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Chart */}
      {prediction && (
  <Card>
    <CardHeader>
      <CardTitle>Prediction Results</CardTitle>
      <CardDescription>Compare your baseline spending forecast with the modified scenario</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="h-[400px] relative">
        {/* Enhanced gold glowing effect */}
        <style jsx>{`
          @keyframes vibrate {
            0% { 
              transform: translate(0, 0);
              filter: drop-shadow(0 0 8px rgba(255, 204, 0, 0.8)) drop-shadow(0 0 16px rgba(255, 204, 0, 0.4));
            }
            25% { 
              transform: translate(1px, 1px);
              filter: drop-shadow(0 0 12px rgba(255, 204, 0, 0.9)) drop-shadow(0 0 20px rgba(255, 204, 0, 0.5));
            }
            50% { 
              transform: translate(0, -1px);
              filter: drop-shadow(0 0 16px rgba(255, 204, 0, 1)) drop-shadow(0 0 24px rgba(255, 204, 0, 0.6));
            }
            75% { 
              transform: translate(-1px, 1px);
              filter: drop-shadow(0 0 12px rgba(255, 204, 0, 0.9)) drop-shadow(0 0 20px rgba(255, 204, 0, 0.5));
            }
            100% { 
              transform: translate(0, 0);
              filter: drop-shadow(0 0 8px rgba(255, 204, 0, 0.8)) drop-shadow(0 0 16px rgba(255, 204, 0, 0.4));
            }
          }

          .glow-effect {
            animation: vibrate 1.5s ease-in-out infinite;
            filter: drop-shadow(0 0 10px rgba(255, 204, 0, 0.8)) drop-shadow(0 0 20px rgba(255, 204, 0, 0.5));
          }

          /* Add this to make the SVG glow work better in all browsers */
          .recharts-layer.recharts-line-chart {
            filter: none !important;
          }
        `}</style>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #ccc",
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="baseline"
              stroke={baselineColor}
              name="Baseline Forecast"
              strokeWidth={2}
              dot={false}
            />
            <Line
              className="glow-effect"
              type="monotone"
              dataKey="modified"
              stroke="#FFCC00" // Lighter gold color
              name="Modified Forecast"
              strokeWidth={3}
              dot={{
                r: 6,
                fill: "#FFCC00", // Lighter gold for dots
                stroke: "#FFCC00",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 10,
                fill: "#FFCC00", // Lighter gold for active dot
                stroke: "#fff", // White border for active dot
                strokeWidth: 3,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
)}


    </div>
  )
}

