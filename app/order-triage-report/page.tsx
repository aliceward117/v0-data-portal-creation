"use client"

import {
  Database,
  ArrowLeft,
  TrendingUp,
  AlertTriangle,
  Package,
  Truck,
  Users,
  ShoppingCart,
  Download,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { useState } from "react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export default function OrderTriageReport() {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: new Date(2024, 11, 11), // Dec 11, 2024
    to: new Date(2024, 11, 17), // Dec 17, 2024
  })
  const [displayMonth, setDisplayMonth] = useState(new Date(2024, 11)) // December 2024

  // Issue trends over last 7 days
  const trendData = [
    { date: "Dec 11", pickers: 12, loaders: 8, transport: 5, sales: 3 },
    { date: "Dec 12", pickers: 15, loaders: 6, transport: 7, sales: 4 },
    { date: "Dec 13", pickers: 10, loaders: 9, transport: 6, sales: 2 },
    { date: "Dec 14", pickers: 13, loaders: 7, transport: 8, sales: 5 },
    { date: "Dec 15", pickers: 9, loaders: 10, transport: 4, sales: 3 },
    { date: "Dec 16", pickers: 14, loaders: 5, transport: 9, sales: 6 },
    { date: "Dec 17", pickers: 11, loaders: 8, transport: 7, sales: 4 },
  ]

  // Issues by department
  const departmentData = [
    { department: "Warehouse Pickers", issues: 84, color: "hsl(var(--chart-1))" },
    { department: "Warehouse Loaders", issues: 53, color: "hsl(var(--chart-2))" },
    { department: "Transport", issues: 46, color: "hsl(var(--chart-3))" },
    { department: "Sales", issues: 27, color: "hsl(var(--chart-4))" },
  ]

  // Detailed issue breakdown by type
  const pickerIssues = [
    { type: "Picking error", count: 32 },
    { type: "Damaged / OOD", count: 18 },
    { type: "Input error", count: 15 },
    { type: "Duplicate Order", count: 12 },
    { type: "Other", count: 7 },
  ]

  const loaderIssues = [
    { type: "Loading error", count: 28 },
    { type: "Forgot to Load", count: 15 },
    { type: "Other", count: 10 },
  ]

  const transportIssues = [
    { type: "Forgot to Deliver", count: 19 },
    { type: "Driver Process error", count: 14 },
    { type: "No Key", count: 8 },
    { type: "Customer Closed", count: 5 },
  ]

  const salesIssues = [
    { type: "Customer Rejected", count: 15 },
    { type: "Customer error", count: 9 },
    { type: "Other", count: 3 },
  ]

  const totalIssues = departmentData.reduce((sum, dept) => sum + dept.issues, 0)

  const exportToWord = async () => {
    try {
      const {
        Document,
        Paragraph,
        TextRun,
        HeadingLevel,
        Table,
        TableCell,
        TableRow,
        WidthType,
        AlignmentType,
        Packer,
      } = await import("docx")
      const { saveAs } = await import("file-saver")

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                text: "Order Triage Report",
                heading: HeadingLevel.HEADING_1,
                spacing: { after: 200 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Report Period: ${dateRange.from ? format(dateRange.from, "PPP") : "N/A"} - ${dateRange.to ? format(dateRange.to, "PPP") : "N/A"}`,
                    bold: true,
                  }),
                ],
                spacing: { after: 400 },
              }),
              new Paragraph({
                text: "Executive Summary",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 300, after: 200 },
              }),
              new Paragraph({
                children: [new TextRun(`Total Issues Recorded: ${totalIssues}`)],
                spacing: { after: 100 },
              }),
              new Paragraph({
                children: [
                  new TextRun(
                    `Date Range: ${dateRange.from && dateRange.to ? `${format(dateRange.from, "PPP")} to ${format(dateRange.to, "PPP")}` : "Last 7 days"}`,
                  ),
                ],
                spacing: { after: 400 },
              }),
              new Paragraph({
                text: "Issues by Department",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 300, after: 200 },
              }),
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph({ text: "Department", bold: true })] }),
                      new TableCell({ children: [new Paragraph({ text: "Total Issues", bold: true })] }),
                      new TableCell({ children: [new Paragraph({ text: "Percentage", bold: true })] }),
                    ],
                  }),
                  ...departmentData.map(
                    (dept) =>
                      new TableRow({
                        children: [
                          new TableCell({ children: [new Paragraph(dept.department)] }),
                          new TableCell({ children: [new Paragraph(dept.issues.toString())] }),
                          new TableCell({
                            children: [new Paragraph(`${((dept.issues / totalIssues) * 100).toFixed(1)}%`)],
                          }),
                        ],
                      }),
                  ),
                ],
              }),
              new Paragraph({
                text: "Warehouse Pickers - Detailed Breakdown",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 400, after: 200 },
              }),
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph({ text: "Issue Type", bold: true })] }),
                      new TableCell({ children: [new Paragraph({ text: "Count", bold: true })] }),
                    ],
                  }),
                  ...pickerIssues.map(
                    (issue) =>
                      new TableRow({
                        children: [
                          new TableCell({ children: [new Paragraph(issue.type)] }),
                          new TableCell({ children: [new Paragraph(issue.count.toString())] }),
                        ],
                      }),
                  ),
                ],
              }),
              new Paragraph({
                text: "Warehouse Loaders - Detailed Breakdown",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 400, after: 200 },
              }),
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph({ text: "Issue Type", bold: true })] }),
                      new TableCell({ children: [new Paragraph({ text: "Count", bold: true })] }),
                    ],
                  }),
                  ...loaderIssues.map(
                    (issue) =>
                      new TableRow({
                        children: [
                          new TableCell({ children: [new Paragraph(issue.type)] }),
                          new TableCell({ children: [new Paragraph(issue.count.toString())] }),
                        ],
                      }),
                  ),
                ],
              }),
              new Paragraph({
                text: "Transport - Detailed Breakdown",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 400, after: 200 },
              }),
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph({ text: "Issue Type", bold: true })] }),
                      new TableCell({ children: [new Paragraph({ text: "Count", bold: true })] }),
                    ],
                  }),
                  ...transportIssues.map(
                    (issue) =>
                      new TableRow({
                        children: [
                          new TableCell({ children: [new Paragraph(issue.type)] }),
                          new TableCell({ children: [new Paragraph(issue.count.toString())] }),
                        ],
                      }),
                  ),
                ],
              }),
              new Paragraph({
                text: "Sales - Detailed Breakdown",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 400, after: 200 },
              }),
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph({ text: "Issue Type", bold: true })] }),
                      new TableCell({ children: [new Paragraph({ text: "Count", bold: true })] }),
                    ],
                  }),
                  ...salesIssues.map(
                    (issue) =>
                      new TableRow({
                        children: [
                          new TableCell({ children: [new Paragraph(issue.type)] }),
                          new TableCell({ children: [new Paragraph(issue.count.toString())] }),
                        ],
                      }),
                  ),
                ],
              }),
              new Paragraph({
                text: "Daily Trend Analysis",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 400, after: 200 },
              }),
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph({ text: "Date", bold: true })] }),
                      new TableCell({ children: [new Paragraph({ text: "Pickers", bold: true })] }),
                      new TableCell({ children: [new Paragraph({ text: "Loaders", bold: true })] }),
                      new TableCell({ children: [new Paragraph({ text: "Transport", bold: true })] }),
                      new TableCell({ children: [new Paragraph({ text: "Sales", bold: true })] }),
                    ],
                  }),
                  ...trendData.map(
                    (day) =>
                      new TableRow({
                        children: [
                          new TableCell({ children: [new Paragraph(day.date)] }),
                          new TableCell({ children: [new Paragraph(day.pickers.toString())] }),
                          new TableCell({ children: [new Paragraph(day.loaders.toString())] }),
                          new TableCell({ children: [new Paragraph(day.transport.toString())] }),
                          new TableCell({ children: [new Paragraph(day.sales.toString())] }),
                        ],
                      }),
                  ),
                ],
              }),
            ],
          },
        ],
      })

      const blob = await Packer.toBlob(doc)
      const fileName = `Order_Triage_Report_${dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : "from"}_to_${dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : "to"}.docx`
      saveAs(blob, fileName)
    } catch (error) {
      console.error("Error generating Word document:", error)
      alert("Failed to generate Word document. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Database className="h-6 w-6 text-primary" />
              <span className="text-xl font-semibold text-foreground">Albion Insights</span>
            </div>
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/"
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-accent hover:border-b-2 hover:border-accent transition-colors"
              >
                Overview
              </Link>
              <Link
                href="/order-triage"
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-accent hover:border-b-2 hover:border-accent transition-colors"
              >
                Order Triage
              </Link>
<Link
> href="/roles"
  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-accent hover:border-b-2 hover:border-accent transition-colors"
  >
  Roles
  </Link>
  <Link
  href="/users"
  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-accent hover:border-b-2 hover:border-accent transition-colors"
  >
  Users
  </Link>
  </nav>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-md transition-colors">
              Help
            </button>
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-xs font-medium text-primary-foreground">AD</span>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/order-triage" className="p-2 hover:bg-muted rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Order Triage Report</h1>
              <p className="text-muted-foreground mt-1">Issues tracking and analytics by department</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[280px] justify-start text-left font-normal bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from && dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <div className="flex">
                  {/* Month sidebar */}
                  <div className="border-r border-border p-2 flex flex-col justify-between min-w-[80px]">
                    <button
                      onClick={() => setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() - 1))}
                      className="p-2 hover:bg-accent rounded-md"
                    >
                      <ChevronLeftIcon className="h-4 w-4" />
                    </button>
                    <div className="flex flex-col gap-1 py-4">
                      {["Aug", "Sep", "Oct", "Nov", "Dec"].map((month, idx) => {
                        const monthNum = 7 + idx // Aug = 7, Sep = 8, etc.
                        const isActive = displayMonth.getMonth() === monthNum
                        return (
                          <button
                            key={month}
                            onClick={() => setDisplayMonth(new Date(displayMonth.getFullYear(), monthNum))}
                            className={cn(
                              "px-3 py-1 text-sm rounded-md transition-colors",
                              isActive ? "bg-accent font-medium" : "hover:bg-accent/50",
                            )}
                          >
                            {month}
                          </button>
                        )
                      })}
                    </div>
                    <button
                      onClick={() => setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1))}
                      className="p-2 hover:bg-accent rounded-md"
                    >
                      <ChevronRightIcon className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Calendar area */}
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={() =>
                          setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() - 1))
                        }
                        className="p-1 hover:bg-accent rounded-md"
                      >
                        <ChevronLeftIcon className="h-5 w-5" />
                      </button>
                      <h3 className="text-lg font-medium text-primary">{format(displayMonth, "MMMM yyyy")}</h3>
                      <button
                        onClick={() =>
                          setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1))
                        }
                        className="p-1 hover:bg-accent rounded-md"
                      >
                        <ChevronRightIcon className="h-5 w-5" />
                      </button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const today = new Date()
                          setDisplayMonth(today)
                          setDateRange({ from: today, to: today })
                        }}
                        className="ml-4"
                      >
                        Today
                      </Button>
                    </div>
                    <Calendar
                      mode="range"
                      selected={{ from: dateRange.from, to: dateRange.to }}
                      onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                      month={displayMonth}
                      onMonthChange={setDisplayMonth}
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Button onClick={exportToWord} className="bg-accent hover:bg-accent/90 text-white">
              <Download className="mr-2 h-4 w-4" />
              Export to Word
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalIssues}</div>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Warehouse Pickers</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{departmentData[0].issues}</div>
              <p className="text-xs text-muted-foreground">40% of total issues</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Warehouse Loaders</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{departmentData[1].issues}</div>
              <p className="text-xs text-muted-foreground">25% of total issues</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transport & Sales</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{departmentData[2].issues + departmentData[3].issues}</div>
              <p className="text-xs text-muted-foreground">35% of total issues</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Issues Trend Over Time */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Issues Trend Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="pickers" stroke="hsl(var(--chart-1))" name="Pickers" strokeWidth={2} />
                  <Line type="monotone" dataKey="loaders" stroke="hsl(var(--chart-2))" name="Loaders" strokeWidth={2} />
                  <Line
                    type="monotone"
                    dataKey="transport"
                    stroke="hsl(var(--chart-3))"
                    name="Transport"
                    strokeWidth={2}
                  />
                  <Line type="monotone" dataKey="sales" stroke="hsl(var(--chart-4))" name="Sales" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Issues by Department */}
          <Card>
            <CardHeader>
              <CardTitle>Issues by Department</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ department, issues }) => `${department}: ${issues}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="issues"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Department Breakdowns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Warehouse Pickers Issues */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-[hsl(var(--chart-1))]" />
                Warehouse Pickers Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={pickerIssues} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="type" type="category" width={120} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--chart-1))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Warehouse Loaders Issues */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[hsl(var(--chart-2))]" />
                Warehouse Loaders Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={loaderIssues} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="type" type="category" width={120} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--chart-2))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Transport Issues */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-[hsl(var(--chart-3))]" />
                Transport Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={transportIssues} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="type" type="category" width={150} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--chart-3))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Sales Issues */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-[hsl(var(--chart-4))]" />
                Sales Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={salesIssues} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="type" type="category" width={120} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--chart-4))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
