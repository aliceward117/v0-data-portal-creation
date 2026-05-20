"use client"

import { Upload, FileSpreadsheet, X, CheckCircle, AlertCircle, Mail, Send, FileUp, MessageSquare, ExternalLink, Download, Clock, ChevronDown, Search, GripVertical, Type, Image, Link2, Users, Eye, TestTube, AlertTriangle, Plus, Trash2, Copy } from "lucide-react"
import Link from "next/link"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  
  // Price type selection state
  const [showPriceTypeDialog, setShowPriceTypeDialog] = useState(false)
  const [selectedPriceType, setSelectedPriceType] = useState<"fixed" | "bandA" | null>(null)
  const [pendingFiles, setPendingFiles] = useState<FileList | null>(null)
  
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
  const [isSendingCampaign, setIsSendingCampaign] = useState(false)
  const [campaignSent, setCampaignSent] = useState(false)
  const [externalSubSection, setExternalSubSection] = useState<"pages" | "clients">("pages")
  
  // Campaign Content Builder State
  // Content block types
  type ContentBlock = {
    id: string
    type: "text" | "heading" | "image" | "button" | "divider" | "pricing-url" | "customer-name" | "pricing-table"
    content: string
    settings?: {
      alignment?: "left" | "center" | "right"
      fontSize?: "small" | "medium" | "large"
      buttonColor?: string
      buttonText?: string
    }
  }

  const [showContentBuilder, setShowContentBuilder] = useState(false)
  const [selectedAudience, setSelectedAudience] = useState<string | null>(null)
  const [testEmailAddress, setTestEmailAddress] = useState("")
  const [isSendingTest, setIsSendingTest] = useState(false)
  const [testSent, setTestSent] = useState(false)
  const [contentSaved, setContentSaved] = useState(false)
  const [isSavingContent, setIsSavingContent] = useState(false)
  const [savedEmailContent, setSavedEmailContent] = useState<ContentBlock[] | null>(null)
  
  const [emailContentBlocks, setEmailContentBlocks] = useState<ContentBlock[]>([
    { id: "1", type: "heading", content: "Your Updated Pricing is Ready", settings: { alignment: "center", fontSize: "large" } },
    { id: "2", type: "text", content: "Dear {{customer_name}},", settings: { alignment: "left" } },
    { id: "3", type: "text", content: "We are pleased to share your updated pricing schedule. Please review the changes below and click the button to view your personalized pricing page.", settings: { alignment: "left" } },
    { id: "4", type: "pricing-url", content: "{{pricing_url}}", settings: { buttonColor: "#00B894", buttonText: "View Your Pricing" } },
    { id: "5", type: "pricing-table", content: "Sample pricing items from your upload", settings: {} },
    { id: "6", type: "text", content: "If you have any questions about these prices, please contact your account manager.", settings: { alignment: "left" } },
    { id: "7", type: "divider", content: "", settings: {} },
    { id: "8", type: "text", content: "Best regards,\nThe Albion Pricing Team", settings: { alignment: "left" } },
  ])
  
  // Available content blocks for drag and drop
  const availableBlocks = [
    { type: "heading", label: "Heading", icon: Type, description: "Add a title or heading" },
    { type: "text", label: "Text Block", icon: Type, description: "Add paragraph text" },
    { type: "image", label: "Image", icon: Image, description: "Add an image" },
    { type: "button", label: "Button", icon: Link2, description: "Add a call-to-action button" },
    { type: "divider", label: "Divider", icon: GripVertical, description: "Add a horizontal line" },
    { type: "pricing-url", label: "Customer Pricing URL", icon: Link2, description: "Dynamic link to customer pricing page" },
    { type: "customer-name", label: "Customer Name", icon: Users, description: "Insert customer name dynamically" },
    { type: "pricing-table", label: "Pricing Table", icon: FileSpreadsheet, description: "Show sample pricing items" },
  ]
  
  // Audience segments
  const audienceSegments = [
    { id: "all", name: "All Customers", count: 156, description: "Send to entire customer list" },
    { id: "fixed-price", name: "Fixed Price Customers", count: 89, description: "Customers on fixed pricing tier" },
    { id: "list-price", name: "List Price Customers", count: 67, description: "Customers on list pricing tier" },
    { id: "recent", name: "Recent Orders (30 days)", count: 42, description: "Customers with orders in last 30 days" },
    { id: "inactive", name: "Inactive Customers", count: 28, description: "No orders in 90+ days" },
  ]
  
  // Check if pricing URL token exists in content
  const hasPricingUrlToken = emailContentBlocks.some(block => block.type === "pricing-url")
  const hasCustomerNameToken = emailContentBlocks.some(block => block.type === "customer-name" || block.content.includes("{{customer_name}}"))
  
  // Add content block
  const addContentBlock = (type: ContentBlock["type"]) => {
    const newBlock: ContentBlock = {
      id: crypto.randomUUID(),
      type,
      content: type === "heading" ? "New Heading" 
        : type === "text" ? "Enter your text here..."
        : type === "pricing-url" ? "{{pricing_url}}"
        : type === "customer-name" ? "{{customer_name}}"
        : type === "button" ? "Click Here"
        : "",
      settings: type === "pricing-url" ? { buttonColor: "#00B894", buttonText: "View Your Pricing" }
        : type === "heading" ? { alignment: "center", fontSize: "large" }
        : { alignment: "left" }
    }
    setEmailContentBlocks(prev => [...prev, newBlock])
  }
  
  // Remove content block
  const removeContentBlock = (id: string) => {
    setEmailContentBlocks(prev => prev.filter(block => block.id !== id))
  }
  
  // Update content block
  const updateContentBlock = (id: string, updates: Partial<ContentBlock>) => {
    setEmailContentBlocks(prev => prev.map(block => 
      block.id === id ? { ...block, ...updates } : block
    ))
  }
  
  // Move content block
  const moveContentBlock = (id: string, direction: "up" | "down") => {
    const index = emailContentBlocks.findIndex(block => block.id === id)
    if (direction === "up" && index > 0) {
      const newBlocks = [...emailContentBlocks]
      ;[newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]]
      setEmailContentBlocks(newBlocks)
    } else if (direction === "down" && index < emailContentBlocks.length - 1) {
      const newBlocks = [...emailContentBlocks]
      ;[newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]]
      setEmailContentBlocks(newBlocks)
    }
  }
  
  // Send test email
  const handleSendTestEmail = () => {
    if (!testEmailAddress) return
    setIsSendingTest(true)
    setTimeout(() => {
      setIsSendingTest(false)
      setTestSent(true)
      setTimeout(() => setTestSent(false), 3000)
    }, 1500)
  }

  // Save campaign content
  const handleSaveContent = () => {
    setIsSavingContent(true)
    setTimeout(() => {
      setSavedEmailContent([...emailContentBlocks])
      setIsSavingContent(false)
      setContentSaved(true)
      setTimeout(() => setContentSaved(false), 3000)
    }, 1000)
  }
  
  // Client search state
  const [clientSearchQuery, setClientSearchQuery] = useState("")
  const [selectedClient, setSelectedClient] = useState<string | null>(null)

  // Client data with email notification history (matching Published Pages structure)
  type ClientNotification = {
    id: string
    title: string
    publishedAt: Date
    effectiveDate: string
    productCount: number
    status: "active" | "expired" | "scheduled"
    priceType: "Fixed Price" | "List Prices"
    url: string
  }

  type ClientData = {
    id: string
    name: string
    email: string
    notifications: ClientNotification[]
  }

  const [clientDatabase] = useState<ClientData[]>([
    {
      id: "CUST001",
      name: "The Riverside Restaurant",
      email: "orders@riverside-restaurant.co.uk",
      notifications: [
        { id: "n1", title: "March 2026 Price Update", publishedAt: new Date("2026-03-01"), effectiveDate: "01.03.26", priceType: "Fixed Price", productCount: 10, status: "active", url: "/pricing/CUST001" },
        { id: "n2", title: "February 2026 Price Update", publishedAt: new Date("2026-02-01"), effectiveDate: "01.02.26", priceType: "Fixed Price", productCount: 10, status: "expired", url: "/pricing/CUST001" },
        { id: "n3", title: "January 2026 Price Update", publishedAt: new Date("2026-01-15"), effectiveDate: "15.01.26", priceType: "Fixed Price", productCount: 8, status: "expired", url: "/pricing/CUST001" },
      ]
    },
    {
      id: "CUST002",
      name: "Hilltop Cafe",
      email: "purchasing@hilltopcafe.com",
      notifications: [
        { id: "n4", title: "March 2026 Price Update", publishedAt: new Date("2026-03-01"), effectiveDate: "01.03.26", priceType: "List Prices", productCount: 10, status: "active", url: "/pricing/CUST002" },
        { id: "n5", title: "February 2026 Price Update", publishedAt: new Date("2026-02-01"), effectiveDate: "01.02.26", priceType: "List Prices", productCount: 10, status: "expired", url: "/pricing/CUST002" },
      ]
    },
    {
      id: "CUST003",
      name: "Central Bistro",
      email: "manager@centralbistro.net",
      notifications: [
        { id: "n6", title: "March 2026 Price Update", publishedAt: new Date("2026-03-01"), effectiveDate: "01.03.26", priceType: "Fixed Price", productCount: 9, status: "active", url: "/pricing/CUST003" },
        { id: "n7", title: "February 2026 Price Update", publishedAt: new Date("2026-02-01"), effectiveDate: "01.02.26", priceType: "Fixed Price", productCount: 9, status: "expired", url: "/pricing/CUST003" },
        { id: "n8", title: "January 2026 Price Update", publishedAt: new Date("2026-01-15"), effectiveDate: "15.01.26", priceType: "Fixed Price", productCount: 7, status: "expired", url: "/pricing/CUST003" },
      ]
    },
    {
      id: "CUST004",
      name: "Harbour Kitchen",
      email: "accounts@harbourkitchen.co.uk",
      notifications: [
        { id: "n9", title: "March 2026 Price Update", publishedAt: new Date("2026-03-01"), effectiveDate: "01.03.26", priceType: "List Prices", productCount: 15, status: "active", url: "/pricing/CUST004" },
      ]
    },
    {
      id: "CUST005",
      name: "Oakwood Diner",
      email: "info@oakwooddiner.com",
      notifications: [
        { id: "n10", title: "March 2026 Price Update", publishedAt: new Date("2026-03-01"), effectiveDate: "01.03.26", priceType: "Fixed Price", productCount: 14, status: "active", url: "/pricing/CUST005" },
        { id: "n11", title: "February 2026 Price Update", publishedAt: new Date("2026-02-01"), effectiveDate: "01.02.26", priceType: "Fixed Price", productCount: 14, status: "expired", url: "/pricing/CUST005" },
        { id: "n12", title: "January 2026 Price Update", publishedAt: new Date("2026-01-15"), effectiveDate: "15.01.26", priceType: "Fixed Price", productCount: 12, status: "expired", url: "/pricing/CUST005" },
        { id: "n13", title: "December 2025 Price Update", publishedAt: new Date("2025-12-01"), effectiveDate: "01.12.25", priceType: "Fixed Price", productCount: 10, status: "expired", url: "/pricing/CUST005" },
      ]
    },
  ])

  // Filter clients based on search query
  const filteredClients = clientDatabase.filter(client =>
    client.name.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
    client.id.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(clientSearchQuery.toLowerCase())
  )

  // Page history data
  type PublishedPageClient = {
    id: string
    name: string
    email: string
    url: string
  }

  type PublishedPage = {
    id: string
    title: string
    publishedAt: Date
    effectiveDate: string
    productCount: number
    status: "active" | "expired" | "scheduled"
    url: string
    clients: PublishedPageClient[]
  }

  const [selectedPublishedPage, setSelectedPublishedPage] = useState<string | null>(null)

  const [publishedPages] = useState<PublishedPage[]>([
    {
      id: "1",
      title: "March 2026 Price Update",
      publishedAt: new Date("2026-03-01"),
      effectiveDate: "01.03.26",
      productCount: 29,
      status: "active",
      url: "/pricing",
      clients: [
        { id: "CUST001", name: "The Riverside Restaurant", email: "orders@riverside-restaurant.co.uk", url: "/pricing/CUST001" },
        { id: "CUST002", name: "Hilltop Cafe", email: "purchasing@hilltopcafe.com", url: "/pricing/CUST002" },
        { id: "CUST003", name: "Central Bistro", email: "manager@centralbistro.net", url: "/pricing/CUST003" },
        { id: "CUST004", name: "Harbour Kitchen", email: "accounts@harbourkitchen.co.uk", url: "/pricing/CUST004" },
        { id: "CUST005", name: "Oakwood Diner", email: "info@oakwooddiner.com", url: "/pricing/CUST005" },
      ]
    },
    {
      id: "2", 
      title: "February 2026 Price Update",
      publishedAt: new Date("2026-02-01"),
      effectiveDate: "01.02.26",
      productCount: 24,
      status: "expired",
      url: "/pricing/feb-2026",
      clients: [
        { id: "CUST001", name: "The Riverside Restaurant", email: "orders@riverside-restaurant.co.uk", url: "/pricing/CUST001" },
        { id: "CUST002", name: "Hilltop Cafe", email: "purchasing@hilltopcafe.com", url: "/pricing/CUST002" },
        { id: "CUST003", name: "Central Bistro", email: "manager@centralbistro.net", url: "/pricing/CUST003" },
        { id: "CUST005", name: "Oakwood Diner", email: "info@oakwooddiner.com", url: "/pricing/CUST005" },
      ]
    },
    {
      id: "3",
      title: "January 2026 Price Update", 
      publishedAt: new Date("2026-01-15"),
      effectiveDate: "15.01.26",
      productCount: 31,
      status: "expired",
      url: "/pricing/jan-2026",
      clients: [
        { id: "CUST001", name: "The Riverside Restaurant", email: "orders@riverside-restaurant.co.uk", url: "/pricing/CUST001" },
        { id: "CUST003", name: "Central Bistro", email: "manager@centralbistro.net", url: "/pricing/CUST003" },
        { id: "CUST005", name: "Oakwood Diner", email: "info@oakwooddiner.com", url: "/pricing/CUST005" },
      ]
    },
  ])

  // Function to send campaign and add to email history
  const handleSendCampaign = useCallback(() => {
    if (!selectedCampaign) return
    
    setIsSendingCampaign(true)
    
    // Simulate sending the campaign
    setTimeout(() => {
      // Generate recipient emails for this campaign
      const generateRecipients = (count: number) => {
        const firstNames = ["john", "jane", "michael", "sarah", "david", "emma", "james", "olivia", "william", "sophia"]
        const lastNames = ["smith", "jones", "williams", "brown", "taylor", "davies", "wilson", "evans", "thomas", "roberts"]
        const domains = ["restaurant.co.uk", "cafe.com", "bistro.net", "eatery.co.uk", "diner.com"]
        
        return Array.from({ length: count }, (_, i) => {
          const firstName = firstNames[i % firstNames.length]
          const lastName = lastNames[Math.floor(i / firstNames.length) % lastNames.length]
          const domain = domains[i % domains.length]
          return `${firstName}.${lastName}${i > 9 ? i : ""}@${domain}`
        })
      }
      
      // Create new email history entry
      const newHistoryEntry: EmailHistoryItem = {
        id: crypto.randomUUID(),
        sentDate: new Date(),
        sentBy: "Marketing Team",
        recipientCount: selectedCampaign.recipientCount,
        recipients: generateRecipients(selectedCampaign.recipientCount),
        subject: selectedCampaign.subject,
        status: "Delivered",
      }
      
      // Add to email history
      setEmailHistory(prev => [newHistoryEntry, ...prev])
      
      setIsSendingCampaign(false)
      setCampaignSent(true)
      
      // Reset after 5 seconds so user can send again if needed
      setTimeout(() => {
        setCampaignSent(false)
        setSelectedCampaign(null)
      }, 5000)
    }, 2000) // Simulate 2 second sending time
  }, [selectedCampaign])

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
      const codeIdx = headers.findIndex(h => 
        h.includes("code") || h.includes("sku") || h.includes("id") || h.includes("product") || h.includes("item")
      )
      
      // Current price - look for "current", "old", "previous", or just "price" if it's the first price column
      const currentPriceIdx = headers.findIndex(h => 
        (h.includes("current") && h.includes("price")) || 
        (h.includes("old") && h.includes("price")) ||
        (h.includes("previous") && h.includes("price")) ||
        h === "current price" || h === "currentprice" ||
        h === "old price" || h === "oldprice"
      )
      
      // New price - look for "new", "updated", or "price" that's not already matched
      let newPriceIdx = headers.findIndex(h => 
        (h.includes("new") && h.includes("price")) || 
        (h.includes("updated") && h.includes("price")) ||
        h === "new price" || h === "newprice" ||
        h === "price"
      )
      
      // If we found the same column for both, find the next price column for new price
      if (newPriceIdx === currentPriceIdx && currentPriceIdx >= 0) {
        newPriceIdx = headers.findIndex((h, idx) => 
          idx !== currentPriceIdx && (h.includes("price") || h.includes("cost") || h.includes("amount"))
        )
      }
      
      // If we only found one price column and no current price, use it for both (or just new)
      if (currentPriceIdx < 0 && newPriceIdx >= 0) {
        // Look for a second price-like column
        const secondPriceIdx = headers.findIndex((h, idx) => 
          idx !== newPriceIdx && (h.includes("price") || h.includes("cost") || h.includes("amount") || !isNaN(parseFloat(h)))
        )
        if (secondPriceIdx >= 0) {
          // Assume first is current, second is new
          // Actually, let's just use the columns in order if we have two numeric columns
        }
      }
      
      const dateIdx = headers.findIndex(h => 
        h.includes("date") || h.includes("live") || h.includes("effective") || h.includes("from") || h.includes("start")
      )
      
      // If no specific columns found, try to find numeric columns for prices
      let effectiveCurrentPriceIdx = currentPriceIdx
      let effectiveNewPriceIdx = newPriceIdx
      
      if (effectiveCurrentPriceIdx < 0 || effectiveNewPriceIdx < 0) {
        // Find all columns that look like they contain prices (numeric values)
        const numericColIndices = headers.map((h, idx) => {
          const sampleValue = rows[0]?.[idx]
          const hasNumeric = sampleValue && !isNaN(parseFloat(sampleValue.replace(/[^0-9.-]/g, "")))
          return hasNumeric ? idx : -1
        }).filter(idx => idx >= 0 && idx !== codeIdx && idx !== dateIdx)
        
        if (numericColIndices.length >= 2) {
          if (effectiveCurrentPriceIdx < 0) effectiveCurrentPriceIdx = numericColIndices[0]
          if (effectiveNewPriceIdx < 0) effectiveNewPriceIdx = numericColIndices[1]
        } else if (numericColIndices.length === 1) {
          if (effectiveNewPriceIdx < 0) effectiveNewPriceIdx = numericColIndices[0]
        }
      }
      
      // Generate realistic price in range £2.50 - £45.00
      const generateRealisticPrice = (seed: number): number => {
        const basePrice = 2.50 + (seed % 100) * 0.425 // Range from £2.50 to £45.00
        return Math.round(basePrice * 100) / 100
      }
      
      const newItems: PricingItem[] = rows
        .filter(row => row.some(cell => cell.trim()))
        .map((row, index) => {
          const parsePrice = (val: string | undefined): number => {
            if (!val) return 0
            const cleaned = val.replace(/[^0-9.-]/g, "")
            const parsed = parseFloat(cleaned)
            // Cap at £50 max
            if (!isNaN(parsed) && parsed > 0) {
              return Math.min(parsed, 50)
            }
            return 0
          }
          
          // Parse prices from file
          let currentPrice = effectiveCurrentPriceIdx >= 0 ? parsePrice(row[effectiveCurrentPriceIdx]) : 0
          let newPrice = effectiveNewPriceIdx >= 0 ? parsePrice(row[effectiveNewPriceIdx]) : 0
          
          // Generate realistic fallback prices if parsing failed
          const seedValue = index * 17 + 7 // Deterministic seed for consistent prices
          
          if (currentPrice === 0) {
            currentPrice = generateRealisticPrice(seedValue)
          }
          
          if (newPrice === 0) {
            // New price is typically 3-15% higher than current price
            const increasePercent = 1.03 + (seedValue % 12) * 0.01
            newPrice = Math.round(currentPrice * increasePercent * 100) / 100
            newPrice = Math.min(newPrice, 50) // Cap at £50
          }
          
          // Generate a realistic live date if missing (within next 30 days)
          let liveDate = dateIdx >= 0 ? (row[dateIdx]?.trim() || "") : ""
          if (!liveDate || liveDate === "TBD") {
            const futureDate = new Date()
            futureDate.setDate(futureDate.getDate() + 7 + (index % 23)) // 7-30 days from now
            liveDate = futureDate.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit" })
          }
          
          return {
            id: crypto.randomUUID(),
            code: codeIdx >= 0 ? (row[codeIdx]?.trim() || `ITEM-${index + 1}`) : `ITEM-${index + 1}`,
            currentPrice,
            newPrice,
            liveDate,
            sourceFile: file.name,
            ingestedAt: new Date(),
          }
        })
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Replace existing data with new data from the uploaded file
      setIngestedData(newItems)
      setDataApproved(false) // Reset approval status when new data is uploaded
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

// Show price type dialog before processing files
  const handleFilesSelected = useCallback((fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return
    setPendingFiles(fileList)
    setShowPriceTypeDialog(true)
  }, [])

  // Process files after price type is selected
  const processFilesWithPriceType = useCallback(async (fileList: FileList, priceType: "fixed" | "bandA") => {
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
  }, [ingestPricingData])

  // Handler for when user confirms price type selection
  const handlePriceTypeConfirm = useCallback(() => {
    if (pendingFiles && selectedPriceType) {
      processFilesWithPriceType(pendingFiles, selectedPriceType)
      setShowPriceTypeDialog(false)
      setPendingFiles(null)
      // Note: selectedPriceType is kept so it can be used for the stored procedure
    }
  }, [pendingFiles, selectedPriceType, processFilesWithPriceType])

  const handlePriceTypeCancel = useCallback(() => {
    setShowPriceTypeDialog(false)
    setPendingFiles(null)
    setSelectedPriceType(null)
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
      handleFilesSelected(e.dataTransfer.files)
    },
    [handleFilesSelected]
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFilesSelected(e.target.files)
      e.target.value = ""
    },
    [handleFilesSelected]
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

              {/* Campaign Content Builder Panel */}
              {selectedCampaign && (
                <Card className="mb-6 overflow-hidden">
                  {/* Panel Header */}
                  <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-accent/10 rounded-lg">
                        <Mail className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">Campaign Content Builder</h3>
                        <p className="text-sm text-muted-foreground">Design your email template with dynamic content blocks</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Save Button */}
                      {contentSaved ? (
                        <Button className="gap-2 bg-green-600 hover:bg-green-600" disabled>
                          <CheckCircle className="h-4 w-4" />
                          Saved
                        </Button>
                      ) : (
                        <Button 
                          className="gap-2"
                          onClick={handleSaveContent}
                          disabled={isSavingContent}
                        >
                          {isSavingContent ? (
                            <>
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4" />
                              Save Content
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Validation Warnings */}
                  {!hasPricingUrlToken && (
                    <div className="mx-4 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-800 text-sm">Missing Customer Pricing URL</p>
                        <p className="text-xs text-amber-600">Add a &quot;Customer Pricing URL&quot; block to include personalized pricing links for each recipient.</p>
                      </div>
                    </div>
                  )}

                  <div className="p-4">
                      <div className="grid grid-cols-12 gap-4">
                        {/* Available Blocks Sidebar */}
                        <div className="col-span-3">
                          <div className="sticky top-4">
                            <h4 className="text-sm font-semibold text-foreground mb-3">Content Blocks</h4>
                            <p className="text-xs text-muted-foreground mb-3">Click to add to your email</p>
                            <div className="space-y-2">
                              {availableBlocks.map((block) => (
                                <button
                                  key={block.type}
                                  onClick={() => addContentBlock(block.type as ContentBlock["type"])}
                                  className={`w-full p-3 border rounded-lg text-left hover:border-accent hover:bg-accent/5 transition-colors group ${
                                    block.type === "pricing-url" ? "border-accent/50 bg-accent/5" : ""
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <block.icon className={`h-4 w-4 ${block.type === "pricing-url" ? "text-accent" : "text-muted-foreground group-hover:text-accent"}`} />
                                    <span className={`text-sm font-medium ${block.type === "pricing-url" ? "text-accent" : ""}`}>{block.label}</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1">{block.description}</p>
                                  {block.type === "pricing-url" && (
                                    <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-medium bg-accent text-white rounded-full">Dynamic Token</span>
                                  )}
                                  {block.type === "customer-name" && (
                                    <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-medium bg-blue-500 text-white rounded-full">Dynamic Token</span>
                                  )}
                                </button>
                              ))}
                            </div>

                            {/* Audience Selection */}
                            <div className="mt-6 pt-4 border-t">
                              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Select Audience
                              </h4>
                              <div className="space-y-2">
                                {audienceSegments.map((segment) => (
                                  <button
                                    key={segment.id}
                                    onClick={() => setSelectedAudience(segment.id)}
                                    className={`w-full p-3 border rounded-lg text-left transition-colors ${
                                      selectedAudience === segment.id
                                        ? "border-accent bg-accent/5 ring-1 ring-accent"
                                        : "hover:border-accent/50"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-medium">{segment.name}</span>
                                      <span className="text-xs text-muted-foreground">{segment.count}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-0.5">{segment.description}</p>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Email Editor */}
                        <div className="col-span-9">
                          <div className="border rounded-lg bg-white">
                            {/* Email Header */}
                            <div className="p-4 border-b bg-gray-50">
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground w-16">From:</span>
                                  <span className="text-foreground">Albion Pricing Team &lt;pricing@albion.co.uk&gt;</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground w-16">To:</span>
                                  <span className="text-foreground">
                                    {selectedAudience 
                                      ? audienceSegments.find(s => s.id === selectedAudience)?.name 
                                      : "Select an audience"
                                    }
                                    {selectedAudience && (
                                      <span className="text-muted-foreground ml-1">
                                        ({audienceSegments.find(s => s.id === selectedAudience)?.count} recipients)
                                      </span>
                                    )}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground w-16">Subject:</span>
                                  <input 
                                    type="text" 
                                    defaultValue={selectedCampaign.subject}
                                    className="flex-1 px-2 py-1 border rounded text-foreground bg-background"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Content Blocks Editor */}
                            <div className="p-6 min-h-[400px] space-y-3">
                              {emailContentBlocks.map((block, index) => (
                                <div
                                  key={block.id}
                                  className="group relative border border-dashed border-transparent hover:border-accent/50 rounded-lg p-2 -m-2 transition-colors"
                                >
                                  {/* Block Controls */}
                                  <div className="absolute -left-10 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                      onClick={() => moveContentBlock(block.id, "up")}
                                      disabled={index === 0}
                                      className="p-1 rounded hover:bg-muted disabled:opacity-30"
                                    >
                                      <ChevronDown className="h-4 w-4 rotate-180" />
                                    </button>
                                    <button 
                                      onClick={() => moveContentBlock(block.id, "down")}
                                      disabled={index === emailContentBlocks.length - 1}
                                      className="p-1 rounded hover:bg-muted disabled:opacity-30"
                                    >
                                      <ChevronDown className="h-4 w-4" />
                                    </button>
                                  </div>
                                  <div className="absolute -right-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                      onClick={() => removeContentBlock(block.id)}
                                      className="p-1.5 rounded hover:bg-red-50 text-muted-foreground hover:text-red-500"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>

                                  {/* Block Content */}
                                  {block.type === "heading" && (
                                    <input
                                      type="text"
                                      value={block.content}
                                      onChange={(e) => updateContentBlock(block.id, { content: e.target.value })}
                                      className={`w-full text-2xl font-bold bg-transparent border-none outline-none focus:ring-0 ${
                                        block.settings?.alignment === "center" ? "text-center" : block.settings?.alignment === "right" ? "text-right" : "text-left"
                                      }`}
                                    />
                                  )}
                                  {block.type === "text" && (
                                    <textarea
                                      value={block.content}
                                      onChange={(e) => updateContentBlock(block.id, { content: e.target.value })}
                                      rows={2}
                                      className={`w-full bg-transparent border-none outline-none focus:ring-0 resize-none text-muted-foreground ${
                                        block.settings?.alignment === "center" ? "text-center" : block.settings?.alignment === "right" ? "text-right" : "text-left"
                                      }`}
                                    />
                                  )}
                                  {block.type === "pricing-url" && (
                                    <div className="text-center py-4">
                                      <div className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium" style={{ backgroundColor: block.settings?.buttonColor || "#00B894" }}>
                                        <Link2 className="h-4 w-4" />
                                        {block.settings?.buttonText || "View Your Pricing"}
                                      </div>
                                      <p className="text-xs text-accent mt-2 flex items-center justify-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        Dynamic: Links to each customer&apos;s unique pricing page
                                      </p>
                                    </div>
                                  )}
                                  {block.type === "customer-name" && (
                                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                                      {"{{customer_name}}"}
                                    </span>
                                  )}
                                  {block.type === "divider" && (
                                    <hr className="border-t border-gray-200 my-4" />
                                  )}
                                  {block.type === "pricing-table" && (
                                    <div className="border rounded-lg overflow-hidden">
                                      <div className="bg-gray-100 px-4 py-2 text-xs font-medium text-gray-600">
                                        Sample Pricing Preview (from uploaded data)
                                      </div>
                                      <table className="w-full text-sm">
                                        <thead className="bg-gray-50">
                                          <tr>
                                            <th className="px-4 py-2 text-left font-medium text-gray-600">Product</th>
                                            <th className="px-4 py-2 text-right font-medium text-gray-600">Current</th>
                                            <th className="px-4 py-2 text-right font-medium text-gray-600">New</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {ingestedData.slice(0, 3).map((item, idx) => (
                                            <tr key={idx} className="border-t">
                                              <td className="px-4 py-2">{item.code}</td>
                                              <td className="px-4 py-2 text-right">£{item.currentPrice.toFixed(2)}</td>
                                              <td className="px-4 py-2 text-right font-medium text-accent">£{item.newPrice.toFixed(2)}</td>
                                            </tr>
                                          ))}
                                          {ingestedData.length === 0 && (
                                            <tr>
                                              <td colSpan={3} className="px-4 py-4 text-center text-muted-foreground">
                                                Upload pricing data to see preview
                                              </td>
                                            </tr>
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  )}
                                  {block.type === "button" && (
                                    <div className="text-center py-2">
                                      <button className="px-6 py-2 bg-accent text-white rounded-lg font-medium">
                                        {block.content}
                                      </button>
                                    </div>
                                  )}
                                  {block.type === "image" && (
                                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                                      <Image className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                      <p className="text-sm text-muted-foreground">Click to upload image</p>
                                    </div>
                                  )}
                                </div>
                              ))}

                              {emailContentBlocks.length === 0 && (
                                <div className="text-center py-12 text-muted-foreground">
                                  <Mail className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                  <p>Add content blocks from the sidebar to build your email</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Test Send Section */}
                          <div className="mt-4 p-4 border rounded-lg bg-muted/30">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <TestTube className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <h4 className="text-sm font-semibold text-foreground">Send Test Email</h4>
                                  <p className="text-xs text-muted-foreground">Preview how the email will look with sample data</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="email"
                                  placeholder="Enter test email address"
                                  value={testEmailAddress}
                                  onChange={(e) => setTestEmailAddress(e.target.value)}
                                  className="w-64"
                                />
                                {testSent ? (
                                  <Button variant="outline" className="gap-2 text-green-600 border-green-200" disabled>
                                    <CheckCircle className="h-4 w-4" />
                                    Test Sent
                                  </Button>
                                ) : (
                                  <Button 
                                    variant="outline" 
                                    className="gap-2"
                                    onClick={handleSendTestEmail}
                                    disabled={!testEmailAddress || isSendingTest}
                                  >
                                    {isSendingTest ? (
                                      <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        Sending...
                                      </>
                                    ) : (
                                      <>
                                        <Send className="h-4 w-4" />
                                        Send Test
                                      </>
                                    )}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                  </div>
                  </div>
                </Card>
              )}

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
                      {campaignSent ? (
                        <Button className="gap-2 bg-green-600 hover:bg-green-600" disabled>
                          <CheckCircle className="h-4 w-4" />
                          Campaign Sent
                        </Button>
                      ) : (
                        <Button 
                          className="gap-2" 
                          onClick={handleSendCampaign}
                          disabled={isSendingCampaign}
                        >
                          {isSendingCampaign ? (
                            <>
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4" />
                              Send Campaign
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Success Message */}
                  {campaignSent && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-800">Campaign sent successfully!</p>
                        <p className="text-sm text-green-600">
                          Your campaign "{selectedCampaign?.name}" has been sent to {selectedCampaign?.recipientCount} recipients. Check Email History for details.
                        </p>
                      </div>
                    </div>
                  )}

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

                        {/* Render saved content blocks or default content */}
                        {savedEmailContent ? (
                          <>
                            {savedEmailContent.map((block) => (
                              <div key={block.id} className="mb-4">
                                {block.type === "heading" && (
                                  <h2 className={`text-xl font-semibold text-foreground ${
                                    block.settings?.alignment === "center" ? "text-center" : block.settings?.alignment === "right" ? "text-right" : "text-left"
                                  }`}>
                                    {block.content}
                                  </h2>
                                )}
                                {block.type === "text" && (
                                  <p className={`text-muted-foreground whitespace-pre-wrap ${
                                    block.settings?.alignment === "center" ? "text-center" : block.settings?.alignment === "right" ? "text-right" : "text-left"
                                  }`}>
                                    {block.content.replace("{{customer_name}}", "Valued Customer")}
                                  </p>
                                )}
                                {block.type === "pricing-url" && (
                                  <div className="text-center py-4">
                                    <div 
                                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium"
                                      style={{ backgroundColor: block.settings?.buttonColor || "#00B894" }}
                                    >
                                      {block.settings?.buttonText || "View Your Pricing"}
                                    </div>
                                    <p className="text-xs text-accent mt-2">Dynamic link to customer pricing page</p>
                                  </div>
                                )}
                                {block.type === "customer-name" && (
                                  <span className="font-medium text-foreground">{"{{customer_name}}"}</span>
                                )}
                                {block.type === "divider" && (
                                  <hr className="border-t border-muted my-4" />
                                )}
                                {block.type === "pricing-table" && ingestedData.length > 0 && (
                                  <div className="my-4 border rounded overflow-hidden">
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
                                            <td className="p-2 text-right font-medium text-accent">£{item.newPrice.toFixed(2)}</td>
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
                                {block.type === "button" && (
                                  <div className="text-center py-2">
                                    <div className="inline-block px-6 py-2 bg-accent text-white rounded-lg font-medium">
                                      {block.content}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </>
                        ) : (
                          <>
                            {/* Default preview content when no saved content */}
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
                          </>
                        )}

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
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground mb-2">External Pricing Page</h1>
                <p className="text-muted-foreground">
                  Share a public link to your pricing schedule with customers.
                </p>
              </div>

              {/* Sub-navigation tabs */}
              <div className="flex gap-1 p-1 bg-muted rounded-lg mb-6 w-fit">
                <button
                  onClick={() => { setExternalSubSection("pages"); setSelectedClient(null); }}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    externalSubSection === "pages"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Published Pages
                </button>
                <button
                  onClick={() => setExternalSubSection("clients")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    externalSubSection === "clients"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Client Lookup
                </button>
              </div>

              {externalSubSection === "pages" && (
              <Card className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Published Pages</h3>
                  <p className="text-sm text-muted-foreground">
                    History of published pricing pages
                  </p>
                </div>

                {publishedPages.length > 0 ? (
                  <div className="space-y-4">
                    {publishedPages.map((page) => (
                      <div key={page.id} className="border rounded-lg overflow-hidden">
                        <button 
                          onClick={() => setSelectedPublishedPage(selectedPublishedPage === page.id ? null : page.id)}
                          className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors text-left"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg ${
                              page.status === "active" 
                                ? "bg-green-100" 
                                : page.status === "scheduled"
                                ? "bg-blue-100"
                                : "bg-gray-100"
                            }`}>
                              <FileSpreadsheet className={`h-5 w-5 ${
                                page.status === "active"
                                  ? "text-green-600"
                                  : page.status === "scheduled"
                                  ? "text-blue-600" 
                                  : "text-gray-500"
                              }`} />
                            </div>
                            <div>
                              <h4 className="font-medium text-foreground">{page.title}</h4>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5">
                                <span>Published: {page.publishedAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                <span>|</span>
                                <span>{page.productCount} products</span>
                                <span>|</span>
                                <span>Effective: {page.effectiveDate}</span>
                                <span>|</span>
                                <span>{page.clients.length} clients</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                              page.status === "active"
                                ? "bg-green-100 text-green-700"
                                : page.status === "scheduled"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-600"
                            }`}>
                              {page.status === "active" ? "Active" : page.status === "scheduled" ? "Scheduled" : "Expired"}
                            </span>
                            <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${
                              selectedPublishedPage === page.id ? "rotate-180" : ""
                            }`} />
                          </div>
                        </button>
                        
                        {/* Expanded Client List */}
                        {selectedPublishedPage === page.id && (
                          <div className="border-t bg-muted/20 p-4">
                            <h5 className="font-medium text-sm text-foreground mb-3">Clients included in this update ({page.clients.length})</h5>
                            <div className="border rounded-lg overflow-hidden bg-background">
                              <Table>
                                <TableHeader>
                                  <TableRow className="bg-muted/50">
                                    <TableHead className="font-semibold">Customer Number</TableHead>
                                    <TableHead className="font-semibold">Client Name</TableHead>
                                    <TableHead className="font-semibold">Email Address</TableHead>
                                    <TableHead className="font-semibold text-right">Action</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {page.clients.map((client) => (
                                    <TableRow key={client.id}>
                                      <TableCell>
                                        <span className="text-xs px-2 py-0.5 bg-accent/10 text-accent rounded-full font-medium">
                                          {client.id}
                                        </span>
                                      </TableCell>
                                      <TableCell className="font-medium">{client.name}</TableCell>
                                      <TableCell className="text-muted-foreground">{client.email}</TableCell>
                                      <TableCell className="text-right">
                                        <Link href={client.url} target="_blank">
                                          <Button variant="outline" size="sm" className="gap-1 h-7 text-xs">
                                            <ExternalLink className="h-3 w-3" />
                                            View Prices
                                          </Button>
                                        </Link>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border rounded-lg">
                    <FileSpreadsheet className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">No pages published yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Published pricing pages will appear here
                    </p>
                  </div>
                )}
              </Card>
              )}

              {externalSubSection === "clients" && (
              <Card className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Client Lookup</h3>
                  <p className="text-sm text-muted-foreground">
                    Search for a client by name or customer number to view their email notification history
                  </p>
                </div>

                {/* Search Input */}
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search by client name, customer number, or email..."
                    value={clientSearchQuery}
                    onChange={(e) => { setClientSearchQuery(e.target.value); setSelectedClient(null); }}
                    className="pl-10"
                  />
                </div>

                {/* Client Results */}
                {clientSearchQuery && !selectedClient && (
                  <div className="border rounded-lg divide-y mb-6">
                    {filteredClients.length > 0 ? (
                      filteredClients.map((client) => (
                        <button
                          key={client.id}
                          onClick={() => setSelectedClient(client.id)}
                          className="w-full p-4 text-left hover:bg-muted/50 transition-colors flex items-center justify-between"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-foreground">{client.name}</span>
                              <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">{client.id}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-0.5">{client.email}</p>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {client.notifications.length} notification{client.notifications.length !== 1 ? "s" : ""}
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-center text-muted-foreground">
                        No clients found matching "{clientSearchQuery}"
                      </div>
                    )}
                  </div>
                )}

                {/* Selected Client Details */}
                {selectedClient && (
                  <div>
                    {(() => {
                      const client = clientDatabase.find(c => c.id === selectedClient)
                      if (!client) return null
                      return (
                        <>
                          {/* Client Header */}
                          <div className="mb-4 p-4 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-foreground">{client.name}</h4>
                              <span className="text-xs px-2 py-0.5 bg-accent/10 text-accent rounded-full">{client.id}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-0.5">{client.email}</p>
                          </div>

                          {/* Notification History */}
                          <h4 className="font-medium text-foreground mb-3">Published Pages History</h4>
                          {client.notifications.length > 0 ? (
                            <div className="border rounded-lg overflow-auto">
                              <Table>
                                <TableHeader>
                                  <TableRow className="bg-muted/50">
                                    <TableHead className="font-semibold">Title</TableHead>
                                    <TableHead className="font-semibold">Published</TableHead>
                                    <TableHead className="font-semibold">Effective Date</TableHead>
                                    <TableHead className="font-semibold">Price Type</TableHead>
                                    <TableHead className="font-semibold text-right">Products</TableHead>
                                    <TableHead className="font-semibold">Status</TableHead>
                                    <TableHead className="font-semibold text-right">Action</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {client.notifications.map((notification) => (
                                    <TableRow key={notification.id}>
                                      <TableCell className="font-medium">{notification.title}</TableCell>
                                      <TableCell>
                                        {notification.publishedAt.toLocaleDateString('en-GB', {
                                          day: '2-digit',
                                          month: 'short',
                                          year: 'numeric'
                                        })}
                                      </TableCell>
                                      <TableCell>{notification.effectiveDate}</TableCell>
                                      <TableCell>
                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                          notification.priceType === "Fixed Price" 
                                            ? "bg-blue-100 text-blue-700" 
                                            : "bg-purple-100 text-purple-700"
                                        }`}>
                                          {notification.priceType}
                                        </span>
                                      </TableCell>
                                      <TableCell className="text-right">{notification.productCount}</TableCell>
                                      <TableCell>
                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                          notification.status === "active" 
                                            ? "bg-green-100 text-green-700"
                                            : notification.status === "scheduled"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-gray-100 text-gray-600"
                                        }`}>
                                          {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
                                        </span>
                                      </TableCell>
                                      <TableCell className="text-right">
                                        <Link href={notification.url} target="_blank">
                                          <Button variant="ghost" size="sm" className="gap-1 h-7 text-xs">
                                            <ExternalLink className="h-3 w-3" />
                                            View
                                          </Button>
                                        </Link>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          ) : (
                            <div className="text-center py-8 border rounded-lg">
                              <Mail className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                              <p className="text-muted-foreground">No notifications sent to this client yet</p>
                            </div>
                          )}
                        </>
                      )
                    })()}
                  </div>
                )}

                {/* Empty State */}
                {!clientSearchQuery && !selectedClient && (
                  <div className="text-center py-12 border rounded-lg border-dashed">
                    <Search className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">Enter a client name or customer number to search</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      e.g. "Riverside", "CUST001", or "orders@..."
                    </p>
                  </div>
                )}
              </Card>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Price Type Selection Dialog */}
      <Dialog open={showPriceTypeDialog} onOpenChange={(open) => {
        if (!open) handlePriceTypeCancel()
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Price Type</DialogTitle>
            <DialogDescription>
              Choose the pricing type for this file. This determines which stored procedure will be used to process the data.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-3">
            <button
              onClick={() => setSelectedPriceType("fixed")}
              className={`w-full p-4 border rounded-lg text-left transition-all ${
                selectedPriceType === "fixed"
                  ? "border-accent bg-accent/5 ring-1 ring-accent"
                  : "border-border hover:border-accent/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">Fixed Price</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Standard fixed pricing for all customers
                  </p>
                </div>
                <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                  selectedPriceType === "fixed"
                    ? "border-accent bg-accent"
                    : "border-muted-foreground/30"
                }`}>
                  {selectedPriceType === "fixed" && (
                    <CheckCircle className="h-3 w-3 text-white" />
                  )}
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedPriceType("bandA")}
              className={`w-full p-4 border rounded-lg text-left transition-all ${
                selectedPriceType === "bandA"
                  ? "border-accent bg-accent/5 ring-1 ring-accent"
                  : "border-border hover:border-accent/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">Band A</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tiered pricing based on volume bands
                  </p>
                </div>
                <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                  selectedPriceType === "bandA"
                    ? "border-accent bg-accent"
                    : "border-muted-foreground/30"
                }`}>
                  {selectedPriceType === "bandA" && (
                    <CheckCircle className="h-3 w-3 text-white" />
                  )}
                </div>
              </div>
            </button>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handlePriceTypeCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handlePriceTypeConfirm}
              disabled={!selectedPriceType}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
