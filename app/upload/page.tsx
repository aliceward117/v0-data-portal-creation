"use client"

import { Upload, FileSpreadsheet, X, CheckCircle, AlertCircle, Eye } from "lucide-react"
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

export default function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null)

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

        // Simulate upload completion
        setTimeout(() => {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileId
                ? { ...f, status: "success", uploadedAt: new Date() }
                : f
            )
          )
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Upload Pricing Sheets</h1>
            <p className="text-muted-foreground">
              Upload your pricing sheet files in CSV or Excel format to update product pricing data
            </p>
          </div>

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
        </div>
      </main>
    </div>
  )
}
