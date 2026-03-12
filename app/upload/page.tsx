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
  { id: "1", code: "ANTIBAC", currentPrice: 2.79, newPrice: 2.89, liveDate: "01.03.26", sourceFile: "March_2026_Prices.csv", ingestedAt: new Date() },
  { id: "2", code: "ANTIBAC750", currentPrice: 1.89, newPrice: 2.19, liveDate: "01.03.26", sourceFile: "March_2026_Prices.csv", ingestedAt: new Date() },
  { id: "3", code: "APPLEF1", currentPrice: 2.29, newPrice: 2.49, liveDate: "01.03.26", sourceFile: "March_2026_Prices.csv", ingestedAt: new Date() },
  { id: "4", code: "APPLEJM", currentPrice: 8.59, newPrice: 10.59, liveDate: "01.03.26", sourceFile: "March_2026_Prices.csv", ingestedAt: new Date() },
  { id: "5", code: "AVOCADOFRRIPE", currentPrice: 1.09, newPrice: 1.09, liveDate: "01.03.26", sourceFile: "March_2026_Prices.csv", ingestedAt: new Date() },
  { id: "6", code: "BAGPAP8.5", currentPrice: 16.72, newPrice: 16.72, liveDate: "01.03.26", sourceFile: "March_2026_Prices.csv", ingestedAt: new Date() },
  { id: "7", code: "BAKEWELL", currentPrice: 6.39, newPrice: 6.39, liveDate: "01.03.26", sourceFile: "March_2026_Prices.csv", ingestedAt: new Date() },
  { id: "8", code: "BANANAFR", currentPrice: 1.75, newPrice: 1.75, liveDate: "01.03.26", sourceFile: "March_2026_Prices.csv", ingestedAt: new Date() },
  { id: "9", code: "BATHROOMCLEANER", currentPrice: 2.42, newPrice: 2.42, liveDate: "01.03.26", sourceFile: "March_2026_Prices.csv", ingestedAt: new Date() },
  { id: "10", code: "BEERLINECLEA5", currentPrice: 13.95, newPrice: 13.95, liveDate: "01.03.26", sourceFile: "March_2026_Prices.csv", ingestedAt: new Date() },
  { id: "11", code: "BEETROOTJUICE", currentPrice: 3.39, newPrice: 3.40, liveDate: "01.03.26", sourceFile: "March_2026_Prices.csv", ingestedAt: new Date() },
  { id: "12", code: "BISCLOTUS", currentPrice: 17.20, newPrice: 17.98, liveDate: "01.03.26", sourceFile: "March_2026_Prices.csv", ingestedAt: new Date() },
  { id: "13", code: "BLEACHTHICK5", currentPrice: 4.98, newPrice: 5.39, liveDate: "01.03.26", sourceFile: "March_2026_Prices.csv", ingestedAt: new Date() },
  { id: "14", code: "BLUEBERRFR", currentPrice: 1.89, newPrice: 1.91, liveDate: "01.03.26", sourceFile: "March_2026_Prices.csv", ingestedAt: new Date() },
  { id: "15", code: "BLUEBERRFZ", currentPrice: 6.22, newPrice: 6.22, liveDate: "01.03.26", sourceFile: "March_2026_Prices.csv", ingestedAt: new Date() },
  { id: "16", code: "BLUETOWEL", currentPrice: 12.29, newPrice: 9.98, liveDate: "01.03.26", sourceFile: "March_2026_Prices.csv", ingestedAt: new Date() },
  { id: "17", code: "BREADMALTBLOOM", currentPrice: 2.19, newPrice: 2.19, liveDate: "01.03.26", sourceFile: "March_2026_Prices.csv", ingestedAt: new Date() },
  { id: "18", code: "BREADWHOLTHCF", currentPrice: 1.89, newPrice: 1.89, liveDate: "01.03.26", sourceFile: "March_2026_Prices.csv", ingestedAt: new Date() },
  { id: "19", code: "BREADWHTHCF", currentPrice: 1.89, newPrice: 1.89, liveDate: "01.03.26", sourceFile: "March_2026_Prices.csv", ingestedAt: new Date() },
  { id: "20", code: "BRUSHWIRE", currentPrice: 4.99, newPrice: 4.99, liveDate: "01.03.26", sourceFile: "March_2026_Prices.csv", ingestedAt: new Date() },
  { id: "21", code: "BURRATAV100", currentPrice: 1.69, newPrice: 1.69, liveDate: "01.03.26", sourceFile: "March_2026_Prices.csv", ingestedAt: new Date() },
  { id: "22", code: "BUTTBEANSA10", currentPrice: 4.69, newPrice: 4.69, liveDate: "01.03.26", sourceFile: "March_2026_Prices.csv", ingestedAt: new Date() },
  { id: "23", code: "CAKEFDAPPLE", currentPrice: 16.39, newPrice: 16.39, liveDate: "01.03.26", sourceFile: "March_2026_Prices.csv", ingestedAt: new Date() },
  { id: "24", code: "CAKEFDPECAN", currentPrice: 15.75, newPrice: 16.39, liveDate: "01.03.26", sourceFile: "March_2026_Prices.csv", ingestedAt: new Date() },
  { id: "25", code: "CAKEFRCARR", currentPrice: 15.89, newPrice: 15.89, liveDate: "01.03.26", sourceFile: "March_2026_Prices.csv", ingestedAt: new Date() },
  { id: "26", code: "CAKEFRCHOC", currentPrice: 19.29, newPrice: 19.86, liveDate: "01.03.26", sourceFile: "March_2026_Prices.csv", ingestedAt: new Date() },
  { id: "27", code: "CAPERSLILI", currentPrice: 15.39, newPrice: 15.39, liveDate: "01.03.26", sourceFile: "March_2026_Prices.csv", ingestedAt: new Date() },
  { id: "28", code: "CAWSAPPLE", currentPrice: 23.54, newPrice: 23.54, liveDate: "01.03.26", sourceFile: "March_2026_Prices.csv", ingestedAt: new Date() },
  { id: "29", code: "CELERYHEAD", currentPrice: 0.95, newPrice: 0.97, liveDate: "01.03.26", sourceFile: "March_2026_Prices.csv", ingestedAt: new Date() },
]

export default function PricingCommunicationPage() {
  const [activeSection, setActiveSection] = useState<ActiveSection>("upload")
  const [emailSubSection, setEmailSubSection] = useState<"campaigns" | "history">("campaigns")
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [ingestedData, setIngestedData] = useState<PricingItem[]>([])
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
    recipients: string[] // Array of email addresses
    subject: string
    status: "success" | "failed"
  }

  // Helper to generate sample email addresses
  const generateSampleEmails = (count: number, prefix: string): string[] => {
    const domains = ["gmail.com", "outlook.com", "company.co.uk", "business.com", "email.org"]
    const firstNames = ["john", "jane", "mike", "sarah", "david", "emma", "chris", "lisa", "tom", "anna"]
    const lastNames = ["smith", "jones", "brown", "wilson", "taylor", "davies", "evans", "thomas", "johnson", "roberts"]
    
    return Array.from({ length: count }, (_, i) => {
      const firstName = firstNames[i % firstNames.length]
      const lastName = lastNames[Math.floor(i / firstNames.length) % lastNames.length]
      const domain = domains[i % domains.length]
      return `${firstName}.${lastName}${i > 9 ? i : ""}@${domain}`
    })
  }

  const [emailHistory, setEmailHistory] = useState<EmailHistoryItem[]>([
    {
      id: "1",
      sentDate: new Date("2026-03-10T14:30:00"),
      sentBy: "Alice Johnson",
      recipientCount: 156,
      recipients: generateSampleEmails(156, "march"),
      subject: "March 2026 Pricing Updates",
      status: "success",
    },
    {
      id: "2",
      sentDate: new Date("2026-03-05T09:15:00"),
      sentBy: "Bob Smith",
      recipientCount: 89,
      recipients: generateSampleEmails(89, "q1"),
      subject: "Q1 Price Adjustments",
      status: "success",
    },
    {
      id: "3",
      sentDate: new Date("2026-02-28T16:45:00"),
      sentBy: "Alice Johnson",
      recipientCount: 234,
      recipients: generateSampleEmails(234, "feb"),
      subject: "February Pricing Communication",
      status: "success",
    },
    {
      id: "4",
      sentDate: new Date("2026-02-15T11:00:00"),
      sentBy: "Carol Williams",
      recipientCount: 45,
      recipients: generateSampleEmails(45, "special"),
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

  // Mailchimp campaign state
  type Campaign = {
    id: string
    name: string
    subject: string
    previewText: string
    status: "draft" | "scheduled" | "sent"
    createdAt: Date
    recipientCount: number
  }

  const [campaigns] = useState<Campaign[]>([
    {
      id: "1",
      name: "March 2026 Price Update",
      subject: "Important: Updated Pricing Schedule",
      previewText: "Please review our updated pricing effective from 01.03.26",
      status: "draft",
      createdAt: new Date("2026-03-10"),
      recipientCount: 156,
    },
    {
      id: "2",
      name: "Q1 Customer Newsletter",
      subject: "Your Q1 Pricing Update from Albion",
      previewText: "New prices and product updates for Q1 2026",
      status: "draft",
      createdAt: new Date("2026-03-08"),
      recipientCount: 234,
    },
    {
      id: "3",
      name: "Special Accounts Price Notice",
      subject: "Exclusive Pricing for Valued Customers",
      previewText: "Thank you for your continued partnership",
      status: "scheduled",
      createdAt: new Date("2026-03-05"),
      recipientCount: 45,
    },
  ])

  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [previewExpanded, setPreviewExpanded] = useState(true)

  const exportSingleEmailToCSV = (item: EmailHistoryItem) => {
    const headers = ["Date", "Time", "Sent By", "Recipient Email", "Subject", "Status"]
    
    // Create one row per recipient email address
    const rows = item.recipients.map(email => [
      item.sentDate.toLocaleDateString('en-GB'),
      item.sentDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      item.sentBy,
      email,
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
    link.download = `email_${item.sentDate.toISOString().split('T')[0]}_${item.id}.csv`
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

{/* Upload Area - Always visible for drag and drop */}
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

              {/* Current Data Preview - Show when data exists */}
              {ingestedData.length > 0 && (
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
<Button onClick={() => {
  setDataApproved(true)
  setActiveSection("email")
  setEmailSubSection("campaigns")
  }} className="gap-2">
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
                          <TableHead className="font-semibold text-right">Price</TableHead>
                          <TableHead className="font-semibold">Date pricing goes live</TableHead>
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
<Button onClick={() => {
  setDataApproved(true)
  setActiveSection("email")
  setEmailSubSection("campaigns")
  }}>
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
                              <TableHead className="font-semibold text-right">Price</TableHead>
                              <TableHead className="font-semibold">Date pricing goes live</TableHead>
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
  <div className="mb-6">
  <h1 className="text-2xl font-bold text-foreground mb-2">Email Communication</h1>
  <p className="text-muted-foreground">
  Compose and send pricing communication emails using your approved pricing data.
  </p>
  </div>

  {/* Sub-navigation tabs */}
  <div className="flex gap-1 p-1 bg-muted rounded-lg mb-6 w-fit">
    <button
      onClick={() => setEmailSubSection("campaigns")}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        emailSubSection === "campaigns"
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      Campaigns
    </button>
    <button
      onClick={() => setEmailSubSection("history")}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        emailSubSection === "history"
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      Email History
    </button>
  </div>

  {emailSubSection === "campaigns" && (
              <div>
              {/* Campaign Selection */}
              <Card className="p-6 mb-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Select Campaign</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose a Mailchimp campaign to send your pricing communication
                  </p>
                </div>

                <div className="space-y-3">
                  {campaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      onClick={() => setSelectedCampaign(campaign)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedCampaign?.id === campaign.id
                          ? "border-accent bg-accent/5 ring-1 ring-accent"
                          : "border-border hover:border-accent/50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-foreground">{campaign.name}</h4>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              campaign.status === "draft" 
                                ? "bg-yellow-100 text-yellow-700"
                                : campaign.status === "scheduled"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                            }`}>
                              {campaign.status}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{campaign.subject}</p>
                          <p className="text-xs text-muted-foreground">{campaign.recipientCount} recipients</p>
                        </div>
                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                          selectedCampaign?.id === campaign.id
                            ? "border-accent bg-accent"
                            : "border-muted-foreground/30"
                        }`}>
                          {selectedCampaign?.id === campaign.id && (
                            <CheckCircle className="h-3 w-3 text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Campaign Preview */}
              {selectedCampaign && (
                <Card className="p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <button 
                      onClick={() => setPreviewExpanded(!previewExpanded)}
                      className="flex items-center gap-2 text-left"
                    >
                      <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${previewExpanded ? "" : "-rotate-90"}`} />
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">Campaign Preview</h3>
                        <p className="text-sm text-muted-foreground">{selectedCampaign.name} - {selectedCampaign.recipientCount} recipients</p>
                      </div>
                    </button>
                    <div className="flex items-center gap-2">
                      <a 
                        href="https://mailchimp.com/features/email/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" className="gap-2">
                          <ExternalLink className="h-4 w-4" />
                          Edit in Mailchimp
                        </Button>
                      </a>
                      <a 
                        href="https://mailchimp.com/features/email/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Button className="gap-2">
                          <Send className="h-4 w-4" />
                          Send Campaign
                        </Button>
                      </a>
                    </div>
                  </div>

                  {/* Email Preview - Collapsible */}
                  {previewExpanded && (
                  <div className="border rounded-lg overflow-hidden bg-white">
                    {/* Email Header */}
                    <div className="bg-muted/30 p-4 border-b">
                      <div className="space-y-2 text-sm">
                        <div className="flex">
                          <span className="text-muted-foreground w-20">From:</span>
                          <span className="text-foreground">Albion Pricing Team &lt;pricing@albion.co.uk&gt;</span>
                        </div>
                        <div className="flex">
                          <span className="text-muted-foreground w-20">To:</span>
                          <span className="text-foreground">{selectedCampaign.recipientCount} recipients</span>
                        </div>
                        <div className="flex">
                          <span className="text-muted-foreground w-20">Subject:</span>
                          <span className="text-foreground font-medium">{selectedCampaign.subject}</span>
                        </div>
                      </div>
                    </div>

                    {/* Email Body */}
                    <div className="p-6">
                      <div className="max-w-lg mx-auto">
                        {/* Logo placeholder */}
                        <div className="text-center mb-6">
                          <div className="inline-block bg-accent/10 px-6 py-3 rounded">
                            <span className="text-xl font-bold text-accent">ALBION</span>
                          </div>
                        </div>

                        <h2 className="text-xl font-semibold text-foreground mb-4">Updated Pricing Schedule</h2>
                        
                        <p className="text-muted-foreground mb-4">
                          Dear Valued Customer,
                        </p>
                        
                        <p className="text-muted-foreground mb-4">
                          {selectedCampaign.previewText}. Below you will find a summary of the updated prices for your reference.
                        </p>

                        {/* Sample pricing table in email */}
                        {ingestedData.length > 0 && (
                          <div className="my-6 border rounded overflow-hidden">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="bg-muted/50">
                                  <th className="text-left p-2 font-medium">Product</th>
                                  <th className="text-right p-2 font-medium">Current</th>
                                  <th className="text-right p-2 font-medium">New</th>
                                </tr>
                              </thead>
                              <tbody>
                                {ingestedData.slice(0, 5).map((item) => (
                                  <tr key={item.id} className="border-t">
                                    <td className="p-2 font-mono text-xs">{item.code}</td>
                                    <td className="p-2 text-right">£{item.currentPrice.toFixed(2)}</td>
                                    <td className="p-2 text-right font-medium">£{item.newPrice.toFixed(2)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            {ingestedData.length > 5 && (
                              <div className="text-center py-2 bg-muted/30 text-xs text-muted-foreground">
                                + {ingestedData.length - 5} more items
                              </div>
                            )}
                          </div>
                        )}

                        <p className="text-muted-foreground mb-4">
                          These prices will be effective from <strong>{ingestedData[0]?.liveDate || "the scheduled date"}</strong>. Please contact us if you have any questions.
                        </p>

                        <p className="text-muted-foreground mb-2">
                          Best regards,
                        </p>
                        <p className="text-muted-foreground font-medium">
                          The Albion Pricing Team
                        </p>

                        {/* Footer */}
                        <div className="mt-8 pt-4 border-t text-center text-xs text-muted-foreground">
                          <p>Albion Ltd | 123 Business Park | London, UK</p>
                          <p className="mt-1">
                            <a href="#" className="text-accent hover:underline">View online</a>
                            {" | "}
                            <a href="#" className="text-accent hover:underline">Unsubscribe</a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  )}
                </Card>
              )}

              {/* Pricing Data Preview Table - Only shows when data is uploaded */}
                {ingestedData.length > 0 && (
                  <Card className="p-6 mb-6">
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
                            <TableHead className="font-semibold text-right">Price</TableHead>
                            <TableHead className="font-semibold">Date pricing goes live</TableHead>
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
</Card>
              )}
            </div>
          )}

  {emailSubSection === "history" && (
  <div>
  {/* Email History Table */}
  <Card className="p-6">
  <div className="mb-4">
  <h3 className="text-lg font-semibold text-foreground">Email History</h3>
  <p className="text-sm text-muted-foreground">
  Successfully sent pricing communications
                  </p>
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
                          <TableHead className="font-semibold text-right">Export</TableHead>
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
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-1 h-8"
                                onClick={() => exportSingleEmailToCSV(item)}
                              >
                                <Download className="h-4 w-4" />
                                CSV
                              </Button>
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
                              <TableHead className="font-semibold text-right">Price</TableHead>
                              <TableHead className="font-semibold">Date pricing goes live</TableHead>
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
