"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  AlertTriangle,
  Building2,
  FileText,
  ExternalLink,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Bell,
  Download,
  RefreshCw,
} from "lucide-react";

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState("12M");

  // Mock data
  const financialMetrics = {
    totalRevenue: { value: 2450000, change: 12.5, period: "YTD" },
    burnRate: { value: 185000, change: -8.2, period: "Monthly" },
    runway: { months: 18.5 },
  };

  const expenseCategories = [
    { category: "Personnel", amount: 125000, percentage: 67.6, change: 5.2 },
    { category: "Technology", amount: 35000, percentage: 18.9, change: -2.1 },
    { category: "Marketing", amount: 25000, percentage: 13.5, change: 15.8 },
  ];

  const headcountData = [
    { month: "Jan", count: 45 },
    { month: "Feb", count: 47 },
    { month: "Mar", count: 52 },
    { month: "Apr", count: 58 },
    { month: "May", count: 61 },
    { month: "Jun", count: 65 },
  ];

  const secUpdates = [
    {
      id: 1,
      title: "New Disclosure Requirements for Private Companies",
      date: "2024-01-15",
      impact: "High",
      summary:
        "Updated reporting standards for revenue recognition affecting SaaS companies.",
    },
    {
      id: 2,
      title: "Cybersecurity Risk Management Rules",
      date: "2024-01-10",
      impact: "Medium",
      summary:
        "Enhanced cybersecurity disclosure requirements for public companies.",
    },
    {
      id: 3,
      title: "ESG Reporting Framework Updates",
      date: "2024-01-08",
      impact: "Low",
      summary:
        "Voluntary ESG reporting guidelines for emerging growth companies.",
    },
  ];

  const competitorStocks = [
    {
      symbol: "PLTR",
      name: "Palantir",
      price: 18.45,
      change: 2.3,
      changePercent: 14.2,
    },
    {
      symbol: "SNOW",
      name: "Snowflake",
      price: 165.23,
      change: -3.2,
      changePercent: -1.9,
    },
    {
      symbol: "DDOG",
      name: "Datadog",
      price: 98.76,
      change: 1.8,
      changePercent: 1.9,
    },
    {
      symbol: "MDB",
      name: "MongoDB",
      price: 387.45,
      change: 8.9,
      changePercent: 2.4,
    },
  ];

  const industryNews = [
    {
      id: 1,
      title: "AI Analytics Market Expected to Reach $50B by 2025",
      source: "TechCrunch",
      time: "2h ago",
      sentiment: "positive",
    },
    {
      id: 2,
      title: "New Data Privacy Regulations Impact SaaS Companies",
      source: "Reuters",
      time: "4h ago",
      sentiment: "neutral",
    },
    {
      id: 3,
      title: "Enterprise Software Spending Increases 15% YoY",
      source: "Bloomberg",
      time: "6h ago",
      sentiment: "positive",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-sm">F</span>
                </div>
                <span className="text-xl font-bold">FinEx Dashboard</span>
              </div>
              <div className="flex gap-2">
                {["1M", "3M", "6M", "12M", "YTD"].map((range) => (
                  <Button
                    key={range}
                    variant={timeRange === range ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeRange(range)}
                    className={
                      timeRange === range
                        ? "bg-white text-black"
                        : "border-gray-600 hover:bg-white/5 text-white"
                    }
                  >
                    {range}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-600 hover:bg-white/5 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-600 hover:bg-white/5 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <div className="relative">
                <Bell className="w-5 h-5 text-gray-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Key Metrics Row */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">
                      Total Revenue
                    </p>
                    <p className="text-2xl font-bold text-white">
                      $
                      {(financialMetrics.totalRevenue.value / 1000000).toFixed(
                        2
                      )}
                      M
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 text-sm">
                        +{financialMetrics.totalRevenue.change}%
                      </span>
                      <span className="text-gray-500 text-sm">
                        {financialMetrics.totalRevenue.period}
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">
                      Monthly Burn Rate
                    </p>
                    <p className="text-2xl font-bold text-white">
                      ${(financialMetrics.burnRate.value / 1000).toFixed(0)}K
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingDown className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 text-sm">
                        {financialMetrics.burnRate.change}%
                      </span>
                      <span className="text-gray-500 text-sm">
                        vs last month
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <TrendingDown className="w-6 h-6 text-red-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Runway</p>
                    <p className="text-2xl font-bold text-white">
                      {financialMetrics.runway.months} months
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 text-sm">
                        At current burn
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">
                      Current Headcount
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {headcountData[headcountData.length - 1].count}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400 text-sm">
                        +
                        {headcountData[headcountData.length - 1].count -
                          headcountData[0].count}
                      </span>
                      <span className="text-gray-500 text-sm">this year</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Top 3 Expense Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <PieChart className="w-5 h-5" />
                  Top 3 Expense Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expenseCategories.map((expense, index) => (
                    <div key={expense.category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">
                          {expense.category}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-white">
                            ${(expense.amount / 1000).toFixed(0)}K
                          </span>
                          <Badge
                            variant="outline"
                            className={`${
                              expense.change > 0
                                ? "border-red-500/50 text-red-400"
                                : "border-green-500/50 text-green-400"
                            }`}
                          >
                            {expense.change > 0 ? "+" : ""}
                            {expense.change}%
                          </Badge>
                        </div>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            index === 0
                              ? "bg-blue-500"
                              : index === 1
                              ? "bg-green-500"
                              : "bg-yellow-500"
                          }`}
                          style={{ width: `${expense.percentage}%` }}
                        />
                      </div>
                      <div className="text-sm text-gray-400">
                        {expense.percentage}% of total expenses
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Headcount Growth */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <BarChart3 className="w-5 h-5" />
                  Headcount Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-end justify-between h-32">
                    {headcountData.map((data) => (
                      <div
                        key={data.month}
                        className="flex flex-col items-center gap-2"
                      >
                        <div
                          className="bg-blue-500 rounded-t w-8 transition-all duration-500"
                          style={{
                            height: `${
                              (data.count /
                                Math.max(
                                  ...headcountData.map((d) => d.count)
                                )) *
                              100
                            }%`,
                          }}
                        />
                        <span className="text-xs text-gray-400">
                          {data.month}
                        </span>
                        <span className="text-xs text-white font-medium">
                          {data.count}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400">
                      Average growth:{" "}
                      <span className="text-white font-medium">
                        3.2 employees/month
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* SEC Updates & Market Intelligence */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* SEC Rule Updates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <FileText className="w-5 h-5" />
                  SEC Rule Updates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {secUpdates.map((update) => (
                    <div
                      key={update.id}
                      className="border-l-2 border-gray-700 pl-4 space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="text-white font-medium text-sm leading-tight">
                          {update.title}
                        </h4>
                        <Badge
                          variant="outline"
                          className={`ml-2 ${
                            update.impact === "High"
                              ? "border-red-500/50 text-red-400"
                              : update.impact === "Medium"
                              ? "border-yellow-500/50 text-yellow-400"
                              : "border-green-500/50 text-green-400"
                          }`}
                        >
                          {update.impact}
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-sm">{update.summary}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-xs">
                          {update.date}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-white"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Competitor Stocks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Activity className="w-5 h-5" />
                  Competitor Stocks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {competitorStocks.map((stock) => (
                    <div
                      key={stock.symbol}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {stock.symbol}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{stock.name}</p>
                          <p className="text-gray-400 text-sm">
                            {stock.symbol}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">${stock.price}</p>
                        <div className="flex items-center gap-1">
                          {stock.changePercent > 0 ? (
                            <TrendingUp className="w-3 h-3 text-green-400" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-red-400" />
                          )}
                          <span
                            className={`text-sm ${
                              stock.changePercent > 0
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {stock.changePercent > 0 ? "+" : ""}
                            {stock.changePercent}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Industry News */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Building2 className="w-5 h-5" />
                Industry News & Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {industryNews.map((news) => (
                  <div
                    key={news.id}
                    className="bg-gray-800/50 rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <Badge
                        variant="outline"
                        className={`${
                          news.sentiment === "positive"
                            ? "border-green-500/50 text-green-400"
                            : news.sentiment === "negative"
                            ? "border-red-500/50 text-red-400"
                            : "border-gray-500/50 text-gray-400"
                        }`}
                      >
                        {news.sentiment}
                      </Badge>
                      <span className="text-gray-500 text-xs">{news.time}</span>
                    </div>
                    <h4 className="text-white font-medium text-sm leading-tight">
                      {news.title}
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs">
                        {news.source}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
