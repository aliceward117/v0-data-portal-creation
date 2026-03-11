"use client"

import {
  ClipboardList,
  Search,
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Order = {
  customerName: string
  customerReference: string
  orderNumber: string
  orderDate: string
}

type OrderAction = {
  action: string
  user: string
  time: string
}

type OrderDetail = {
  docEntry: string
  orderNumber: string
  customerReference: string
  customerName: string
  orderDate: string
  orderDueDate: string
  docType: string
  canceled: string
  transferred: string
  orderTotal: string
  driver: string
  route: string
  load: string
  orderingChannel: string
  orderActions?: OrderAction[]
  deliveryStatus?: string
  deliveredTime?: string
  signature?: string
  webLink?: string
}

type OrderLineItem = {
  lineNo: number
  packSlip: string
  binLabel: string
  extended: string
  userId: string
  action: string
  actionTime: string
  quantity: number
  pickedQty: number
  unitPrice: number
  lineTotal: number
  startDateTime: string
  endDateTime: string
  comments?: string
  feedbackNotes?: string
}

interface TransportLineItem {
  toteNo: string
  sku: string
  product: string
  streamStatus: string
  time: string
  feedbackNotes?: string
}

interface TransportData {
  routeNo: string
  customerNo: string
  description: string
  driver: string
  comments: string
  deliveryPhotos?: string[]
  lineItems: TransportLineItem[]
}

interface OrderDetailData {
  orderNumber: string
  lineItems: OrderLineItem[]
  transportData: TransportData[]
}

// START OF TYPE DEFINITIONS FOR UPDATES
type SortConfig = {
  key: string | null
  direction: "asc" | "desc" | null
}
// END OF TYPE DEFINITIONS FOR UPDATES

// Sample data based on provided structure
const sampleOrders: Order[] = [
  // November 2025 orders
  {
    customerName: "Honest Foods London",
    customerReference: "HONE01",
    orderNumber: "71109101",
    orderDate: "2025-11-01",
  },
  {
    customerName: "Honest Foods London",
    customerReference: "HONE01",
    orderNumber: "71109201",
    orderDate: "2025-11-05",
  },
  {
    customerName: "Honest Foods London",
    customerReference: "HONE01",
    orderNumber: "71109315",
    orderDate: "2025-11-12",
  },
  {
    customerName: "Honest Foods London",
    customerReference: "HONE01",
    orderNumber: "71109428",
    orderDate: "2025-11-18",
  },
  {
    customerName: "Honest Foods London",
    customerReference: "HONE01",
    orderNumber: "71109536",
    orderDate: "2025-11-25",
  },
  {
    customerName: "Honest Foods London",
    customerReference: "HONE01",
    orderNumber: "71109645",
    orderDate: "2025-11-28",
  },
  // December 2025 orders
  {
    customerName: "Honest Foods London",
    customerReference: "HONE01",
    orderNumber: "71209102",
    orderDate: "2025-12-02",
  },
  {
    customerName: "Honest Foods London",
    customerReference: "HONE01",
    orderNumber: "71209201",
    orderDate: "2025-12-02",
  },
  {
    customerName: "Honest Foods London",
    customerReference: "HONE01",
    orderNumber: "71209406",
    orderDate: "2025-12-03",
  },
  {
    customerName: "Honest Foods London",
    customerReference: "HONE01",
    orderNumber: "71209508",
    orderDate: "2025-12-06",
  },
  {
    customerName: "Honest Foods London",
    customerReference: "HONE01",
    orderNumber: "71210111",
    orderDate: "2025-12-10",
  },
  {
    customerName: "Honest Foods London",
    customerReference: "HONE01",
    orderNumber: "71209404",
    orderDate: "2025-12-15",
  },
  {
    customerName: "Honest Foods London",
    customerReference: "HONE01",
    orderNumber: "71209621",
    orderDate: "2025-12-20",
  },
  {
    customerName: "Honest Foods London",
    customerReference: "HONE01",
    orderNumber: "71209732",
    orderDate: "2025-12-27",
  },
  // Additional customer for variety
  {
    customerName: "Premium Foods Manchester",
    customerReference: "PREM01",
    orderNumber: "71109102",
    orderDate: "2025-11-08",
  },
  {
    customerName: "Premium Foods Manchester",
    customerReference: "PREM01",
    orderNumber: "71209215",
    orderDate: "2025-12-05",
  },
  {
    customerName: "Premium Foods Manchester",
    customerReference: "PREM01",
    orderNumber: "71209318",
    orderDate: "2025-12-18",
  },
]

// Changed from orderDetails to orderDetailData to avoid confusion with type
const orderDetailData: Record<string, { header: OrderDetail; lineItems: OrderLineItem[] }> = {
  "71209406": {
    header: {
      docEntry: "1209408",
      orderNumber: "71209406",
      customerReference: "HONE01",
      customerName: "Honest Foods London",
      orderDate: "00:00.0",
      orderDueDate: "00:00.0",
      docType: "I",
      canceled: "N",
      transferred: "N",
      orderTotal: "20.79",
      driver: "John Smith",
      route: "BP_R001",
      load: "BP_L045",
      orderingChannel: "Web Order",
      orderActions: [
        { action: "Loaded", user: "SARAHJ", time: "10:45:00" },
        { action: "Shipped", user: "John Smith", time: "11:30:00" },
        { action: "Upload", user: "TIMR", time: "08:15:00" },
      ],
      deliveryStatus: "Delivered",
      deliveredTime: "11:42:00",
      signature: "J. Collins (Store Manager)",
      webLink: "https://orders.example.com/71209406",
    },
    lineItems: [
      {
        lineNo: 10,
        packSlip: "71209406",
        binLabel: "HN040103",
        extended: "PESTONF",
        userId: "TIMR",
        action: "PICKDETL",
        actionTime: "08:46:35",
        quantity: 2,
        pickedQty: 2,
        unitPrice: 3.25,
        lineTotal: 6.50,
        startDateTime: "46:35.6",
        endDateTime: "46:35.6",
      },
      {
        lineNo: 20,
        packSlip: "71209406",
        binLabel: "HO130201",
        extended: "CHEDSMOKE",
        userId: "TIMR",
        action: "PICKDETL",
        actionTime: "08:52:05",
        quantity: 4,
        pickedQty: 4,
        unitPrice: 5.99,
        lineTotal: 23.96,
        startDateTime: "52:05.4",
        endDateTime: "52:05.4",
      },
      {
        lineNo: 30,
        packSlip: "71209406",
        binLabel: "HO060103",
        extended: "MEXICANA",
        userId: "TIMR",
        action: "PICKDETL",
        actionTime: "08:48:22",
        quantity: 4,
        pickedQty: 4,
        unitPrice: 4.50,
        lineTotal: 18.00,
        startDateTime: "48:22.2",
        endDateTime: "48:22.2",
      },
      {
        lineNo: 40,
        packSlip: "71209406",
        binLabel: "LC380101",
        extended: "MILK2S",
        userId: "GARYP",
        action: "PICKDETL",
        actionTime: "09:18:28",
        quantity: 8,
        pickedQty: 8,
        unitPrice: 1.75,
        lineTotal: 14.00,
        startDateTime: "18:28.9",
        endDateTime: "18:29.5",
        feedbackNotes: "FRZ TOTE MISSING, NOT DELIVERED ON STREAM",
      },
      {
        lineNo: 50,
        packSlip: "71209406",
        binLabel: "HM020101",
        extended: "MOZZ100",
        userId: "TIMR",
        action: "PICKDETL",
        actionTime: "08:45:27",
        quantity: 10,
        pickedQty: 10,
        unitPrice: 2.25,
        lineTotal: 22.50,
        startDateTime: "45:27.1",
        endDateTime: "45:27.1",
      },
      {
        lineNo: 60,
        packSlip: "71209406",
        binLabel: "HE040101",
        extended: "HALZ55",
        userId: "SARAHJ",
        action: "LOADED",
        actionTime: "10:05:34",
        quantity: 1,
        pickedQty: 1,
        unitPrice: 7.99,
        lineTotal: 7.99,
        startDateTime: "05:34.9",
        endDateTime: "05:34.9",
        feedbackNotes: "AMB TOTE STREAM(DELIVERED WITH ISSUES, COULDN'T SCAN LABEL)",
      },
      {
        lineNo: 70,
        packSlip: "71209406",
        binLabel: "LB500101",
        extended: "MILKZW",
        userId: "SARAHJ",
        action: "LOADED",
        actionTime: "10:57:42",
        quantity: 2,
        pickedQty: 2,
        unitPrice: 1.50,
        lineTotal: 3.00,
        startDateTime: "57:42.5",
        endDateTime: "57:42.5",
      },
      {
        lineNo: 80,
        packSlip: "71209406",
        binLabel: "LB500101",
        extended: "MILKSW",
        userId: "SARAHJ",
        action: "LOADED",
        actionTime: "10:39:17",
        quantity: 2,
        pickedQty: 2,
        unitPrice: 1.50,
        lineTotal: 3.00,
        startDateTime: "39:17.8",
        endDateTime: "39:17.8",
        feedbackNotes: "SENT ON DROPBACK",
      },
      {
        lineNo: 90,
        packSlip: "71209406",
        binLabel: "BP010101",
        extended: "Black pudding",
        userId: "TIMR",
        action: "PICKDETL",
        actionTime: "08:22:45",
        quantity: 3,
        pickedQty: 3,
        unitPrice: 4.25,
        lineTotal: 12.75,
        startDateTime: "22:45.2",
        endDateTime: "22:45.2",
      },
    ],
  },
  "71209102": {
    header: {
      docEntry: "1209102",
      orderNumber: "71209102",
      customerReference: "HONE01",
      customerName: "Honest Foods London",
      orderDate: "00:00.0",
      orderDueDate: "00:00.0",
      docType: "I",
      canceled: "N",
      transferred: "N",
      orderTotal: "18.45",
      driver: "Sarah Johnson",
      route: "BP_R003",
      load: "BP_L082",
      orderingChannel: "EDI",
      orderActions: [
        { action: "Loaded", user: "MARKW", time: "09:20:00" },
        { action: "Shipped", user: "Sarah Johnson", time: "11:05:00" },
        { action: "Upload", user: "SARAHJ", time: "07:40:00" },
      ],
      deliveryStatus: "Partial Delivery",
      deliveredTime: "11:18:00",
      signature: "A. Patel (Warehouse Supervisor)",
      webLink: "https://orders.example.com/71209102",
    },
    lineItems: [
      {
        lineNo: 10,
        packSlip: "71209102",
        binLabel: "HN040103",
        extended: "PESTONF",
        userId: "SARAHJ",
        action: "PICKDETL",
        actionTime: "07:46:35",
        quantity: 3,
        pickedQty: 3,
        unitPrice: 3.25,
        lineTotal: 9.75,
        startDateTime: "46:35.6",
        endDateTime: "46:35.6",
      },
      {
        lineNo: 20,
        packSlip: "71209102",
        binLabel: "HO130201",
        extended: "CHEDSMOKE",
        userId: "SARAHJ",
        action: "PICKDETL",
        actionTime: "07:52:05",
        quantity: 5,
        pickedQty: 5,
        unitPrice: 5.99,
        lineTotal: 29.95,
        startDateTime: "52:05.4",
        endDateTime: "52:05.4",
      },
      {
        lineNo: 30,
        packSlip: "71209102",
        binLabel: "LC380101",
        extended: "MILK2S",
        userId: "MARKW",
        action: "LOADED",
        actionTime: "09:18:28",
        quantity: 6,
        pickedQty: 6,
        unitPrice: 1.75,
        lineTotal: 10.50,
        startDateTime: "18:28.9",
        endDateTime: "18:29.5",
        feedbackNotes: "STREAM(DELIVERED WITH ISSUES, COULDN'T SCAN LABEL)",
      },
      {
        lineNo: 40,
        packSlip: "71209102",
        binLabel: "HM020101",
        extended: "MOZZ100",
        userId: "SARAHJ",
        action: "PICKDETL",
        actionTime: "07:45:27",
        quantity: 8,
        pickedQty: 7,
        unitPrice: 2.25,
        lineTotal: 18.00,
        startDateTime: "45:27.1",
        endDateTime: "45:27.1",
        feedbackNotes: "SHORT PICK - 1 UNIT MISSING FROM BIN",
      },
      {
        lineNo: 50,
        packSlip: "71209102",
        binLabel: "HE040101",
        extended: "HALZ55",
        userId: "MARKW",
        action: "SHIPPED",
        actionTime: "11:05:34",
        quantity: 4,
        pickedQty: 4,
        unitPrice: 7.99,
        lineTotal: 31.96,
        startDateTime: "05:34.9",
        endDateTime: "05:34.9",
      },
      {
        lineNo: 60,
        packSlip: "71209102",
        binLabel: "LB500101",
        extended: "MILKZW",
        userId: "MARKW",
        action: "SHIPPED",
        actionTime: "11:57:42",
        quantity: 3,
        pickedQty: 3,
        unitPrice: 1.50,
        lineTotal: 4.50,
        startDateTime: "57:42.5",
        endDateTime: "57:42.5",
      },
      {
        lineNo: 70,
        packSlip: "71209102",
        binLabel: "HO060103",
        extended: "MEXICANA",
        userId: "SARAHJ",
        action: "PICKDETL",
        actionTime: "07:48:22",
        quantity: 2,
        pickedQty: 2,
        unitPrice: 4.50,
        lineTotal: 9.00,
        startDateTime: "48:22.2",
        endDateTime: "48:22.2",
      },
      {
        lineNo: 80,
        packSlip: "71209102",
        binLabel: "BP010101",
        extended: "Black pudding",
        userId: "MARKW",
        action: "SHIPPED",
        actionTime: "11:33:12",
        quantity: 5,
        pickedQty: 5,
        unitPrice: 4.25,
        lineTotal: 21.25,
        startDateTime: "33:12.7",
        endDateTime: "33:12.7",
      },
    ],
  },
  "71109101": {
    header: {
      docEntry: "1109101",
      orderNumber: "71109101",
      customerReference: "HONE01",
      customerName: "Honest Foods London",
      orderDate: "00:00.0",
      orderDueDate: "00:00.0",
      docType: "I",
      canceled: "N",
      transferred: "N",
      orderTotal: "22.30",
      driver: "Mark Williams",
      route: "BP_R007",
      load: "BP_L019",
      orderingChannel: "Telesales",
      orderActions: [
        { action: "Loaded", user: "LISAM", time: "09:10:00" },
        { action: "Shipped", user: "Mark Williams", time: "11:45:00" },
        { action: "Upload", user: "ALEXR", time: "06:30:00" },
      ],
      deliveryStatus: "Delivered",
      deliveredTime: "12:02:00",
      signature: "R. Thomas (Head Chef)",
      webLink: "https://orders.example.com/71109101",
    },
    lineItems: [
      {
        lineNo: 10,
        packSlip: "71109101",
        binLabel: "HN040103",
        extended: "PESTONF",
        userId: "ALEXR",
        action: "PICKDETL",
        actionTime: "06:46:35",
        quantity: 4,
        pickedQty: 4,
        unitPrice: 3.25,
        lineTotal: 13.00,
        startDateTime: "46:35.6",
        endDateTime: "46:35.6",
      },
      {
        lineNo: 20,
        packSlip: "71109101",
        binLabel: "HO130201",
        extended: "CHEDSMOKE",
        userId: "ALEXR",
        action: "PICKDETL",
        actionTime: "06:52:05",
        quantity: 6,
        pickedQty: 6,
        unitPrice: 5.99,
        lineTotal: 35.94,
        startDateTime: "52:05.4",
        endDateTime: "52:05.4",
        feedbackNotes: "FRZ TOTE MISSING, NOT DELIVERED ON STREAM",
      },
      {
        lineNo: 30,
        packSlip: "71109101",
        binLabel: "LC380101",
        extended: "MILK2S",
        userId: "LISAM",
        action: "LOADED",
        actionTime: "09:18:28",
        quantity: 5,
        pickedQty: 5,
        unitPrice: 1.75,
        lineTotal: 8.75,
        startDateTime: "18:28.9",
        endDateTime: "18:29.5",
      },
      {
        lineNo: 40,
        packSlip: "71109101",
        binLabel: "HM020101",
        extended: "MOZZ100",
        userId: "ALEXR",
        action: "PICKDETL",
        actionTime: "06:45:27",
        quantity: 7,
        pickedQty: 6,
        unitPrice: 2.25,
        lineTotal: 15.75,
        startDateTime: "45:27.1",
        endDateTime: "45:27.1",
        feedbackNotes: "SHORT PICK - 1 UNIT DAMAGED/OOD",
      },
      {
        lineNo: 50,
        packSlip: "71109101",
        binLabel: "HE040101",
        extended: "HALZ55",
        userId: "LISAM",
        action: "SHIPPED",
        actionTime: "11:05:34",
        quantity: 3,
        pickedQty: 3,
        unitPrice: 7.99,
        lineTotal: 23.97,
        startDateTime: "05:34.9",
        endDateTime: "05:34.9",
      },
      {
        lineNo: 60,
        packSlip: "71109101",
        binLabel: "LB500101",
        extended: "MILKZW",
        userId: "LISAM",
        action: "SHIPPED",
        actionTime: "11:57:42",
        quantity: 4,
        pickedQty: 4,
        unitPrice: 1.50,
        lineTotal: 6.00,
        startDateTime: "57:42.5",
        endDateTime: "57:42.5",
      },
      {
        lineNo: 70,
        packSlip: "71109101",
        binLabel: "HO080201",
        extended: "GOUDA100",
        userId: "ALEXR",
        action: "PICKDETL",
        actionTime: "06:48:22",
        quantity: 5,
        pickedQty: 5,
        unitPrice: 6.50,
        lineTotal: 32.50,
        startDateTime: "48:22.2",
        endDateTime: "48:22.2",
      },
      {
        lineNo: 80,
        packSlip: "71109101",
        binLabel: "HO090101",
        extended: "BRIE200",
        userId: "LISAM",
        action: "LOADED",
        actionTime: "09:41:15",
        quantity: 3,
        pickedQty: 3,
        unitPrice: 8.50,
        lineTotal: 25.50,
        startDateTime: "41:15.8",
        endDateTime: "41:15.8",
      },
      {
        lineNo: 90,
        packSlip: "71109101",
        binLabel: "BP010101",
        extended: "Black pudding",
        userId: "ALEXR",
        action: "PICKDETL",
        actionTime: "06:28:55",
        quantity: 2,
        pickedQty: 2,
        unitPrice: 4.25,
        lineTotal: 8.50,
        startDateTime: "28:55.3",
        endDateTime: "28:55.3",
      },
    ],
  },
  "71209203": {
    header: {
      docEntry: "1209203",
      orderNumber: "71209203",
      customerReference: "HONE01",
      customerName: "Honest Foods London",
      orderDate: "2025-12-02",
      orderDueDate: "2025-12-02",
      docType: "I",
      canceled: "N",
      transferred: "N",
      orderTotal: "15.80",
      driver: "Paul Morgan",
      route: "BP_R002",
      load: "BP_L056",
      orderingChannel: "Web Order",
      orderActions: [
        { action: "Loaded", user: "PAULM", time: "09:50:00" },
        { action: "Shipped", user: "Paul Morgan", time: "12:00:00" },
        { action: "Upload", user: "JANED", time: "07:10:00" },
      ],
      deliveryStatus: "Not Delivered",
      deliveredTime: "-",
      signature: "-",
      webLink: "https://orders.example.com/71209203",
    },
    lineItems: [
      {
        lineNo: 10,
        packSlip: "71209203",
        binLabel: "HO130201",
        extended: "CHEDSMOKE",
        userId: "JANED",
        action: "PICKDETL",
        actionTime: "07:52:05",
        quantity: 4,
        pickedQty: 4,
        unitPrice: 5.99,
        lineTotal: 23.96,
        startDateTime: "52:05.4",
        endDateTime: "52:05.4",
      },
      {
        lineNo: 20,
        packSlip: "71209203",
        binLabel: "LC380101",
        extended: "MILK2S",
        userId: "JANED",
        action: "PICKDETL",
        actionTime: "07:18:28",
        quantity: 6,
        pickedQty: 6,
        unitPrice: 1.75,
        lineTotal: 10.50,
        startDateTime: "18:28.9",
        endDateTime: "18:29.5",
        feedbackNotes: "SENT ON DROPBACK",
      },
      {
        lineNo: 30,
        packSlip: "71209203",
        binLabel: "BP010101",
        extended: "Black pudding",
        userId: "PAULM",
        action: "LOADED",
        actionTime: "09:45:22",
        quantity: 4,
        pickedQty: 4,
        unitPrice: 4.25,
        lineTotal: 17.00,
        startDateTime: "45:22.1",
        endDateTime: "45:22.1",
      },
      {
        lineNo: 40,
        packSlip: "71209203",
        binLabel: "HM020101",
        extended: "MOZZ100",
        userId: "JANED",
        action: "PICKDETL",
        actionTime: "07:45:27",
        quantity: 3,
        pickedQty: 3,
        unitPrice: 2.25,
        lineTotal: 6.75,
        startDateTime: "45:27.1",
        endDateTime: "45:27.1",
      },
    ],
  },
}

// START OF UPDATES
const orderDetailDataSpecific: Record<string, OrderDetailData> = {
  "71209406": {
    orderNumber: "71209406",
    lineItems: [
      {
        lineNo: 10,
        packSlip: "71209406",
        binLabel: "PACKSLIP",
        extended: "BINLABEL",
        userId: "JohnD",
        action: "PICKDETL",
        actionTime: "08:15:00",
        quantity: 4,
        pickedQty: 4,
        unitPrice: 3.25,
        lineTotal: 13.00,
        startDateTime: "08:15.8",
        endDateTime: "08:15.8",
        feedbackNotes: "FRZ TOTE MISSING, NOT DELIVERED ON STREAM. AMB TOTE",
      },
      {
        lineNo: 20,
        packSlip: "71209406",
        binLabel: "CHEDDMOKE",
        extended: "TIMR",
        userId: "JohnD",
        action: "PICKDETL",
        actionTime: "08:22:00",
        quantity: 4,
        pickedQty: 4,
        unitPrice: 5.99,
        lineTotal: 23.96,
        startDateTime: "08:15.8",
        endDateTime: "08:15.8",
        feedbackNotes: "STREAM(DELIVERED WITH ISSUES, COULDN'T SCAN LABEL)",
      },
      {
        lineNo: 30,
        packSlip: "71209406",
        binLabel: "HC124M",
        extended: "THBR",
        userId: "JohnD",
        action: "LOADED",
        actionTime: "09:30:00",
        quantity: 4,
        pickedQty: 4,
        unitPrice: 4.50,
        lineTotal: 18.00,
        startDateTime: "08:15.8",
        endDateTime: "08:15.8",
      },
      {
        lineNo: 40,
        packSlip: "71209406",
        binLabel: "HOT39001",
        extended: "CHEDDMOKE",
        userId: "JohnD",
        action: "PICKDETL",
        actionTime: "08:35:00",
        quantity: 4,
        pickedQty: 4,
        unitPrice: 5.99,
        lineTotal: 23.96,
        startDateTime: "08:15.8",
        endDateTime: "08:15.8",
        feedbackNotes: "STREAM(DELIVERED WITH ISSUES, COULDN'T SCAN LABEL)",
      },
      {
        lineNo: 50,
        packSlip: "71209406",
        binLabel: "MOZZ10D",
        extended: "TIMR",
        userId: "JohnD",
        action: "LOADED",
        actionTime: "09:42:00",
        quantity: 4,
        pickedQty: 3,
        unitPrice: 2.25,
        lineTotal: 9.00,
        startDateTime: "08:15.8",
        endDateTime: "08:15.8",
        feedbackNotes: "FRZ TOTE MISSING, NOT DELIVERED ON STREAM. AMB TOTE",
      },
      {
        lineNo: 60,
        packSlip: "71209406",
        binLabel: "HC124M",
        extended: "TIMR",
        userId: "JohnD",
        action: "LOADED",
        actionTime: "09:55:00",
        quantity: 1,
        pickedQty: 1,
        unitPrice: 7.99,
        lineTotal: 7.99,
        startDateTime: "08:15.8",
        endDateTime: "08:15.8",
      },
      {
        lineNo: 70,
        packSlip: "71209406",
        binLabel: "LB50101",
        extended: "MILKZW",
        userId: "JohnD",
        action: "SHIPPED",
        actionTime: "11:10:00",
        quantity: 2,
        pickedQty: 2,
        unitPrice: 1.50,
        lineTotal: 3.00,
        startDateTime: "08:15.8",
        endDateTime: "08:15.8",
        feedbackNotes: "SENT ON DROPBACK",
      },
      {
        lineNo: 80,
        packSlip: "71209406",
        binLabel: "LB50D101",
        extended: "MILKZW",
        userId: "JohnD",
        action: "SHIPPED",
        actionTime: "11:18:00",
        quantity: 2,
        pickedQty: 2,
        unitPrice: 1.50,
        lineTotal: 3.00,
        startDateTime: "08:15.8",
        endDateTime: "08:15.8",
      },
      {
        lineNo: 90,
        packSlip: "71209406",
        binLabel: "LC3B0101",
        extended: "MILKZS",
        userId: "JohnD",
        action: "SHIPPED",
        actionTime: "11:25:00",
        quantity: 8,
        pickedQty: 8,
        unitPrice: 1.75,
        lineTotal: 14.00,
        startDateTime: "08:15.8",
        endDateTime: "08:15.8",
      },
      {
        lineNo: 100,
        packSlip: "71209406",
        binLabel: "MR2Z100",
        extended: "GARYR",
        userId: "JohnD",
        action: "SHIPPED",
        actionTime: "11:32:00",
        quantity: 10,
        pickedQty: 10,
        unitPrice: 2.25,
        lineTotal: 22.50,
        startDateTime: "08:15.8",
        endDateTime: "08:15.8",
      },
      {
        lineNo: 110,
        packSlip: "71209406",
        binLabel: "BP010101",
        extended: "Black pudding",
        userId: "TIMR",
        action: "PICKDETL",
        actionTime: "08:22:45",
        quantity: 3,
        pickedQty: 3,
        unitPrice: 4.25,
        lineTotal: 12.75,
        startDateTime: "22:45.2",
        endDateTime: "22:45.2",
      },
    ],
    orderTotal: 20.79,
    transportData: [
      {
        routeNo: "R001",
        customerNo: "HONE01",
        description: "1x TRISOL 1x EGGSFR5DOZ 1x SALTSEA25",
        driver: "John Smith",
        comments: "Delivered on time",
        deliveryPhotos: ["/delivery-package-front-door.jpg", "/delivery-receipt-signature.jpg"],
        lineItems: [
          { toteNo: "T-0041", sku: "HN040103", product: "PESTONF", streamStatus: "Delivered", time: "11:15:00" },
          { toteNo: "T-0041", sku: "HO130201", product: "CHEDSMOKE", streamStatus: "Delivered", time: "11:15:00" },
          { toteNo: "T-0042", sku: "HO060103", product: "MEXICANA", streamStatus: "Delivered", time: "11:16:00" },
          { toteNo: "T-0042", sku: "HM020101", product: "MOZZ100", streamStatus: "Delivered", time: "11:16:00" },
        ],
      },
      {
        routeNo: "R001",
        customerNo: "HONE01",
        description: "1x SUGMUSCD5 1x CHIPSLUTOSA5MM",
        driver: "John Smith",
        comments: "Left with receptionist",
        deliveryPhotos: ["/package-at-reception-desk.jpg"],
        lineItems: [
          { toteNo: "T-0043", sku: "LC380101", product: "MILK2S", streamStatus: "Delivered", time: "11:22:00" },
          { toteNo: "T-0043", sku: "HE040101", product: "HALZ55", streamStatus: "Delivered", time: "11:22:00" },
        ],
      },
      {
        routeNo: "R002",
        customerNo: "HONE01",
        description: "1x TRISOL 1x SALTSEA25 1x EGGSFR5DOZ",
        driver: "Sarah Johnson",
        comments: "Customer not available, safe place used",
        deliveryPhotos: ["/package-in-safe-location.jpg", "/delivery-note-photo.jpg"],
        lineItems: [
          { toteNo: "T-0044", sku: "LB500101", product: "MILKZW", streamStatus: "Safe Place", time: "12:05:00" },
          { toteNo: "T-0044", sku: "LB500101", product: "MILKSW", streamStatus: "Safe Place", time: "12:05:00", feedbackNotes: "LEFT AT BACK DOOR PER CUSTOMER REQUEST" },
          { toteNo: "T-0045", sku: "BP010101", product: "Black pudding", streamStatus: "Safe Place", time: "12:06:00" },
        ],
      },
    ],
  },
  "71209102": {
    orderNumber: "71209102",
    lineItems: [
      {
        lineNo: 10,
        packSlip: "71209102",
        binLabel: "PESTO45",
        extended: "BASIL PESTO",
        userId: "SARAHJ",
        action: "PICKDETL",
        actionTime: "09:20:30",
        quantity: 3,
        pickedQty: 3,
        startDateTime: "09:20.5",
        endDateTime: "09:22.3",
        feedbackNotes: "STREAM(DELIVERED WITH ISSUES, COULDN'T SCAN LABEL)",
      },
      {
        lineNo: 20,
        packSlip: "71209102",
        binLabel: "CHED200",
        extended: "MATURE CHEDDAR",
        userId: "SARAHJ",
        action: "PICKDETL",
        actionTime: "09:23:06",
        quantity: 5,
        pickedQty: 5,
        startDateTime: "09:23.1",
        endDateTime: "09:24.8",
      },
      {
        lineNo: 30,
        packSlip: "71209102",
        binLabel: "MILK2L",
        extended: "SEMI SKIMMED MILK",
        userId: "MARKW",
        action: "LOADED",
        actionTime: "09:30:12",
        quantity: 6,
        pickedQty: 5,
        startDateTime: "09:30.2",
        endDateTime: "09:32.5",
        feedbackNotes: "FRZ TOTE MISSING, NOT DELIVERED ON STREAM. AMB TOTE",
      },
      {
        lineNo: 40,
        packSlip: "71209102",
        binLabel: "MOZZ150",
        extended: "MOZZARELLA BALLS",
        userId: "MARKW",
        action: "LOADED",
        actionTime: "09:33:00",
        quantity: 4,
        pickedQty: 4,
        startDateTime: "09:33.0",
        endDateTime: "09:34.2",
      },
      {
        lineNo: 50,
        packSlip: "71209102",
        binLabel: "BUTT250",
        extended: "SALTED BUTTER",
        userId: "MARKW",
        action: "SHIPPED",
        actionTime: "09:40:06",
        quantity: 7,
        pickedQty: 7,
        startDateTime: "09:40.1",
        endDateTime: "09:42.3",
        feedbackNotes: "SENT ON DROPBACK",
      },
      {
        lineNo: 60,
        packSlip: "71209102",
        binLabel: "YOGNAT",
        extended: "NATURAL YOGURT",
        userId: "MARKW",
        action: "SHIPPED",
        actionTime: "09:43:00",
        quantity: 4,
        pickedQty: 4,
        startDateTime: "09:43.0",
        endDateTime: "09:44.5",
      },
      {
        lineNo: 70,
        packSlip: "71209102",
        binLabel: "CREAM300",
        extended: "DOUBLE CREAM",
        userId: "MARKW",
        action: "SHIPPED",
        actionTime: "09:45:12",
        quantity: 2,
        pickedQty: 2,
        startDateTime: "09:45.2",
        endDateTime: "09:46.0",
      },
      {
        lineNo: 80,
        packSlip: "71209102",
        binLabel: "BP010101",
        extended: "Black pudding",
        userId: "MARKW",
        action: "SHIPPED",
        actionTime: "09:33:12",
        quantity: 5,
        pickedQty: 5,
        startDateTime: "33:12.7",
        endDateTime: "33:12.7",
      },
    ],
    orderTotal: 18.45,
    transportData: [
      {
        routeNo: "R003",
        customerNo: "HONE01",
        description: "1x EGGSFR5DOZ 1x SUGMUSCD5",
        driver: "Mike Brown",
        comments: "Delivered successfully",
        deliveryPhotos: ["/delivered-boxes-entrance.jpg"],
        lineItems: [
          { toteNo: "T-0051", sku: "PESTO45", product: "BASIL PESTO", streamStatus: "Delivered", time: "10:30:00" },
          { toteNo: "T-0051", sku: "CHED200", product: "MATURE CHEDDAR", streamStatus: "Delivered", time: "10:30:00" },
          { toteNo: "T-0052", sku: "MILK2L", product: "SEMI SKIMMED MILK", streamStatus: "Delivered", time: "10:32:00", feedbackNotes: "1 UNIT SHORT - DRIVER NOTED" },
          { toteNo: "T-0052", sku: "MOZZ150", product: "MOZZARELLA BALLS", streamStatus: "Delivered", time: "10:32:00" },
        ],
      },
      {
        routeNo: "R004",
        customerNo: "HONE01",
        description: "1x CHIPSLUTOSA5MM 1x TRISOL",
        driver: "Emma Wilson",
        comments: "Signed by manager",
        deliveryPhotos: ["/manager-signature-tablet.jpg", "/delivered-goods-photo.jpg"],
        lineItems: [
          { toteNo: "T-0053", sku: "BUTT250", product: "SALTED BUTTER", streamStatus: "Signed", time: "11:10:00" },
          { toteNo: "T-0053", sku: "YOGNAT", product: "NATURAL YOGURT", streamStatus: "Signed", time: "11:10:00" },
          { toteNo: "T-0054", sku: "CREAM300", product: "DOUBLE CREAM", streamStatus: "Signed", time: "11:12:00" },
          { toteNo: "T-0054", sku: "BP010101", product: "Black pudding", streamStatus: "Signed", time: "11:12:00" },
        ],
      },
    ],
  },
  "71109101": {
    orderNumber: "71109101",
    lineItems: [
      {
        lineNo: 10,
        packSlip: "71109101",
        binLabel: "PESTO55",
        extended: "SUN DRIED TOMATO PESTO",
        userId: "ALEXR",
        action: "PICKDETL",
        actionTime: "07:15:12",
        quantity: 4,
        pickedQty: 4,
        startDateTime: "07:15.2",
        endDateTime: "07:16.8",
        feedbackNotes: "STREAM(DELIVERED WITH ISSUES, COULDN'T SCAN LABEL)",
      },
      {
        lineNo: 20,
        packSlip: "71109101",
        binLabel: "CHED300",
        extended: "EXTRA MATURE CHEDDAR",
        userId: "ALEXR",
        action: "PICKDETL",
        actionTime: "07:17:30",
        quantity: 6,
        pickedQty: 6,
        startDateTime: "07:17.5",
        endDateTime: "07:19.2",
      },
      {
        lineNo: 30,
        packSlip: "71109101",
        binLabel: "MILK1L",
        extended: "WHOLE MILK",
        userId: "LISAM",
        action: "LOADED",
        actionTime: "07:25:00",
        quantity: 8,
        pickedQty: 7,
        startDateTime: "07:25.0",
        endDateTime: "07:27.3",
        feedbackNotes: "FRZ TOTE MISSING, NOT DELIVERED ON STREAM. AMB TOTE",
      },
      {
        lineNo: 40,
        packSlip: "71109101",
        binLabel: "MOZZ200",
        extended: "BUFFALO MOZZARELLA",
        userId: "LISAM",
        action: "LOADED",
        actionTime: "07:28:06",
        quantity: 5,
        pickedQty: 5,
        startDateTime: "07:28.1",
        endDateTime: "07:29.4",
      },
      {
        lineNo: 50,
        packSlip: "71109101",
        binLabel: "GOUDA150",
        extended: "SMOKED GOUDA",
        userId: "LISAM",
        action: "SHIPPED",
        actionTime: "07:35:12",
        quantity: 3,
        pickedQty: 3,
        startDateTime: "07:35.2",
        endDateTime: "07:36.8",
        feedbackNotes: "SENT ON DROPBACK",
      },
      {
        lineNo: 60,
        packSlip: "71109101",
        binLabel: "BRIE200",
        extended: "FRENCH BRIE",
        userId: "LISAM",
        action: "SHIPPED",
        actionTime: "07:37:30",
        quantity: 4,
        pickedQty: 4,
        startDateTime: "07:37.5",
        endDateTime: "07:38.9",
      },
      {
        lineNo: 70,
        packSlip: "71109101",
        binLabel: "CREAM250",
        extended: "SINGLE CREAM",
        userId: "LISAM",
        action: "SHIPPED",
        actionTime: "07:39:18",
        quantity: 5,
        pickedQty: 5,
        startDateTime: "07:39.3",
        endDateTime: "07:40.7",
      },
      {
        lineNo: 80,
        packSlip: "71109101",
        binLabel: "YOGGRK",
        extended: "GREEK YOGURT",
        userId: "LISAM",
        action: "SHIPPED",
        actionTime: "07:41:12",
        quantity: 2,
        pickedQty: 2,
        startDateTime: "07:41.2",
        endDateTime: "07:42.1",
      },
      {
        lineNo: 90,
        packSlip: "71109101",
        binLabel: "BP010101",
        extended: "Black pudding",
        userId: "ALEXR",
        action: "PICKDETL",
        actionTime: "07:28:55",
        quantity: 2,
        pickedQty: 2,
        startDateTime: "28:55.3",
        endDateTime: "28:55.3",
      },
    ],
    orderTotal: 22.3,
    transportData: [
      {
        routeNo: "R005",
        customerNo: "HONE01",
        description: "1x SALTSEA25 1x EGGSFR5DOZ 1x TRISOL",
        driver: "David Lee",
        comments: "Partial delivery - 1 item out of stock",
        deliveryPhotos: ["/partial-delivery-boxes.jpg"],
        lineItems: [
          { toteNo: "T-0061", sku: "PESTO55", product: "SUN DRIED TOMATO PESTO", streamStatus: "Delivered", time: "08:20:00" },
          { toteNo: "T-0061", sku: "CHED300", product: "EXTRA MATURE CHEDDAR", streamStatus: "Delivered", time: "08:20:00" },
          { toteNo: "T-0062", sku: "MILK1L", product: "WHOLE MILK", streamStatus: "Partial", time: "08:22:00", feedbackNotes: "1 UNIT SHORT FROM WAREHOUSE" },
          { toteNo: "T-0062", sku: "MOZZ200", product: "BUFFALO MOZZARELLA", streamStatus: "Delivered", time: "08:22:00" },
          { toteNo: "T-0063", sku: "GOUDA150", product: "SMOKED GOUDA", streamStatus: "Delivered", time: "08:24:00" },
        ],
      },
      {
        routeNo: "R006",
        customerNo: "HONE01",
        description: "1x SUGMUSCD5",
        driver: "Lisa Chen",
        comments: "Delivered to warehouse",
        deliveryPhotos: ["/warehouse-delivery-bay.jpg", "/loading-dock-timestamp.jpg"],
        lineItems: [
          { toteNo: "T-0064", sku: "BRIE200", product: "FRENCH BRIE", streamStatus: "Delivered", time: "09:45:00" },
          { toteNo: "T-0064", sku: "CREAM250", product: "SINGLE CREAM", streamStatus: "Delivered", time: "09:45:00" },
          { toteNo: "T-0065", sku: "YOGGRK", product: "GREEK YOGURT", streamStatus: "Delivered", time: "09:47:00" },
          { toteNo: "T-0065", sku: "BP010101", product: "Black pudding", streamStatus: "Delivered", time: "09:47:00" },
        ],
      },
    ],
  },
  "71209203": {
    orderNumber: "71209203",
    lineItems: [
      {
        lineNo: 10,
        packSlip: "71209203",
        binLabel: "HO130201",
        extended: "CHEDSMOKE",
        userId: "JANED",
        action: "PICKDETL",
        actionTime: "07:52:05",
        quantity: 4,
        pickedQty: 4,
        startDateTime: "52:05.4",
        endDateTime: "52:05.4",
      },
      {
        lineNo: 20,
        packSlip: "71209203",
        binLabel: "LC380101",
        extended: "MILK2S",
        userId: "JANED",
        action: "PICKDETL",
        actionTime: "07:18:28",
        quantity: 6,
        pickedQty: 6,
        startDateTime: "18:28.9",
        endDateTime: "18:29.5",
        feedbackNotes: "SENT ON DROPBACK",
      },
      {
        lineNo: 30,
        packSlip: "71209203",
        binLabel: "BP010101",
        extended: "Black pudding",
        userId: "PAULM",
        action: "LOADED",
        actionTime: "09:45:22",
        quantity: 4,
        pickedQty: 4,
        startDateTime: "45:22.1",
        endDateTime: "45:22.1",
      },
      {
        lineNo: 40,
        packSlip: "71209203",
        binLabel: "HM020101",
        extended: "MOZZ100",
        userId: "JANED",
        action: "PICKDETL",
        actionTime: "07:45:27",
        quantity: 3,
        pickedQty: 3,
        startDateTime: "45:27.1",
        endDateTime: "45:27.1",
      },
    ],
    orderTotal: 15.8,
    transportData: [
      {
        routeNo: "R007",
        customerNo: "HONE01",
        description: "1x CHIPSLUTOSA5MM 1x EGGSFR5DOZ",
        driver: "Tom Harris",
        comments: "Delivered after hours",
        deliveryPhotos: ["/after-hours-delivery-secure-box.jpg"],
        lineItems: [
          { toteNo: "T-0071", sku: "HO130201", product: "CHEDSMOKE", streamStatus: "After Hours", time: "18:30:00" },
          { toteNo: "T-0071", sku: "LC380101", product: "MILK2S", streamStatus: "After Hours", time: "18:30:00", feedbackNotes: "LEFT IN SECURE BOX" },
          { toteNo: "T-0072", sku: "BP010101", product: "Black pudding", streamStatus: "After Hours", time: "18:32:00" },
          { toteNo: "T-0072", sku: "HM020101", product: "MOZZ100", streamStatus: "After Hours", time: "18:32:00" },
        ],
      },
    ],
  },
}
// END OF UPDATES

// Mock data for transport information
const transportData: Record<string, TransportData[]> = {
  "71209406": [
    {
      routeNo: "RT101",
      customerNo: "HONE01",
      description: "Daily Delivery - London",
      driver: "John Doe",
      comments: "Delivered on time.",
      lineItems: [
        { toteNo: "T-0101", sku: "HN040103", product: "PESTONF", streamStatus: "Delivered", time: "11:00:00" },
      ],
    },
  ],
  "71209102": [
    {
      routeNo: "RT105",
      customerNo: "HONE01",
      description: "Tuesday Express - London",
      driver: "Jane Smith",
      comments: "Slight delay due to traffic.",
      lineItems: [
        { toteNo: "T-0105", sku: "PESTO45", product: "BASIL PESTO", streamStatus: "Delayed", time: "10:45:00" },
      ],
    },
  ],
  "71109101": [
    {
      routeNo: "RT203",
      customerNo: "HONE01",
      description: "Weekend Special - London",
      driver: "Peter Jones",
      comments: "All items accounted for.",
      lineItems: [
        { toteNo: "T-0203", sku: "PESTO55", product: "SUN DRIED TOMATO PESTO", streamStatus: "Delivered", time: "08:30:00" },
      ],
    },
  ],
  "71209203": [
    {
      routeNo: "RT110",
      customerNo: "HONE01",
      description: "Morning Rush - London",
      driver: "Alice Brown",
      comments: "No issues reported.",
      lineItems: [
        { toteNo: "T-0110", sku: "HO130201", product: "CHEDSMOKE", streamStatus: "Delivered", time: "07:15:00" },
      ],
    },
  ],
}

const demoCustomers = [
  { name: "Honest Foods London", ref: "HONE01" },
  { name: "Premium Foods Manchester", ref: "PREM01" },
  { name: "Gourmet Delights Birmingham", ref: "GOUR01" },
  { name: "Fresh Market Leeds", ref: "FRES01" },
  { name: "Organic Essentials Bristol", ref: "ORGA01" },
  { name: "Artisan Foods Edinburgh", ref: "ARTI01" },
  { name: "Quality Provisions Glasgow", ref: "QUAL01" },
  { name: "Specialty Foods Cardiff", ref: "SPEC01" },
  { name: "Fine Foods Newcastle", ref: "FINE01" },
  { name: "Select Foods Liverpool", ref: "SELE01" },
]

export default function OrderTriagePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [customerSuggestions, setCustomerSuggestions] = useState<typeof demoCustomers>([])
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null) // State for selected customer name
  const [showTodayQuestion, setShowTodayQuestion] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showProductSearch, setShowProductSearch] = useState(false)
  const [productSearchValue, setProductSearchValue] = useState("")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [monthScrollPosition, setMonthScrollPosition] = useState(() => {
    const currentMonth = new Date().getMonth()
    // Center the current month in the view (show 2 months before if possible)
    return Math.max(0, Math.min(currentMonth - 2, 12 - 5))
  })
  const monthsPerView = 5 // Number of months visible at once
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [activeTab, setActiveTab] = useState("warehouse") // State to manage active tab

  const [warehouseSearchQuery, setWarehouseSearchQuery] = useState("")
  const [transportSearchQuery, setTransportSearchQuery] = useState("")

  const [warehouseSortConfig, setWarehouseSortConfig] = useState<SortConfig>({ key: null, direction: null })
  const [transportSortConfig, setTransportSortConfig] = useState<SortConfig>({ key: null, direction: null })

  const [errorDialogOpen, setErrorDialogOpen] = useState(false)
  const [selectedLineItem, setSelectedLineItem] = useState<{
    type: "warehouse" | "transport"
    data: any
  } | null>(null)
  const [errorReason, setErrorReason] = useState("")
  const [errorDescription, setErrorDescription] = useState("")

  const errorReasons = [
    "Picking error",
    "Loading error",
    "Damaged / OOD",
    "Forgot to Deliver",
    "Driver Process error",
    "No Key",
    "Customer Rejected",
    "Customer error",
    "Customer Closed",
    "Input error",
    "Other",
    "Duplicate Order",
  ]

  const sortWarehouseData = (data: OrderLineItem[]) => {
    if (!warehouseSortConfig.key || !warehouseSortConfig.direction) {
      // Default sort by lineNo (SAP line order)
      return [...data].sort((a, b) => a.lineNo - b.lineNo)
    }

    return [...data].sort((a, b) => {
      let aValue: any = a[warehouseSortConfig.key as keyof OrderLineItem]
      let bValue: any = b[warehouseSortConfig.key as keyof OrderLineItem]

      // Handle numeric sorting for quantities and lineNo
      if (warehouseSortConfig.key === "quantity" || warehouseSortConfig.key === "pickedQty" || warehouseSortConfig.key === "lineNo") {
        aValue = Number(aValue) || 0
        bValue = Number(bValue) || 0
      }

      // Handle string sorting - convert to lowercase for proper A-Z sorting
      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (aValue < bValue) return warehouseSortConfig.direction === "asc" ? -1 : 1
      if (aValue > bValue) return warehouseSortConfig.direction === "asc" ? 1 : -1
      return 0
    })
  }

  const sortTransportData = (data: TransportData[]) => {
    if (!transportSortConfig.key || !transportSortConfig.direction) return data

    return [...data].sort((a, b) => {
      let aValue: any = a[transportSortConfig.key as keyof TransportData]
      let bValue: any = b[transportSortConfig.key as keyof TransportData]

      // Handle numeric sorting for route numbers
      if (transportSortConfig.key === "routeNo") {
        aValue = Number(aValue.replace(/[^\d]/g, "")) || 0
        bValue = Number(bValue.replace(/[^\d]/g, "")) || 0
      }

      if (aValue < bValue) return transportSortConfig.direction === "asc" ? -1 : 1
      if (aValue > bValue) return transportSortConfig.direction === "asc" ? 1 : -1
      return 0
    })
  }

  const filterWarehouseData = (data: OrderLineItem[]) => {
    if (!warehouseSearchQuery.trim()) return data

    const query = warehouseSearchQuery.toLowerCase()
    return data.filter(
      (item) =>
        item.binLabel?.toLowerCase().includes(query) ||
        item.packSlip?.toLowerCase().includes(query) ||
        item.extended?.toLowerCase().includes(query) ||
        item.quantity?.toString().includes(query) ||
        item.pickedQty?.toString().includes(query) ||
        item.userId?.toLowerCase().includes(query) ||
        item.action?.toLowerCase().includes(query) ||
        item.actionTime?.toLowerCase().includes(query) ||
        item.feedbackNotes?.toLowerCase().includes(query),
    )
  }

  const filterTransportData = (data: TransportData[]) => {
    if (!transportSearchQuery.trim()) return data

    const query = transportSearchQuery.toLowerCase()
    return data.filter(
      (item) =>
        item.routeNo?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.driver?.toLowerCase().includes(query) ||
        item.comments?.toLowerCase().includes(query) ||
        item.lineItems?.some(
          (li) =>
            li.toteNo?.toLowerCase().includes(query) ||
            li.sku?.toLowerCase().includes(query) ||
            li.product?.toLowerCase().includes(query) ||
            li.streamStatus?.toLowerCase().includes(query) ||
            li.feedbackNotes?.toLowerCase().includes(query),
        ),
    )
  }

  const handleWarehouseSort = (key: string) => {
    let direction: "asc" | "desc" | null = "asc"
    if (warehouseSortConfig.key === key && warehouseSortConfig.direction === "asc") {
      direction = "desc"
    } else if (warehouseSortConfig.key === key && warehouseSortConfig.direction === "desc") {
      direction = null
    }
    setWarehouseSortConfig({ key, direction })
  }

  const handleTransportSort = (key: string) => {
    let direction: "asc" | "desc" | null = "asc"
    if (transportSortConfig.key === key && transportSortConfig.direction === "asc") {
      direction = "desc"
    } else if (transportSortConfig.key === key && transportSortConfig.direction === "desc") {
      direction = null
    }
    setTransportSortConfig({ key, direction })
  }

  const getSortIcon = (columnKey: string, sortConfig: { key: string | null; direction: "asc" | "desc" | null }) => {
    if (sortConfig.key !== columnKey || !sortConfig.direction) {
      return <ArrowUpDown className="ml-1 h-3 w-3 inline opacity-40" />
    }
    if (sortConfig.direction === "asc") {
      return <ChevronUp className="ml-1 h-3 w-3 inline text-[#60aa74]" />
    }
    return <ChevronDown className="ml-1 h-3 w-3 inline text-[#60aa74]" />
  }

  // Removed handleSearchChange and integrated logic directly into Input onChange
  // Removed setShowCustomerList and integrated logic directly into Input onChange

  const handleCustomerSelect = (customerName: string) => {
    setSearchQuery(customerName)
    setCustomerSuggestions([]) // Clear suggestions
    setSelectedCustomer(customerName)
    setShowTodayQuestion(true) // Proceed to today's question
  }

  const handleSearch = () => {
    if (!searchQuery.trim()) return

    // Check if input is numeric (order number) or text (customer name)
    const isOrderNumber = /^\d+$/.test(searchQuery.trim())

    if (isOrderNumber) {
      // Direct to order detail
      const order = sampleOrders.find((o) => o.orderNumber.includes(searchQuery))
      if (order) {
        setSelectedOrder(order)
      }
    } else {
      // If a customer was selected via suggestions, proceed to today's question
      if (selectedCustomer) {
        setShowTodayQuestion(true)
      } else {
        // If not selected via suggestions, treat as a new customer search and prompt
        // This part might need refinement based on exact desired behavior for direct text input
        // For now, we'll assume if it's not an order number and no customer is selected,
        // we show the "today's order" question, implying the search was for a customer.
        setShowTodayQuestion(true)
      }
    }
  }

  const handleTodayResponse = (isToday: boolean) => {
    if (isToday) {
      const orders = sampleOrders.filter((o) =>
        selectedCustomer ? o.customerName.toLowerCase().includes(selectedCustomer.toLowerCase()) : false,
      )
      setFilteredOrders(orders)
      setShowTodayQuestion(false)
    } else {
      // Show date picker
      setShowTodayQuestion(false)
      setShowDatePicker(true)
    }
  }

  const handleProductSearch = () => {
    setShowTodayQuestion(false)
    setShowProductSearch(true)
  }

  const handleProductSearchSubmit = () => {
    if (!productSearchValue.trim()) return

    // Search for orders containing the product for the selected customer
    const matchingOrders = sampleOrders.filter((order) => {
      const matchesCustomer = selectedCustomer
        ? order.customerName.toLowerCase().includes(selectedCustomer.toLowerCase())
        : true
      if (!matchesCustomer) return false

      // Check if any line items in this order contain the product
      const orderDetails = orderDetailData[order.orderNumber]
      if (!orderDetails) return false

      return orderDetails.lineItems.some(
        (item) =>
          item.binLabel.toLowerCase().includes(productSearchValue.toLowerCase()) ||
          item.extended.toLowerCase().includes(productSearchValue.toLowerCase()), // Changed from packSlip to extended for product name search
      )
    })

    setFilteredOrders(matchingOrders)
    setShowProductSearch(false)
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return
    const selectedDate = format(date, "yyyy-MM-dd")
    setDate(date)

    const orders = sampleOrders.filter((o) => {
      const matchesCustomer = selectedCustomer
        ? o.customerName.toLowerCase().includes(selectedCustomer.toLowerCase())
        : true
      const matchesDate = o.orderDate === selectedDate
      return matchesCustomer && matchesDate
    })

    setFilteredOrders(orders)
    setShowDatePicker(false)
  }

  const handleOrderSelect = (order: Order) => {
    setSelectedOrder(order)
    // Reset sorting configurations when a new order is selected
    setWarehouseSortConfig({ key: "", direction: null })
    setTransportSortConfig({ key: "", direction: null })
  }

  const handleReset = () => {
    setSearchQuery("")
    setCustomerSuggestions([])
    setSelectedCustomer(null)
    setShowTodayQuestion(false)
    setShowDatePicker(false)
    setShowProductSearch(false)
    setProductSearchValue("")
    setDate(undefined)
    setFilteredOrders([])
    setSelectedOrder(null)
    setActiveTab("warehouse") // Reset tab to warehouse on new search
    // Reset sorting configurations on new search
    setWarehouseSortConfig({ key: "", direction: null })
    setTransportSortConfig({ key: "", direction: null })
    // Reset search queries
    setWarehouseSearchQuery("")
    setTransportSearchQuery("")
  }

  // Function to get order details for the selected order, handling missing data
  const getOrderDetailData = (orderNumber: string): OrderDetailData | null => {
    const warehouseData = orderDetailData[orderNumber]
    const transportInfo = transportData[orderNumber]

    // Check both orderDetailDataSpecific and transportData for comprehensive info
    const orderDetailSpecific = orderDetailDataSpecific[orderNumber]

    if (!orderDetailSpecific && !transportInfo) return null

    return {
      orderNumber: orderNumber,
      lineItems: orderDetailSpecific ? orderDetailSpecific.lineItems : [],
      transportData: orderDetailSpecific ? orderDetailSpecific.transportData : transportInfo || [],
    }
  }

  const handleWarehouseItemClick = (item: any) => {
    setSelectedLineItem({ type: "warehouse", data: item })
    setErrorReason("")
    setErrorDescription("")
    setErrorDialogOpen(true)
  }

  const handleTransportItemClick = (transport: any) => {
    setSelectedLineItem({ type: "transport", data: transport })
    setErrorReason("")
    setErrorDescription("")
    setErrorDialogOpen(true)
  }

  const handleErrorSubmit = () => {
    if (!errorReason || !errorDescription) {
      alert("Please fill in both reason and description")
      return
    }

    console.log("[v0] Error Report Submitted:", {
      type: selectedLineItem?.type,
      item: selectedLineItem?.data,
      reason: errorReason,
      description: errorDescription,
    })

    // Reset and close
    setErrorDialogOpen(false)
    setSelectedLineItem(null)
    setErrorReason("")
    setErrorDescription("")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <ClipboardList className="h-6 w-6 text-primary" />
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
  className="px-3 py-2 text-sm font-medium text-accent border-b-2 border-accent transition-colors"
  >
> Order Triage
  </Link>
  <Link
  href="/upload"
  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-accent hover:border-b-2 hover:border-accent transition-colors"
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
      <main className="p-6 max-w-6xl mx-auto">
        <div className="mb-6"></div>

        {!selectedOrder ? (
          <div className="space-y-6">
            {/* Initial Search */}
            {!showTodayQuestion && !showDatePicker && !showProductSearch && filteredOrders.length === 0 && (
              <>
                <Card className="p-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="search" className="text-base font-semibold mb-3 block">
                        Search Orders
                      </Label>
                      <p className="text-sm text-muted-foreground mb-3">
                        Enter an order number or customer name to begin
                      </p>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Input
                            id="search"
                            type="text"
                            placeholder="Order number (e.g., 71209406) or Customer name (e.g., Honest Foods London)"
                            value={searchQuery}
                            onChange={(e) => {
                              setSearchQuery(e.target.value)
                              // Show customer suggestions if typing more than 2 characters
                              if (e.target.value.length >= 2 && !/^\d+$/.test(e.target.value)) {
                                const matches = demoCustomers.filter(
                                  (customer) =>
                                    customer.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                                    customer.ref.toLowerCase().includes(e.target.value.toLowerCase()),
                                )
                                setCustomerSuggestions(matches)
                              } else {
                                setCustomerSuggestions([])
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleSearch()
                              }
                            }}
                            className="pr-10"
                          />
                          {customerSuggestions.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                              {customerSuggestions.map((customer) => (
                                <button
                                  key={customer.ref}
                                  onClick={() => {
                                    setSearchQuery(customer.name)
                                    setCustomerSuggestions([])
                                    // Auto-proceed to "Today's Order?" question
                                    setSelectedCustomer(customer.name)
                                    setShowTodayQuestion(true)
                                  }}
                                  className="w-full px-4 py-2 text-left hover:bg-accent/10 transition-colors border-b border-border last:border-0"
                                >
                                  <div className="font-medium">{customer.name}</div>
                                  <div className="text-xs text-muted-foreground">{customer.ref}</div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <Button onClick={handleSearch} className="bg-accent hover:bg-accent/90">
                          <Search className="mr-2 h-4 w-4" />
                          Search
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Link href="/order-triage-bi" className="block">
                    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                      <h3 className="text-lg font-semibold mb-4">Order Triage BI Report</h3>
                      <div className="mb-4">
                        <img
                          src="/business-intelligence-dashboard-with-charts-and-gr.jpg"
                          alt="BI Report Dashboard"
                          className="w-full h-48 object-cover rounded-lg border border-border"
                        />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>Business Intelligence reporting dashboard for order triage analytics and insights.</p>
                      </div>
                    </Card>
                  </Link>
                  <Link href="/order-triage-report" className="block">
                    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                      <h3 className="text-lg font-semibold mb-4">Order Triage Report</h3>
                      <div className="mb-4">
                        <img
                          src="/order-metrics-report-with-performance-data-and-sta.jpg"
                          alt="Order Triage Report"
                          className="w-full h-48 object-cover rounded-lg border border-border"
                        />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>Comprehensive order triage reporting with detailed metrics and performance data.</p>
                      </div>
                    </Card>
                  </Link>
                </div>
              </>
            )}

            {/* Today's Order Question */}
            {showTodayQuestion && (
              <Card className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Is this for today's order for <span className="text-accent">{selectedCustomer || searchQuery}</span>
                    ?
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button onClick={() => handleTodayResponse(true)} className="w-full">
                      Yes, Today's Order
                    </Button>
                    <Button onClick={() => handleTodayResponse(false)} variant="outline" className="w-full">
                      No, Select Date
                    </Button>
                    <Button onClick={handleProductSearch} variant="outline" className="w-full bg-transparent">
                      Search by Product/SKU
                    </Button>
                  </div>
                  <div className="flex justify-center">
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      size="sm"
                      className="bg-white dark:bg-white text-foreground"
                    >
                      Back to Search
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {showProductSearch && (
              <Card className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Search for Product/SKU for <span className="text-[#60aa74]">{selectedCustomer || searchQuery}</span>
                  </h3>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Enter product name or SKU..."
                      value={productSearchValue}
                      onChange={(e) => setProductSearchValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleProductSearchSubmit()
                        }
                      }}
                      className="flex-1"
                    />
                    <Button onClick={handleProductSearchSubmit} className="gap-2">
                      <Search className="h-4 w-4" />
                      Search
                    </Button>
                  </div>
                  <div className="flex justify-center">
                    <Button
                      onClick={() => {
                        setShowProductSearch(false)
                        setShowTodayQuestion(true)
                        setProductSearchValue("")
                      }}
                      variant="outline"
                      size="sm"
                      className="bg-white dark:bg-white text-foreground"
                    >
                      Back
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {showDatePicker && (
              <Card className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="date" className="text-base font-semibold mb-3 block">
                      <CalendarIcon className="h-4 w-4 inline mr-2" />
                      Select Order Date
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "dd/MM/yyyy") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white" align="start">
                        <div className="flex">
                          {/* Month Sidebar */}
                          <div className="border-r border-border bg-muted/30 flex flex-col">
                            {/* Up Arrow */}
                            <button
                              onClick={() => setMonthScrollPosition(Math.max(0, monthScrollPosition - 1))}
                              disabled={monthScrollPosition === 0}
                              className="p-2 hover:bg-accent/10 disabled:opacity-30 disabled:cursor-not-allowed border-b border-border"
                            >
                              <ChevronUp className="h-4 w-4" />
                            </button>

                            {/* Months List */}
                            <div className="py-2 px-2 overflow-hidden">
                              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                                .slice(monthScrollPosition, monthScrollPosition + monthsPerView)
                                .map((month, displayIdx) => {
                                  const idx = monthScrollPosition + displayIdx
                                  const isCurrentMonth = date && date.getMonth() === idx
                                  return (
                                    <button
                                      key={month}
                                      onClick={() => {
                                        const newDate = new Date(date || new Date())
                                        newDate.setMonth(idx)
                                        setDate(newDate)
                                      }}
                                      className={`block w-full text-left px-3 py-2 text-sm rounded hover:bg-accent/10 hover:text-accent transition-colors ${
                                        isCurrentMonth ? "text-accent font-semibold" : "text-muted-foreground"
                                      }`}
                                    >
                                      {month}
                                    </button>
                                  )
                                })}
                            </div>

                            {/* Down Arrow */}
                            <button
                              onClick={() =>
                                setMonthScrollPosition(Math.min(12 - monthsPerView, monthScrollPosition + 1))
                              }
                              disabled={monthScrollPosition >= 12 - monthsPerView}
                              className="p-2 hover:bg-accent/10 disabled:opacity-30 disabled:cursor-not-allowed border-t border-border"
                            >
                              <ChevronDown className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Main Calendar */}
                          <div className="p-4">
                            {/* Header with Month/Year and Today button */}
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    const newDate = new Date(date || new Date())
                                    newDate.setMonth(newDate.getMonth() - 1)
                                    setDate(newDate)
                                  }}
                                  className="p-1 hover:bg-accent/10 rounded"
                                >
                                  <ChevronLeft className="h-5 w-5" />
                                </button>
                                <h3 className="text-accent font-medium text-base">
                                  {format(date || new Date(), "MMMM yyyy")}
                                </h3>
                                <button
                                  onClick={() => {
                                    const newDate = new Date(date || new Date())
                                    newDate.setMonth(newDate.getMonth() + 1)
                                    setDate(newDate)
                                  }}
                                  className="p-1 hover:bg-accent/10 rounded"
                                >
                                  <ChevronRight className="h-5 w-5" />
                                </button>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-accent hover:bg-accent/10 h-8"
                                onClick={() => {
                                  const today = new Date()
                                  setDate(today)
                                  handleDateSelect(today)
                                }}
                              >
                                Today
                              </Button>
                            </div>

                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={(selectedDate) => {
                                setDate(selectedDate)
                                if (selectedDate) {
                                  handleDateSelect(selectedDate)
                                }
                              }}
                              month={date}
                              onMonthChange={setDate}
                              classNames={{
                                months: "flex flex-col",
                                month: "space-y-2",
                                month_caption: "hidden",
                                button_previous: "hidden",
                                button_next: "hidden",
                                month_grid: "w-full border-collapse",
                                weekdays: "flex",
                                weekday: "text-muted-foreground w-10 text-xs font-normal uppercase text-center",
                                week: "flex w-full mt-1",
                                day: "h-10 w-10 text-center p-0 relative",
                                day_button:
                                  "h-10 w-10 p-0 font-normal hover:bg-accent/20 hover:text-accent rounded-md transition-colors",
                                selected: "bg-accent text-white hover:bg-accent hover:text-white",
                                today: "bg-accent/10 text-accent font-semibold",
                                outside: "text-muted-foreground/50",
                              }}
                            />
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex justify-center">
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      size="sm"
                      className="bg-white dark:bg-white text-foreground"
                    >
                      Back to Search
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Filtered Orders List */}
            {filteredOrders.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    Select an Order -{" "}
                    <span className="text-accent">{date ? format(date, "dd/MM/yyyy") : "Today's Orders"}</span>
                  </h3>
                  <Button onClick={handleReset} variant="outline" size="sm" className="bg-background">
                    Back to Dashboard
                  </Button>
                </div>
                <div className="space-y-2">
                  {filteredOrders.map((order) => (
                    <Card
                      key={order.orderNumber}
                      className="p-4 cursor-pointer hover:border-accent transition-colors"
                      onClick={() => handleOrderSelect(order)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-foreground">Order #{order.orderNumber}</div>
                          <div className="text-sm text-muted-foreground">
                            {order.customerName} ({order.customerReference})
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">{order.orderDate}</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Order Detail View */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Order Details</h2>
              <Button onClick={handleReset} variant="outline" size="sm">
                Back to Dashboard
              </Button>
            </div>

            <Card className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Order Information</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Order Number</Label>
                    <div className="text-lg font-semibold">{selectedOrder.orderNumber}</div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Customer Name</Label>
                    <div className="text-lg font-semibold">{selectedOrder.customerName}</div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Customer Reference</Label>
                    <div className="text-lg font-semibold">{selectedOrder.customerReference}</div>
                  </div>
                  {orderDetailData[selectedOrder.orderNumber] && (
                    <>
                      <div>
                        <Label className="text-sm text-muted-foreground">Driver</Label>
                        <div className="text-lg font-semibold">
                          {orderDetailData[selectedOrder.orderNumber].header.driver}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Route</Label>
                        <div className="text-lg font-semibold">
                          {orderDetailData[selectedOrder.orderNumber].header.route}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Load</Label>
                        <div className="text-lg font-semibold">
                          {orderDetailData[selectedOrder.orderNumber].header.load}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Ordering Channel</Label>
                        <div className="text-lg font-semibold">
                          {orderDetailData[selectedOrder.orderNumber].header.orderingChannel}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Card>

            {/* Tabs for Warehouse and Transport */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="warehouse">Warehouse Details</TabsTrigger>
                <TabsTrigger value="transport">Transport Details</TabsTrigger>
              </TabsList>
              <TabsContent value="warehouse">
                {orderDetailDataSpecific[selectedOrder.orderNumber] ? (
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4 border-b pb-2">
                      <h3 className="text-lg font-semibold">Order Items</h3>
                      <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="Search order items..."
                          value={warehouseSearchQuery}
                          onChange={(e) => setWarehouseSearchQuery(e.target.value)}
                          className="pl-9 h-9"
                        />
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        {/* Update warehouse table headers with sorting */}
                        <thead>
                          <tr className="border-b">
                            <th
                              className="pb-3 text-sm font-semibold text-muted-foreground text-left cursor-pointer hover:text-[#60aa74] transition-colors"
                              onClick={() => handleWarehouseSort("binLabel")}
                            >
                              SKU
                              {getSortIcon("binLabel", warehouseSortConfig)}
                            </th>
                            <th
                              className="pb-3 text-sm font-semibold text-muted-foreground text-left cursor-pointer hover:text-[#60aa74] transition-colors"
                              onClick={() => handleWarehouseSort("extended")}
                            >
                              Product
                              {getSortIcon("extended", warehouseSortConfig)}
                            </th>
                            <th
                              className="pb-3 text-sm font-semibold text-muted-foreground text-center cursor-pointer hover:text-[#60aa74] transition-colors"
                              onClick={() => handleWarehouseSort("quantity")}
                            >
                              Order Qty
                              {getSortIcon("quantity", warehouseSortConfig)}
                            </th>
                            <th
                              className="pb-3 text-sm font-semibold text-muted-foreground text-center cursor-pointer hover:text-[#60aa74] transition-colors"
                              onClick={() => handleWarehouseSort("pickedQty")}
                            >
                              Pick Qty
                              {getSortIcon("pickedQty", warehouseSortConfig)}
                            </th>
                            <th
                              className="pb-3 text-sm font-semibold text-muted-foreground text-center cursor-pointer hover:text-[#60aa74] transition-colors"
                              onClick={() => handleWarehouseSort("unitPrice")}
                            >
                              {"Unit £"}
                              {getSortIcon("unitPrice", warehouseSortConfig)}
                            </th>
                            <th
                              className="pb-3 text-sm font-semibold text-muted-foreground text-center cursor-pointer hover:text-[#60aa74] transition-colors"
                              onClick={() => handleWarehouseSort("lineTotal")}
                            >
                              {"Line £"}
                              {getSortIcon("lineTotal", warehouseSortConfig)}
                            </th>
                            <th
                              className="pb-3 text-sm font-semibold text-muted-foreground text-center cursor-pointer hover:text-[#60aa74] transition-colors"
                              onClick={() => handleWarehouseSort("userId")}
                            >
                              User
                              {getSortIcon("userId", warehouseSortConfig)}
                            </th>
                            <th
                              className="pb-3 text-sm font-semibold text-muted-foreground text-center cursor-pointer hover:text-[#60aa74] transition-colors"
                              onClick={() => handleWarehouseSort("actionTime")}
                            >
                              Time
                              {getSortIcon("actionTime", warehouseSortConfig)}
                            </th>
                            <th
                              className="pb-3 text-sm font-semibold text-muted-foreground text-left cursor-pointer hover:text-[#60aa74] transition-colors"
                              onClick={() => handleWarehouseSort("feedbackNotes")}
                            >
                              Feedback Notes
                              {getSortIcon("feedbackNotes", warehouseSortConfig)}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortWarehouseData(
                            filterWarehouseData(orderDetailDataSpecific[selectedOrder.orderNumber].lineItems),
                          ).map((item, index) => (
                            <tr
                              key={index}
                              className="border-b last:border-0 hover:bg-muted/50 cursor-pointer transition-colors"
                              onClick={() => handleWarehouseItemClick(item)}
                            >
                              <td className="py-3 text-sm font-mono text-left">{item.binLabel}</td>
                              <td className="py-3 text-sm font-medium text-left">{item.extended}</td>
                              <td className="py-3 text-sm text-center">
                                <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded-md bg-accent/10 text-accent font-semibold">
                                  {item.quantity}
                                </span>
                              </td>
                              <td className="py-3 text-sm text-center">
                                <span
                                  className={`inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded-md font-semibold ${
                                    item.pickedQty < item.quantity
                                      ? "bg-red-100 text-red-600"
                                      : "bg-accent/10 text-accent"
                                  }`}
                                >
                                  {item.pickedQty}
                                </span>
                              </td>
                              <td className="py-3 text-sm text-center text-muted-foreground">
                                {`£${item.unitPrice?.toFixed(2) ?? "-"}`}
                              </td>
                              <td className="py-3 text-sm text-center font-medium">
                                {`£${item.lineTotal?.toFixed(2) ?? "-"}`}
                              </td>
                              <td className="py-3 text-sm text-center">
                                <HoverCard>
                                  <HoverCardTrigger>
                                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary font-medium">
                                      {item.userId}
                                    </span>
                                  </HoverCardTrigger>
                                  <HoverCardContent className="w-80">
                                    <div className="flex flex-col space-y-2">
                                      <h4 className="text-sm font-semibold">User Details</h4>
                                      <p className="text-sm text-muted-foreground">User ID: {item.userId}</p>
                                      {/* Additional user details can be added here */}
                                    </div>
                                  </HoverCardContent>
                                </HoverCard>
                              </td>
                              <td className="py-3 text-sm text-center text-muted-foreground">
                                {item.actionTime}
                              </td>
                              <td
                                className="py-3 text-sm text-muted-foreground text-left max-w-xs cursor-pointer hover:text-foreground transition-colors"
                                onClick={() => handleWarehouseItemClick(item)}
                              >
                                {item.feedbackNotes || "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {orderDetailData[selectedOrder.orderNumber]?.header.orderActions && (
                      <div className="mt-6 pt-4 border-t">
                        <h4 className="text-sm font-semibold text-foreground mb-3">Order Actions</h4>
                        <div className="grid grid-cols-3 gap-4">
                          {orderDetailData[selectedOrder.orderNumber].header.orderActions.map((action, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-3 rounded-lg border bg-muted/30 px-4 py-3"
                            >
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-md font-medium text-xs ${
                                  action.action === "Loaded"
                                    ? "bg-[#f6d06f]/20 text-[#f6d06f]"
                                    : action.action === "Shipped"
                                      ? "bg-accent/20 text-accent"
                                      : "bg-[#b2a0d2]/20 text-[#b2a0d2]"
                                }`}
                              >
                                {action.action}
                              </span>
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">{action.user}</span>
                                <span className="text-xs text-muted-foreground">{action.time}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-6 pt-4 border-t">
                      <div className="grid grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-accent">
                            {orderDetailData[selectedOrder.orderNumber]
                              ? `£${orderDetailData[selectedOrder.orderNumber].header.orderTotal}`
                              : "N/A"}
                          </div>
                          <div className="text-sm text-muted-foreground">Order Value</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-accent">
                            {orderDetailDataSpecific[selectedOrder.orderNumber].lineItems.length}
                          </div>
                          <div className="text-sm text-muted-foreground">No. Lines</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-accent">
                            {orderDetailData[selectedOrder.orderNumber]
                              ? `${(orderDetailDataSpecific[selectedOrder.orderNumber].lineItems.reduce(
                                  (sum, item) => sum + item.quantity * 0.45,
                                  0,
                                )).toFixed(1)} kg`
                              : "N/A"}
                          </div>
                          <div className="text-sm text-muted-foreground">Weight</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-accent">
                            {Math.ceil(
                              orderDetailDataSpecific[selectedOrder.orderNumber].lineItems.length / 3,
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">No. of Totes</div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ) : (
                  <Card className="p-6 text-center">
                    <p className="text-muted-foreground">No warehouse details available for this order.</p>
                  </Card>
                )}
              </TabsContent>
              <TabsContent value="transport">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4 border-b pb-2">
                    <h3 className="text-lg font-semibold">Transport Information</h3>
                    <div className="relative w-64">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search transport data..."
                        value={transportSearchQuery}
                        onChange={(e) => setTransportSearchQuery(e.target.value)}
                        className="pl-9 h-9"
                      />
                    </div>
                  </div>
                  {getOrderDetailData(selectedOrder.orderNumber)?.transportData &&
                  getOrderDetailData(selectedOrder.orderNumber)?.transportData.length > 0 ? (
                    <>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="pb-3 text-sm font-semibold text-muted-foreground text-center cursor-pointer hover:text-[#60aa74] transition-colors"
                              onClick={() => handleTransportSort("toteNo")}>
                              Tote No.
                              {getSortIcon("toteNo", transportSortConfig)}
                            </th>
                            <th className="pb-3 text-sm font-semibold text-muted-foreground text-left cursor-pointer hover:text-[#60aa74] transition-colors"
                              onClick={() => handleTransportSort("sku")}>
                              SKU
                              {getSortIcon("sku", transportSortConfig)}
                            </th>
                            <th className="pb-3 text-sm font-semibold text-muted-foreground text-left cursor-pointer hover:text-[#60aa74] transition-colors"
                              onClick={() => handleTransportSort("product")}>
                              Product
                              {getSortIcon("product", transportSortConfig)}
                            </th>
                            <th className="pb-3 text-sm font-semibold text-muted-foreground text-center cursor-pointer hover:text-[#60aa74] transition-colors"
                              onClick={() => handleTransportSort("streamStatus")}>
                              Stream Status
                              {getSortIcon("streamStatus", transportSortConfig)}
                            </th>
                            <th className="pb-3 text-sm font-semibold text-muted-foreground text-center cursor-pointer hover:text-[#60aa74] transition-colors"
                              onClick={() => handleTransportSort("time")}>
                              Time
                              {getSortIcon("time", transportSortConfig)}
                            </th>
                            <th className="pb-3 text-sm font-semibold text-muted-foreground text-center cursor-pointer hover:text-[#60aa74] transition-colors"
                              onClick={() => handleTransportSort("streamUpdate")}>
                              Stream Update
                              {getSortIcon("streamUpdate", transportSortConfig)}
                            </th>
                            <th className="pb-3 text-sm font-semibold text-muted-foreground text-left cursor-pointer hover:text-[#60aa74] transition-colors"
                              onClick={() => handleTransportSort("feedbackNotes")}>
                              Feedback Notes
                              {getSortIcon("feedbackNotes", transportSortConfig)}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortTransportData(
                            filterTransportData(getOrderDetailData(selectedOrder.orderNumber)?.transportData || []),
                          ).map((transport, tIdx) =>
                            transport.lineItems?.map((li, liIdx) => (
                              <tr
                                key={`${tIdx}-${liIdx}`}
                                className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                              >
                                <td className="py-3 text-sm text-center font-mono">{li.toteNo}</td>
                                <td className="py-3 text-sm text-left font-mono">{li.sku}</td>
                                <td className="py-3 text-sm text-left font-medium">{li.product}</td>
                                <td className="py-3 text-sm text-center">
                                  <span
                                    className={`inline-flex items-center px-2 py-1 rounded-md font-medium text-xs ${
                                      li.streamStatus === "Delivered" || li.streamStatus === "Signed"
                                        ? "bg-accent/20 text-accent"
                                        : li.streamStatus === "Partial" || li.streamStatus === "Delayed"
                                          ? "bg-red-100 text-red-600"
                                          : li.streamStatus === "Safe Place" || li.streamStatus === "After Hours"
                                            ? "bg-[#f6d06f]/20 text-[#f6d06f]"
                                            : "bg-[#b2a0d2]/20 text-[#b2a0d2]"
                                    }`}
                                  >
                                    {li.streamStatus}
                                  </span>
                                </td>
                                <td className="py-3 text-sm text-center text-muted-foreground">{li.time}</td>
                                <td className="py-3 text-sm text-center text-muted-foreground">{transport.comments || "-"}</td>
                                <td className="py-3 text-sm text-left text-muted-foreground">{li.feedbackNotes || "-"}</td>
                              </tr>
                            )),
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Delivery Photos Footer */}
                    {(() => {
                      const transportData = getOrderDetailData(selectedOrder.orderNumber)?.transportData || []
                      const allPhotos = transportData.flatMap((t) =>
                        (t.deliveryPhotos || []).map((photo, idx) => ({
                          photo,
                          routeNo: t.routeNo,
                          idx,
                        })),
                      )
                      if (allPhotos.length === 0) return null
                      return (
                        <div className="mt-6 pt-4 border-t">
                          <h4 className="text-sm font-semibold text-foreground mb-3">Delivery Photos</h4>
                          <div className="flex flex-wrap gap-3">
                            {allPhotos.map((item, i) => (
                              <div key={i} className="relative group">
                                <img
                                  src={item.photo || "/placeholder.svg"}
                                  alt={`Delivery photo ${item.idx + 1} - Route ${item.routeNo}`}
                                  className="h-24 w-24 rounded-lg border border-border object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={() => window.open(item.photo, "_blank")}
                                />
                                <span className="absolute bottom-1 left-1 bg-background/80 text-xs px-1.5 py-0.5 rounded text-muted-foreground">
                                  Route {item.routeNo}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })()}

                    {/* Delivery Summary Footer */}
                    {orderDetailData[selectedOrder.orderNumber]?.header && (
                      <div className="mt-6 pt-4 border-t">
                        <div className="grid grid-cols-4 gap-4">
                          <div className="flex flex-col items-center justify-between">
                            <div className="flex-1 flex items-center">
                              <span
                                className={`inline-flex items-center px-3 py-1.5 rounded-md font-semibold text-sm ${
                                  orderDetailData[selectedOrder.orderNumber].header.deliveryStatus === "Delivered"
                                    ? "bg-accent/20 text-accent"
                                    : orderDetailData[selectedOrder.orderNumber].header.deliveryStatus === "Partial Delivery"
                                      ? "bg-[#f6d06f]/20 text-[#f6d06f]"
                                      : "bg-red-100 text-red-600"
                                }`}
                              >
                                {orderDetailData[selectedOrder.orderNumber].header.deliveryStatus || "-"}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground mt-2">Delivery Status</div>
                          </div>
                          <div className="flex flex-col items-center justify-between">
                            <div className="flex-1 flex items-center">
                              <span className="text-2xl font-bold text-accent">
                                {orderDetailData[selectedOrder.orderNumber].header.deliveredTime || "-"}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground mt-2">Delivered Time</div>
                          </div>
                          <div className="flex flex-col items-center justify-between">
                            <div className="flex-1 flex items-center">
                              <span className="text-sm font-semibold text-foreground">
                                {orderDetailData[selectedOrder.orderNumber].header.signature || "-"}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground mt-2">Signature</div>
                          </div>
                          <div className="flex flex-col items-center justify-between">
                            <div className="flex-1 flex items-center">
                              {orderDetailData[selectedOrder.orderNumber].header.webLink ? (
                                <a
                                  href={orderDetailData[selectedOrder.orderNumber].header.webLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline transition-colors"
                                >
                                  View Order
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                </a>
                              ) : (
                                <span className="text-sm text-muted-foreground">-</span>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground mt-2">Web Link</div>
                          </div>
                        </div>
                      </div>
                    )}
                    </>
                  ) : (
                    <p className="text-muted-foreground">No transport details available for this order.</p>
                  )}
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>

      <Dialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Report Error</DialogTitle>
            <DialogDescription>
              Capture error information for{" "}
              {selectedLineItem?.type === "warehouse"
                ? `${selectedLineItem?.data?.extended || "this item"}`
                : `Route ${selectedLineItem?.data?.routeNo || ""}`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="error-reason">Error Reason</Label>
              <Select value={errorReason} onValueChange={setErrorReason}>
                <SelectTrigger id="error-reason">
                  <SelectValue placeholder="Select an error reason" />
                </SelectTrigger>
                <SelectContent>
                  {errorReasons.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="error-description">Description</Label>
              <Textarea
                id="error-description"
                placeholder="Provide additional details about the error..."
                value={errorDescription}
                onChange={(e) => setErrorDescription(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setErrorDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleErrorSubmit}>Submit Error Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
