"use client"

import { Upload, FileSpreadsheet, X, CheckCircle, AlertCircle, Mail, Send, FileUp, MessageSquare, ExternalLink, Download, Clock } from "lucide-react"
import Link from "next/link"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type UploadedFile = {
  id: string
  name: string
  size: number
  type: string
  status: "uploading" | "success" | "error"
  uploadedAt?: Date
  errorMessage?: string
  previewData?: string[][]
  file?: File
}

type PricingItem = {
  id: string
  code: string
  currentPrice: number
  newPrice: number
  liveDate: string
  sourceFile: string
  ingestedAt: Date
}

type ActiveSection = "upload" | "email" | "external"

// Sample pricing data for demonstration
const samplePricingData: PricingItem[] = [
  { id: "1", code: "ALB-001", currentPrice: 22.50, newPrice: 24.50, liveDate: "01/04/2026", sourceFile: "March_2026_Prices.csv", ingestedAt: new Date() },
  { id: "2", code: "ALB-002", currentPrice: 3.50, newPrice: 3.75, liveDate: "01/04/2026", sourceFile: "March_2026_Prices.csv", ingestedAt: new Date() },
  { id: "3", code: "ALB-003", currentPrice: 42.00, newPrice: 45.90, liveDate: "01/04/2026", sourceFile: "March_2026_Prices.csv", ingestedAt: new Date() },
  { id: "4", code: "ALB-004", currentPrice: 65.00, newPrice: 67.25, liveDate: "01/04/2026", sourceFile: "March_2026_Prices.csv", ingestedAt: new Date() },
  { id: "5", code: "ALB-005", currentPrice: 17.50, newPrice: 18.30, liveDate: "01/04/2026", sourceFile: "March_2026_Prices.csv", ingestedAt: new Date() },
  { id: "6", code: "ALB-006", currentPrice: 85.00, newPrice: 89.00, liveDate: "01/04/2026", sourceFile: "March_2026_Prices.csv", ingestedAt: new Date() },
  { id: "7", code: "ALB-007", currentPrice: 235.00, newPrice: 245.00, liveDate: "01/04/2026", sourceFile: "March_2026_Prices.csv", ingestedAt: new Date() },
  { id: "8", code: "ALB-008", currentPrice: 11.50, newPrice: 12.50, liveDate: "01/04/2026", sourceFile: "March_2026_Prices.csv", ingestedAt: new Date() },
  { id: "9", code: "ALB-009", currentPrice: 8.25, newPrice: 8.95, liveDate: "01/04/2026", sourceFile: "March_2026_Prices.csv", ingestedAt: new Date() },
  { id: "10", code: "ALB-010", currentPrice: 14.50, newPrice: 15.75, liveDate: "01/04/2026", sourceFile: "March_2026_Prices.csv", ingestedAt: new Date() },
]

export default function PricingCommunicationPage() {
  const [activeSection, setActiveSection] = useState<ActiveSection>("upload")
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [ingestedData, setIngestedData] = useState<PricingItem[]>(samplePricingData)
  const [isIngesting, setIsIngesting] = useState(false)
  const [dataApproved, setDataApproved] = useState(false)
  
  // Email state
  const [emailRecipient, setEmailRecipient] = useState("")
  const [emailSubject, setEmailSubject] = useState("Updated Pricing Information - Albion")
  const [emailMessage, setEmailMessage] = useState("Please find below our updated pricing information. If you have any questions, please don't hesitate to contact us.")
  const [isSending, setIsSending] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  // Email history
  type EmailHistoryItem = {
    id: string
    sentDate: Date
    sentBy: string
    recipientCount: number
    subject: string
    status: "success" | "failed"
  }

  const [emailHistory, setEmailHistory] = useState<EmailHistoryItem[]>([
    {
      id: "1",
      sentDate: new Date("2026-03-10T14:30:00"),
      sentBy: "Alice Johnson",
      recipientCount: 156,
      subject: "March 2026 Pricing Updates",
      status: "success",
    },
    {
      id: "2",
      sentDate: new Date("2026-03-05T09:15:00"),
      sentBy: "Bob Smith",
      recipientCount: 89,
      subject: "Q1 Price Adjustments",
      status: "success",
    },
    {
      id: "3",
      sentDate: new Date("2026-02-28T16:45:00"),
      sentBy: "Alice Johnson",
      recipientCount: 234,
      subject: "February Pricing Communication",
      status: "success",
    },
    {
      id: "4",
      sentDate: new Date("2026-02-15T11:00:00"),
      sentBy: "Carol Williams",
      recipientCount: 45,
      subject: "Special Customer Pricing",
      status: "success",
    },
  ])

  const handleSendEmail = async () => {
    setIsSending(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSending(false)
    setEmailSent(true)
    setTimeout(() => {
      setEmailSent(false)
      setEmailRecipient("")
    }, 3000)
  }

  const exportEmailHistoryToCSV = () => {
    const headers = ["Date", "Time", "Sent By", "Recipients", "Subject", "Status"]
    const rows = emailHistory.map(item => [
      item.sentDate.toLocaleDateString('en-GB'),
      item.sentDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      item.sentBy,
      item.recipientCount.toString(),
      item.subject,
      item.status,
    ])
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n")
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `email_history_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const parseCSV = (text: string): string[][] => {
    const lines = text.split("\n").filter(line => line.trim())
    return lines.map(line => {
      const values: string[] = []
      let current = ""
      let inQuotes = false
      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === "," && !inQuotes) {
          values.push(current.trim())
          current = ""
        } else {
          current += char
        }
      }
      values.push(current.trim())
      return values
    })
  }

  const readFilePreview = async (file: File): Promise<string[][]> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        const data = parseCSV(text)
        resolve(data.slice(0, 10))
      }
      reader.onerror = () => resolve([])
      reader.readAsText(file)
    })
  }

  const readFullFile = async (file: File): Promise<string[][]> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        const data = parseCSV(text)
        resolve(data)
      }
      reader.onerror = () => resolve([])
      reader.readAsText(file)
    })
  }

  const isSpreadsheetFile = (filename: string) => {
    const ext = filename.toLowerCase()
    return ext.endsWith(".csv") || ext.endsWith(".xlsx") || ext.endsWith(".xls")
  }

  const ingestPricingData = async (file: UploadedFile) => {
    if (!file.file || !isSpreadsheetFile(file.name)) {
      return
    }
    
    setIsIngesting(true)
    
    try {
      const fullData = await readFullFile(file.file)
      if (fullData.length < 2) {
        return
      }
      
      const headers = fullData[0].map(h => h.toLowerCase().trim())
      const rows = fullData.slice(1)
      
      // Find column indices (flexible matching)
      const codeIdx = headers.findIndex(h => h.includes("code") || h.includes("sku") || h.includes("id") || h.includes("product"))
      const currentPriceIdx = headers.findIndex(h => h.includes("current") && h.includes("price"))
      const newPriceIdx = headers.findIndex(h => (h.includes("new") && h.includes("price")) || h.includes("price"))
      const dateIdx = headers.findIndex(h => h.includes("date") || h.includes("live") || h.includes("effective"))
      
      const newItems: PricingItem[] = rows
        .filter(row => row.some(cell => cell.trim()))
        .map((row, index) => ({
          id: crypto.randomUUID(),
          code: codeIdx >= 0 ? row[codeIdx] || `ITEM-${index + 1}` : `ITEM-${index + 1}`,
          currentPrice: currentPriceIdx >= 0 ? parseFloat(row[currentPriceIdx]?.replace(/[^0-9.-]/g, "")) || 0 : 0,
          newPrice: newPriceIdx >= 0 ? parseFloat(row[newPriceIdx]?.replace(/[^0-9.-]/g, "")) || 0 : 0,
          liveDate: dateIdx >= 0 ? row[dateIdx] || "TBD" : "TBD",
          sourceFile: file.name,
          ingestedAt: new Date(),
        }))
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIngestedData(prev => [...prev, ...newItems])
    } finally {
      setIsIngesting(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const isValidFileType = (file: File) => {
    const validExtensions = [".csv", ".xlsx", ".xls"]
    return validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))
  }

  const processFiles = useCallback(async (fileList: FileList | null) => {
    if (!fileList) return

    const fileArray = Array.from(fileList)
    
    for (const file of fileArray) {
      const isValid = isValidFileType(file)
      const fileId = crypto.randomUUID()
      
      const newFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        status: isValid ? "uploading" : "error",
        errorMessage: isValid ? undefined : "Invalid file type. Please upload CSV files only.",
        file: file,
      }

      setFiles((prev) => [...prev, newFile])

      if (isValid) {
          if (isSpreadsheetFile(file.name)) {
            const previewData = await readFilePreview(file)
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileId ? { ...f, previewData } : f
            )
          )
        }

        setTimeout(async () => {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileId
                ? { ...f, status: "success", uploadedAt: new Date() }
                : f
            )
          )
          
          if (isSpreadsheetFile(file.name)) {
            const uploadedFile: UploadedFile = {
              id: fileId,
              name: file.name,
              size: file.size,
              type: file.type,
              status: "success",
              file: file,
            }
            await ingestPricingData(uploadedFile)
          }
        }, 1500 + Math.random() * 1000)
      }
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      processFiles(e.dataTransfer.files)
    },
    [processFiles]
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      processFiles(e.target.files)
      e.target.value = ""
    },
    [processFiles]
  )

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
    setIngestedData([])
    setDataApproved(false)
  }

  const clearAllData = () => {
    setFiles([])
    setIngestedData([])
    setDataApproved(false)
  }

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Upload className="h-6 w-6 text-primary" />
              <span className="text-xl font-semibold text-foreground">Albion Insights</span>
            </Link>
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
                href="/upload"
                className="px-3 py-2 text-sm font-medium text-accent border-b-2 border-accent transition-colors"
              >
                Pricing Communication
              </Link>
              <Link
                href="/roles"
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

      {/* Main Content with Sidebar */}
      <div className="flex">
        {/* Sidebar Submenu */}
        <aside className="w-64 border-r border-border bg-card min-h-[calc(100vh-73px)]">
          <div className="p-4">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Pricing Communication
            </h2>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveSection("upload")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                  activeSection === "upload"
                    ? "bg-accent text-white"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <FileUp className="h-5 w-5" />
                <div>
                  <p className="text-sm font-medium">Upload Data</p>
                  <p className={`text-xs ${activeSection === "upload" ? "text-white/70" : "text-muted-foreground"}`}>
                    Import CSV pricing files
                  </p>
                </div>
              </button>
              <button
                onClick={() => setActiveSection("email")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                  activeSection === "email"
                    ? "bg-accent text-white"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <MessageSquare className="h-5 w-5" />
                <div>
                  <p className="text-sm font-medium">Email Communication</p>
                  <p className={`text-xs ${activeSection === "email" ? "text-white/70" : "text-muted-foreground"}`}>
                    Send pricing emails
                  </p>
                </div>
              </button>
              <button
                onClick={() => setActiveSection("external")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                  activeSection === "external"
                    ? "bg-accent text-white"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <ExternalLink className="h-5 w-5" />
                <div>
                  <p className="text-sm font-medium">External Pricing Page</p>
                  <p className={`text-xs ${activeSection === "external" ? "text-white/70" : "text-muted-foreground"}`}>
                    Public pricing link
                  </p>
                </div>
              </button>
            </nav>
          </div>

          {/* Data Status */}
          {ingestedData.length > 0 && (
            <div className="p-4 border-t border-border">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Data Ready</span>
                </div>
                <p className="text-xs text-green-700">
                  {ingestedData.length} pricing items loaded
                </p>
                {dataApproved && (
                  <p className="text-xs text-green-700 mt-1">Data approved for use</p>
                )}
              </div>
            </div>
          )}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8">
          {activeSection === "upload" && (
            <div className="max-w-4xl">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground mb-2">Upload Pricing Data</h1>
                <p className="text-muted-foreground">
                  Upload a CSV file containing your pricing data. The data will be processed and displayed for your approval.
                </p>
              </div>

{/* Upload Area - Always show when no file is being processed */}
              {files.length === 0 && (
                <Card className="p-8">
                  <div
                    className={`border-2 border-dashed rounded-lg p-12 transition-colors ${
                      isDragging
                        ? "border-accent bg-accent/5"
                        : "border-border hover:border-accent/50"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="mb-6 p-4 rounded-full bg-muted">
                        <FileUp className="h-10 w-10 text-muted-foreground" />
                      </div>
<h3 className="text-lg font-semibold text-foreground mb-2">
                        {ingestedData.length > 0 ? "Upload New Pricing Data" : "Upload Pricing Data"}
                      </h3>
                      <p className="text-muted-foreground mb-6 max-w-sm">
                        {ingestedData.length > 0 
                          ? "Upload a new file to replace the current pricing data."
                          : "Upload a CSV or Excel file to get started. Your pricing data will be displayed for review before use."
                        }
                      </p>
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileSelect}
                      />
                      <Button asChild size="lg">
                        <label htmlFor="file-upload" className="cursor-pointer gap-2">
                          <Upload className="h-4 w-4" />
                          Select File
                        </label>
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        Supported formats: CSV, XLSX, XLS
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Current Data Preview - Show when data exists but no file upload in progress */}
              {files.length === 0 && ingestedData.length > 0 && (
                <Card className="p-6 mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {dataApproved ? "Current Pricing Data" : "Review Pricing Data"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {ingestedData.length} items loaded {!dataApproved && "- Pending approval"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {dataApproved ? (
                        <span className="flex items-center gap-1 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                          <CheckCircle className="h-4 w-4" />
                          Approved
                        </span>
                      ) : (
                        <Button onClick={() => setDataApproved(true)} className="gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Approve Data
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={clearAllData}>
                        Clear Data
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg overflow-auto max-h-96">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-semibold">Product Code</TableHead>
                          <TableHead className="font-semibold text-right">Current Price</TableHead>
                          <TableHead className="font-semibold text-right">New Price</TableHead>
                          <TableHead className="font-semibold">Date Pricing Goes Live</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ingestedData.slice(0, 10).map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-mono text-sm">{item.code}</TableCell>
                            <TableCell className="text-right">£{item.currentPrice.toFixed(2)}</TableCell>
                            <TableCell className="text-right font-medium">£{item.newPrice.toFixed(2)}</TableCell>
                            <TableCell>{item.liveDate}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  {ingestedData.length > 10 && (
                    <p className="text-sm text-muted-foreground mt-3 text-center">
                      Showing first 10 of {ingestedData.length} items
                    </p>
                  )}
                </Card>
              )}

              {/* File uploaded - Show processing/preview */}
              {files.length > 0 && (
                <div className="space-y-6">
                  {/* File Info */}
                  <Card className="p-4">
                    {files.map((file) => (
                      <div key={file.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileSpreadsheet className="h-8 w-8 text-accent" />
                          <div>
                            <p className="font-medium text-foreground">{file.name}</p>
                            <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {file.status === "uploading" && (
                            <span className="flex items-center gap-2 text-sm text-amber-600">
                              <div className="h-4 w-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                              Processing...
                            </span>
                          )}
                          {file.status === "success" && (
                            <span className="flex items-center gap-1 text-sm text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              Uploaded
                            </span>
                          )}
                          {file.status === "error" && (
                            <span className="flex items-center gap-1 text-sm text-red-600">
                              <AlertCircle className="h-4 w-4" />
                              {file.errorMessage}
                            </span>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </Card>

                  {/* Data Preview */}
                  {isIngesting && (
                    <Card className="p-8">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-muted-foreground">Processing pricing data...</p>
                      </div>
                    </Card>
                  )}

                  {ingestedData.length > 0 && !isIngesting && (
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">Sample Data Preview</h3>
                          <p className="text-sm text-muted-foreground">
                            Showing first 10 of {ingestedData.length} items. Review and approve to continue.
                          </p>
                        </div>
                        {!dataApproved && (
                          <div className="flex gap-2">
                            <Button variant="outline" onClick={clearAllData}>
                              Reject
                            </Button>
                            <Button onClick={() => setDataApproved(true)}>
                              Approve Data
                            </Button>
                          </div>
                        )}
                        {dataApproved && (
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 text-sm text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              Data Approved
                            </span>
                            <Button variant="outline" size="sm" onClick={clearAllData}>
                              Clear & Start Over
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className="border rounded-lg overflow-auto max-h-96">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted/50">
                              <TableHead className="font-semibold">Product Code</TableHead>
                              <TableHead className="font-semibold text-right">Current Price</TableHead>
                              <TableHead className="font-semibold text-right">New Price</TableHead>
                              <TableHead className="font-semibold">Date Pricing Goes Live</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {ingestedData.slice(0, 10).map((item) => (
                              <TableRow key={item.id}>
                                <TableCell className="font-mono text-sm">{item.code}</TableCell>
                                <TableCell className="text-right">£{item.currentPrice.toFixed(2)}</TableCell>
                                <TableCell className="text-right font-medium">£{item.newPrice.toFixed(2)}</TableCell>
                                <TableCell>{item.liveDate}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </Card>
                  )}
                </div>
              )}
            </div>
          )}

          {activeSection === "email" && (
            <div className="max-w-4xl">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground mb-2">Email Communication</h1>
                <p className="text-muted-foreground">
                  Compose and send pricing communication emails using your approved pricing data.
                </p>
              </div>

              {/* Mailchimp Integration with Pricing Data View */}
              <Card className="p-8">
                <div className="flex flex-col items-center justify-center text-center mb-8">
                  <div className="mb-6 p-4 rounded-full bg-[#FFE01B]/10">
                    <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="#FFE01B"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Send Pricing Data via Mailchimp
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    {ingestedData.length > 0 
                      ? "Review your pricing data below, then use Mailchimp to send professional email campaigns to your customers."
                      : "Upload pricing data first, then use Mailchimp to send professional email campaigns to your customers."
                    }
                  </p>
                  <a 
                    href="https://mailchimp.com/features/email/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button className="gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Open Mailchimp
                    </Button>
                  </a>
                </div>

                {/* Pricing Data Preview Table */}
                {ingestedData.length > 0 ? (
                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-md font-semibold text-foreground">View Pricing Data</h4>
                        <p className="text-sm text-muted-foreground">
                          {ingestedData.length} items {dataApproved ? "(Approved)" : "(Pending approval)"}
                        </p>
                      </div>
                      {!dataApproved && (
                        <Button variant="outline" size="sm" onClick={() => setActiveSection("upload")}>
                          Go to Approval
                        </Button>
                      )}
                    </div>
                    <div className="border rounded-lg overflow-auto max-h-96">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="font-semibold">Product Code</TableHead>
                            <TableHead className="font-semibold text-right">Current Price</TableHead>
                            <TableHead className="font-semibold text-right">New Price</TableHead>
                            <TableHead className="font-semibold">Date Pricing Goes Live</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {ingestedData.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-mono text-sm">{item.code}</TableCell>
                              <TableCell className="text-right">£{item.currentPrice.toFixed(2)}</TableCell>
                              <TableCell className="text-right font-medium">£{item.newPrice.toFixed(2)}</TableCell>
                              <TableCell>{item.liveDate}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ) : (
                  <div className="border-t pt-6">
                    <div className="text-center py-8 text-muted-foreground">
                      <FileSpreadsheet className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No pricing data uploaded yet</p>
                      <Button 
                        variant="link" 
                        onClick={() => setActiveSection("upload")}
                        className="mt-2"
                      >
                        Upload Pricing Data
                      </Button>
                    </div>
                  </div>
                )}
              </Card>

              {/* Email History Table */}
              <Card className="p-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Email History</h3>
                    <p className="text-sm text-muted-foreground">
                      Successfully sent pricing communications
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    onClick={exportEmailHistoryToCSV}
                  >
                    <Download className="h-4 w-4" />
                    Export CSV
                  </Button>
                </div>

                {emailHistory.length > 0 ? (
                  <div className="border rounded-lg overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-semibold">Date</TableHead>
                          <TableHead className="font-semibold">Time</TableHead>
                          <TableHead className="font-semibold">Sent By</TableHead>
                          <TableHead className="font-semibold text-right">Recipients</TableHead>
                          <TableHead className="font-semibold">Subject</TableHead>
                          <TableHead className="font-semibold">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {emailHistory.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              {item.sentDate.toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {item.sentDate.toLocaleTimeString('en-GB', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </TableCell>
                            <TableCell>{item.sentBy}</TableCell>
                            <TableCell className="text-right font-medium">{item.recipientCount}</TableCell>
                            <TableCell className="max-w-[200px] truncate">{item.subject}</TableCell>
                            <TableCell>
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                <CheckCircle className="h-3 w-3" />
                                {item.status}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 border rounded-lg">
                    <Clock className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">No email history yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Sent communications will appear here
                    </p>
                  </div>
                )}
              </Card>
            </div>
          )}

          {activeSection === "external" && (
            <div className="max-w-4xl">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground mb-2">External Pricing Page</h1>
                <p className="text-muted-foreground">
                  Share a public link to your pricing schedule with customers.
                </p>
              </div>

              {/* Public Pricing Page Link */}
              <Card className="p-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-accent/10">
                    <ExternalLink className="h-5 w-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      Public Pricing Link
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Share this link with customers in your email campaigns. They can view the current pricing schedule without needing to log in.
                    </p>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <div className="flex-1 w-full sm:w-auto">
                        <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-sm">
                          <code className="text-foreground truncate">{typeof window !== 'undefined' ? `${window.location.origin}/pricing` : '/pricing'}</code>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const url = typeof window !== 'undefined' ? `${window.location.origin}/pricing` : '/pricing'
                            navigator.clipboard.writeText(url)
                          }}
                        >
                          Copy Link
                        </Button>
                        <Link href="/pricing" target="_blank">
                          <Button size="sm" className="gap-2">
                            <ExternalLink className="h-4 w-4" />
                            Preview Page
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Page Preview */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Page Preview</h3>
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted/50 px-4 py-2 border-b flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="flex-1 text-center">
                      <span className="text-xs text-muted-foreground">/pricing</span>
                    </div>
                  </div>
                  <div className="p-6 bg-background">
                    <div className="text-center mb-6">
                      <h4 className="text-xl font-bold text-foreground mb-2">Pricing Schedule</h4>
                      <p className="text-sm text-muted-foreground">Current pricing information</p>
                    </div>
                    {ingestedData.length > 0 ? (
                      <div className="border rounded-lg overflow-auto max-h-64">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted/50">
                              <TableHead className="font-semibold">Product Code</TableHead>
                              <TableHead className="font-semibold text-right">Current Price</TableHead>
                              <TableHead className="font-semibold text-right">New Price</TableHead>
                              <TableHead className="font-semibold">Effective Date</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {ingestedData.slice(0, 5).map((item) => (
                              <TableRow key={item.id}>
                                <TableCell className="font-mono text-sm">{item.code}</TableCell>
                                <TableCell className="text-right">£{item.currentPrice.toFixed(2)}</TableCell>
                                <TableCell className="text-right font-medium">£{item.newPrice.toFixed(2)}</TableCell>
                                <TableCell>{item.liveDate}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileSpreadsheet className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No pricing data uploaded yet</p>
                      </div>
                    )}
                    {ingestedData.length > 5 && (
                      <p className="text-center text-sm text-muted-foreground mt-4">
                        Showing 5 of {ingestedData.length} items
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
