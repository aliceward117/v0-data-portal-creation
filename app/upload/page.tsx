"use client"

import { Upload, FileSpreadsheet, X, CheckCircle, AlertCircle, Eye, FileText, Database, Mail, Send } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  description: string
  unit: string
  category: string
  price: number
  sourceFile: string
  ingestedAt: Date
}

export default function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null)
  const [ingestedData, setIngestedData] = useState<PricingItem[]>([])
  const [isIngesting, setIsIngesting] = useState(false)
  
  // Email state
  const [showEmailDialog, setShowEmailDialog] = useState(false)
  const [emailRecipient, setEmailRecipient] = useState("")
  const [emailSubject, setEmailSubject] = useState("Updated Pricing Information - Albion")
  const [emailMessage, setEmailMessage] = useState("Please find below our updated pricing information. If you have any questions, please don't hesitate to contact us.")
  const [isSending, setIsSending] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const generateEmailPreview = () => {
    const categories = [...new Set(ingestedData.map(item => item.category))]
    const itemsByCategory = categories.map(cat => ({
      category: cat,
      items: ingestedData.filter(item => item.category === cat)
    }))
    
    return `
Dear Customer,

${emailMessage}

===========================================
PRICING SCHEDULE
===========================================

${itemsByCategory.map(({ category, items }) => `
--- ${category.toUpperCase()} ---
${items.map(item => `${item.code.padEnd(15)} ${item.description.substring(0, 40).padEnd(42)} ${item.unit.padEnd(8)} £${item.price.toFixed(2)}`).join('\n')}
`).join('\n')}

===========================================

Total Items: ${ingestedData.length}
Date: ${new Date().toLocaleDateString('en-GB')}

Kind regards,
Albion Pricing Team
    `.trim()
  }

  const handleSendEmail = async () => {
    setIsSending(true)
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSending(false)
    setEmailSent(true)
    setTimeout(() => {
      setShowEmailDialog(false)
      setEmailSent(false)
      setEmailRecipient("")
    }, 2000)
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
        // Return only first 10 rows for preview
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

  const ingestPricingData = async (file: UploadedFile) => {
    if (!file.file || !file.name.toLowerCase().endsWith(".csv")) return
    
    setIsIngesting(true)
    
    try {
      const fullData = await readFullFile(file.file)
      if (fullData.length < 2) return
      
      const headers = fullData[0].map(h => h.toLowerCase().trim())
      const rows = fullData.slice(1)
      
      // Find column indices (flexible matching)
      const codeIdx = headers.findIndex(h => h.includes("code") || h.includes("sku") || h.includes("id"))
      const descIdx = headers.findIndex(h => h.includes("description") || h.includes("name") || h.includes("product"))
      const unitIdx = headers.findIndex(h => h.includes("unit") || h.includes("uom"))
      const categoryIdx = headers.findIndex(h => h.includes("category") || h.includes("type") || h.includes("group"))
      const priceIdx = headers.findIndex(h => h.includes("price") || h.includes("cost") || h.includes("amount"))
      
      const newItems: PricingItem[] = rows
        .filter(row => row.some(cell => cell.trim()))
        .map((row, index) => ({
          id: crypto.randomUUID(),
          code: codeIdx >= 0 ? row[codeIdx] || `ITEM-${index + 1}` : `ITEM-${index + 1}`,
          description: descIdx >= 0 ? row[descIdx] || "No description" : row[0] || "No description",
          unit: unitIdx >= 0 ? row[unitIdx] || "EA" : "EA",
          category: categoryIdx >= 0 ? row[categoryIdx] || "Uncategorized" : "Uncategorized",
          price: priceIdx >= 0 ? parseFloat(row[priceIdx]?.replace(/[^0-9.-]/g, "")) || 0 : 0,
          sourceFile: file.name,
          ingestedAt: new Date(),
        }))
      
      // Simulate processing delay
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
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/pdf",
    ]
    const validExtensions = [".csv", ".xls", ".xlsx", ".doc", ".docx", ".pdf"]
    const hasValidType = validTypes.includes(file.type)
    const hasValidExtension = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))
    return hasValidType || hasValidExtension
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
        errorMessage: isValid ? undefined : "Invalid file type. Please upload CSV or Excel files only.",
        file: file,
      }

      setFiles((prev) => [...prev, newFile])

      if (isValid) {
        // Parse CSV preview
        if (file.name.toLowerCase().endsWith(".csv")) {
          const previewData = await readFilePreview(file)
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileId ? { ...f, previewData } : f
            )
          )
        }

        // Simulate upload completion and ingest data
        setTimeout(async () => {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileId
                ? { ...f, status: "success", uploadedAt: new Date() }
                : f
            )
          )
          
          // Auto-ingest pricing data for CSV files
          if (file.name.toLowerCase().endsWith(".csv")) {
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
  }

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith(".csv")) {
      return <FileSpreadsheet className="h-8 w-8 text-accent" />
    }
    return <FileSpreadsheet className="h-8 w-8 text-accent" />
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
                Upload
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

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Upload Pricing Sheets</h1>
            <p className="text-muted-foreground">
              Upload your pricing sheet files in CSV or Excel format to update product pricing data
            </p>
          </div>

          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="upload" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload
              </TabsTrigger>
              <TabsTrigger value="ingested" className="gap-2">
                <Database className="h-4 w-4" />
                Ingested Data
                {ingestedData.length > 0 && (
                  <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-accent text-white">
                    {ingestedData.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="email" className="gap-2">
                <Mail className="h-4 w-4" />
                Email Integration
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload">
          {/* Upload Area */}
          <Card className="mb-8">
            <div
              className={`p-8 border-2 border-dashed rounded-lg transition-colors ${
                isDragging
                  ? "border-accent bg-accent/10"
                  : "border-border hover:border-accent/50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center text-center">
                <div className="mb-4 p-4 rounded-full bg-accent/10">
                  <Upload className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Drop your files here
                </h3>
                <p className="text-muted-foreground mb-4">
                  or click to browse from your computer
                </p>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  multiple
                  accept=".csv,.xls,.xlsx,.doc,.docx,.pdf"
                  onChange={handleFileSelect}
                />
                <Button asChild>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    Select Files
                  </label>
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  Supported formats: CSV, Excel, Word, PDF
                </p>
              </div>
            </div>
          </Card>

          {/* Uploaded Files List */}
          {files.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Uploaded Files ({files.length})
              </h3>
              <div className="space-y-3">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg"
                  >
                    {getFileIcon(file.name)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (file.status === "success" && file.previewData) {
                              setSelectedFileId(selectedFileId === file.id ? null : file.id)
                            }
                          }}
                          className={`font-medium truncate text-left ${
                            file.status === "success" && file.previewData
                              ? "text-accent hover:underline cursor-pointer"
                              : "text-foreground cursor-default"
                          }`}
                        >
                          {file.name}
                        </button>
                        {file.status === "uploading" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            Uploading...
                          </span>
                        )}
                        {file.status === "success" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3" />
                            Uploaded
                          </span>
                        )}
                        {file.status === "error" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <AlertCircle className="h-3 w-3" />
                            Failed
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(file.size)}
                        {file.uploadedAt && (
                          <span className="ml-2">
                            - Uploaded at {file.uploadedAt.toLocaleTimeString()}
                          </span>
                        )}
                      </p>
                      {file.status === "success" && (
                        <p className="text-sm text-green-600 mt-1">File uploaded successfully</p>
                      )}
                      {file.errorMessage && (
                        <p className="text-sm text-destructive mt-1">{file.errorMessage}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {file.status === "uploading" && (
                        <div className="h-5 w-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                      )}
                      {file.status === "success" && (
                        <CheckCircle className="h-5 w-5 text-accent" />
                      )}
                      {file.status === "error" && (
                        <AlertCircle className="h-5 w-5 text-destructive" />
                      )}
                      {file.status === "success" && file.previewData && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedFileId(selectedFileId === file.id ? null : file.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Preview file</span>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove file</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* File Preview */}
          {selectedFileId && (() => {
            const selectedFile = files.find(f => f.id === selectedFileId)
            if (!selectedFile?.previewData || selectedFile.previewData.length === 0) return null
            
            const headers = selectedFile.previewData[0]
            const rows = selectedFile.previewData.slice(1)
            
            return (
              <Card className="mt-8 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Preview: {selectedFile.name}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFileId(null)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close preview</span>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Showing first {rows.length} rows of data
                </p>
                <div className="border rounded-lg overflow-auto max-h-96">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {headers.map((header, index) => (
                          <TableHead key={index} className="font-semibold whitespace-nowrap">
                            {header || `Column ${index + 1}`}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rows.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <TableCell key={cellIndex} className="whitespace-nowrap">
                              {cell}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
  </Table>
  </div>
  </Card>
  )
          })()}

          {/* Ingested Data Preview in Upload Tab */}
          {ingestedData.length > 0 && (
            <Card className="mt-8 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Uploaded Data Preview
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {ingestedData.length} items ingested from your uploaded files
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {isIngesting && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-4 w-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </div>
                  )}
                  <Button
                    onClick={() => setShowEmailDialog(true)}
                    className="gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Send Pricing Email
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-auto max-h-96">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Code</TableHead>
                      <TableHead className="font-semibold">Description</TableHead>
                      <TableHead className="font-semibold">Unit</TableHead>
                      <TableHead className="font-semibold">Category</TableHead>
                      <TableHead className="font-semibold text-right">Price</TableHead>
                      <TableHead className="font-semibold">Source File</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ingestedData.slice(0, 20).map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-sm">{item.code}</TableCell>
                        <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>
                          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                            {item.category}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {item.price > 0 ? `£${item.price.toFixed(2)}` : "-"}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{item.sourceFile}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {ingestedData.length > 20 && (
                <p className="mt-3 text-sm text-muted-foreground text-center">
                  Showing first 20 of {ingestedData.length} items. View the Ingested Data tab for full list.
                </p>
              )}
            </Card>
          )}
            </TabsContent>

            <TabsContent value="ingested">
              {/* Ingested Data Section */}
              {ingestedData.length === 0 ? (
                <Card className="p-12">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="mb-4 p-4 rounded-full bg-muted">
                      <Database className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      No Data Ingested Yet
                    </h3>
                    <p className="text-muted-foreground max-w-md mb-6">
                      Upload a CSV pricing sheet file to see the ingested data here. The data will be automatically processed and displayed for review.
                    </p>
                  </div>
                </Card>
              ) : (
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        Ingested Pricing Data
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {ingestedData.length} items from {[...new Set(ingestedData.map(d => d.sourceFile))].length} file(s)
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {isIngesting && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="h-4 w-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </div>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIngestedData([])}
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-semibold">Code</TableHead>
                          <TableHead className="font-semibold">Description</TableHead>
                          <TableHead className="font-semibold">Unit</TableHead>
                          <TableHead className="font-semibold">Category</TableHead>
                          <TableHead className="font-semibold text-right">Price</TableHead>
                          <TableHead className="font-semibold">Source File</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ingestedData.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-mono text-sm">{item.code}</TableCell>
                            <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                            <TableCell>{item.unit}</TableCell>
                            <TableCell>
                              <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                                {item.category}
                              </span>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {item.price > 0 ? `£${item.price.toFixed(2)}` : "-"}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">{item.sourceFile}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                    <p>Showing all {ingestedData.length} items</p>
                    <p>Last updated: {ingestedData[ingestedData.length - 1]?.ingestedAt.toLocaleString()}</p>
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="email">
              {/* Email Integration Section */}
              {ingestedData.length === 0 ? (
                <Card className="p-12">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="mb-4 p-4 rounded-full bg-muted">
                      <Mail className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      No Data Available for Email
                    </h3>
                    <p className="text-muted-foreground max-w-md mb-6">
                      Upload and ingest pricing data first before sending pricing communication emails.
                    </p>
                  </div>
                </Card>
              ) : (
                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Compose Pricing Email
                    </h3>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="email-recipient">Recipient Email</Label>
                        <Input
                          id="email-recipient"
                          type="email"
                          placeholder="customer@example.com"
                          value={emailRecipient}
                          onChange={(e) => setEmailRecipient(e.target.value)}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="email-subject">Subject</Label>
                        <Input
                          id="email-subject"
                          value={emailSubject}
                          onChange={(e) => setEmailSubject(e.target.value)}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="email-message">Custom Message</Label>
                        <Textarea
                          id="email-message"
                          rows={3}
                          value={emailMessage}
                          onChange={(e) => setEmailMessage(e.target.value)}
                          placeholder="Add a personal message to the email..."
                        />
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-foreground">
                        Email Preview
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {ingestedData.length} pricing items will be included
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4 bg-muted/30 mb-4">
                      <div className="mb-3 pb-3 border-b">
                        <p className="text-sm"><strong>To:</strong> {emailRecipient || "recipient@example.com"}</p>
                        <p className="text-sm"><strong>Subject:</strong> {emailSubject}</p>
                      </div>
                      <pre className="text-sm whitespace-pre-wrap font-mono text-foreground/80 max-h-80 overflow-y-auto">
                        {generateEmailPreview()}
                      </pre>
                    </div>

                    <div className="flex items-center justify-end gap-3">
                      {emailSent ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="h-5 w-5" />
                          <span>Email sent successfully to {emailRecipient}</span>
                        </div>
                      ) : (
                        <Button
                          onClick={handleSendEmail}
                          disabled={!emailRecipient || isSending}
                          className="gap-2"
                        >
                          {isSending ? (
                            <>
                              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4" />
                              Send Pricing Email
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Send Pricing Email
            </DialogTitle>
            <DialogDescription>
              Preview and send the pricing data as an email to your recipients.
            </DialogDescription>
          </DialogHeader>

          {emailSent ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="mb-4 p-4 rounded-full bg-green-100">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Email Sent Successfully
              </h3>
              <p className="text-muted-foreground">
                The pricing email has been sent to {emailRecipient}
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="recipient">Recipient Email</Label>
                  <Input
                    id="recipient"
                    type="email"
                    placeholder="customer@example.com"
                    value={emailRecipient}
                    onChange={(e) => setEmailRecipient(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="message">Custom Message</Label>
                  <Textarea
                    id="message"
                    rows={3}
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    placeholder="Add a personal message to the email..."
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label>Email Preview</Label>
                  <Card className="p-4 bg-muted/30 max-h-80 overflow-y-auto">
                    <div className="mb-3 pb-3 border-b">
                      <p className="text-sm"><strong>To:</strong> {emailRecipient || "recipient@example.com"}</p>
                      <p className="text-sm"><strong>Subject:</strong> {emailSubject}</p>
                    </div>
                    <pre className="text-sm whitespace-pre-wrap font-mono text-foreground/80">
                      {generateEmailPreview()}
                    </pre>
                  </Card>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSendEmail}
                  disabled={!emailRecipient || isSending}
                  className="gap-2"
                >
                  {isSending ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Email
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
