"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FileSpreadsheet, Calendar, TrendingUp, Search, User, Heart, ShoppingCart, ChevronDown, Download, Building2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

// Customer data for search
const customers = [
  { id: "CUST001", name: "The Riverside Restaurant" },
  { id: "CUST002", name: "Hilltop Cafe" },
  { id: "CUST003", name: "Central Bistro" },
  { id: "CUST004", name: "Harbour Kitchen" },
  { id: "CUST005", name: "Oakwood Diner" },
]
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Fixed Price data - standard pricing for all customers
const fixedPriceData = [
  { id: "1", code: "ANTIBAC", currentPrice: 2.79, newPrice: 2.89, liveDate: "01.03.26" },
  { id: "2", code: "ANTIBAC750", currentPrice: 1.89, newPrice: 2.19, liveDate: "01.03.26" },
  { id: "3", code: "APPLEF1", currentPrice: 2.29, newPrice: 2.49, liveDate: "01.03.26" },
  { id: "4", code: "APPLEJM", currentPrice: 8.59, newPrice: 10.59, liveDate: "01.03.26" },
  { id: "5", code: "AVOCADOFRRIPE", currentPrice: 1.09, newPrice: 1.09, liveDate: "01.03.26" },
  { id: "6", code: "BAGPAP8.5", currentPrice: 16.72, newPrice: 16.72, liveDate: "01.03.26" },
  { id: "7", code: "BAKEWELL", currentPrice: 6.39, newPrice: 6.39, liveDate: "01.03.26" },
  { id: "8", code: "BANANAFR", currentPrice: 1.75, newPrice: 1.75, liveDate: "01.03.26" },
  { id: "9", code: "BATHROOMCLEANER", currentPrice: 2.42, newPrice: 2.42, liveDate: "01.03.26" },
  { id: "10", code: "BEERLINECLEA5", currentPrice: 13.95, newPrice: 13.95, liveDate: "01.03.26" },
  { id: "11", code: "BEETROOTJUICE", currentPrice: 3.39, newPrice: 3.40, liveDate: "01.03.26" },
  { id: "12", code: "BISCLOTUS", currentPrice: 17.20, newPrice: 17.98, liveDate: "01.03.26" },
  { id: "13", code: "BLEACHTHICK5", currentPrice: 4.98, newPrice: 5.39, liveDate: "01.03.26" },
  { id: "14", code: "BLUEBERRFR", currentPrice: 1.89, newPrice: 1.91, liveDate: "01.03.26" },
  { id: "15", code: "BLUEBERRFZ", currentPrice: 6.22, newPrice: 6.22, liveDate: "01.03.26" },
  { id: "16", code: "BLUETOWEL", currentPrice: 12.29, newPrice: 9.98, liveDate: "01.03.26" },
  { id: "17", code: "BREADMALTBLOOM", currentPrice: 2.19, newPrice: 2.19, liveDate: "01.03.26" },
  { id: "18", code: "BREADWHOLTHCF", currentPrice: 1.89, newPrice: 1.89, liveDate: "01.03.26" },
  { id: "19", code: "BREADWHTHCF", currentPrice: 1.89, newPrice: 1.89, liveDate: "01.03.26" },
  { id: "20", code: "BRUSHWIRE", currentPrice: 4.99, newPrice: 4.99, liveDate: "01.03.26" },
  { id: "21", code: "BURRATAV100", currentPrice: 1.69, newPrice: 1.69, liveDate: "01.03.26" },
  { id: "22", code: "BUTTBEANSA10", currentPrice: 4.69, newPrice: 4.69, liveDate: "01.03.26" },
  { id: "23", code: "CAKEFDAPPLE", currentPrice: 16.39, newPrice: 16.39, liveDate: "01.03.26" },
  { id: "24", code: "CAKEFDPECAN", currentPrice: 15.75, newPrice: 16.39, liveDate: "01.03.26" },
  { id: "25", code: "CAKEFRCARR", currentPrice: 15.89, newPrice: 15.89, liveDate: "01.03.26" },
  { id: "26", code: "CAKEFRCHOC", currentPrice: 19.29, newPrice: 19.86, liveDate: "01.03.26" },
  { id: "27", code: "CAPERSLILI", currentPrice: 15.39, newPrice: 15.39, liveDate: "01.03.26" },
  { id: "28", code: "CAWSAPPLE", currentPrice: 23.54, newPrice: 23.54, liveDate: "01.03.26" },
  { id: "29", code: "CELERYHEAD", currentPrice: 0.95, newPrice: 0.97, liveDate: "01.03.26" },
]

// List Prices data - tiered pricing based on volume bands (discounted rates)
const bandAPriceData = [
  { id: "1", code: "ANTIBAC", currentPrice: 2.49, newPrice: 2.59, liveDate: "01.03.26" },
  { id: "2", code: "ANTIBAC750", currentPrice: 1.69, newPrice: 1.89, liveDate: "01.03.26" },
  { id: "3", code: "APPLEF1", currentPrice: 1.99, newPrice: 2.19, liveDate: "01.03.26" },
  { id: "4", code: "APPLEJM", currentPrice: 7.49, newPrice: 9.29, liveDate: "01.03.26" },
  { id: "5", code: "AVOCADOFRRIPE", currentPrice: 0.89, newPrice: 0.89, liveDate: "01.03.26" },
  { id: "6", code: "BAGPAP8.5", currentPrice: 14.99, newPrice: 14.99, liveDate: "01.03.26" },
  { id: "7", code: "BAKEWELL", currentPrice: 5.59, newPrice: 5.59, liveDate: "01.03.26" },
  { id: "8", code: "BANANAFR", currentPrice: 1.49, newPrice: 1.49, liveDate: "01.03.26" },
  { id: "9", code: "BATHROOMCLEANER", currentPrice: 2.09, newPrice: 2.09, liveDate: "01.03.26" },
  { id: "10", code: "BEERLINECLEA5", currentPrice: 11.99, newPrice: 11.99, liveDate: "01.03.26" },
  { id: "11", code: "BEETROOTJUICE", currentPrice: 2.89, newPrice: 2.95, liveDate: "01.03.26" },
  { id: "12", code: "BISCLOTUS", currentPrice: 14.99, newPrice: 15.69, liveDate: "01.03.26" },
  { id: "13", code: "BLEACHTHICK5", currentPrice: 4.29, newPrice: 4.69, liveDate: "01.03.26" },
  { id: "14", code: "BLUEBERRFR", currentPrice: 1.59, newPrice: 1.65, liveDate: "01.03.26" },
  { id: "15", code: "BLUEBERRFZ", currentPrice: 5.39, newPrice: 5.39, liveDate: "01.03.26" },
  { id: "16", code: "BLUETOWEL", currentPrice: 10.49, newPrice: 8.49, liveDate: "01.03.26" },
  { id: "17", code: "BREADMALTBLOOM", currentPrice: 1.89, newPrice: 1.89, liveDate: "01.03.26" },
  { id: "18", code: "BREADWHOLTHCF", currentPrice: 1.59, newPrice: 1.59, liveDate: "01.03.26" },
  { id: "19", code: "BREADWHTHCF", currentPrice: 1.59, newPrice: 1.59, liveDate: "01.03.26" },
  { id: "20", code: "BRUSHWIRE", currentPrice: 4.29, newPrice: 4.29, liveDate: "01.03.26" },
  { id: "21", code: "BURRATAV100", currentPrice: 1.45, newPrice: 1.45, liveDate: "01.03.26" },
  { id: "22", code: "BUTTBEANSA10", currentPrice: 3.99, newPrice: 3.99, liveDate: "01.03.26" },
  { id: "23", code: "CAKEFDAPPLE", currentPrice: 14.29, newPrice: 14.29, liveDate: "01.03.26" },
  { id: "24", code: "CAKEFDPECAN", currentPrice: 13.69, newPrice: 14.29, liveDate: "01.03.26" },
  { id: "25", code: "CAKEFRCARR", currentPrice: 13.89, newPrice: 13.89, liveDate: "01.03.26" },
  { id: "26", code: "CAKEFRCHOC", currentPrice: 16.79, newPrice: 17.29, liveDate: "01.03.26" },
  { id: "27", code: "CAPERSLILI", currentPrice: 13.39, newPrice: 13.39, liveDate: "01.03.26" },
  { id: "28", code: "CAWSAPPLE", currentPrice: 20.49, newPrice: 20.49, liveDate: "01.03.26" },
  { id: "29", code: "CELERYHEAD", currentPrice: 0.79, newPrice: 0.82, liveDate: "01.03.26" },
]

const navCategories = [
  "Spotlight", "Chilled", "Store Cupboard", "Fresh Fruit & Veg", 
  "Drinks", "Frozen", "Non-Food", "REFINED", "What's New?", "About Us"
]

export default function PublicPricingPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [priceType, setPriceType] = useState<"fixed" | "bandA">("fixed")
  const [customerSearch, setCustomerSearch] = useState("")
  const [showCustomerResults, setShowCustomerResults] = useState(false)
  
  const effectiveDate = "1st March 2026"
  
  // Filter customers based on search
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.id.toLowerCase().includes(customerSearch.toLowerCase())
  )
  
  // Navigate to customer-specific pricing page
  const goToCustomerPricing = (customerId: string) => {
    router.push(`/pricing/${customerId}`)
  }
  const lastUpdated = new Date().toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  })

  const pricingData = priceType === "fixed" ? fixedPriceData : bandAPriceData
  
  const filteredData = pricingData.filter(item => 
    item.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Export pricing data to CSV
  const exportToCSV = () => {
    const headers = ["Product Code", "Current Price", "New Price", "Change (%)", "Effective Date"]
    const csvRows = [
      headers.join(","),
      ...filteredData.map(item => {
        const change = item.newPrice - item.currentPrice
        const changePercent = ((change / item.currentPrice) * 100).toFixed(1)
        return [
          item.code,
          `£${item.currentPrice.toFixed(2)}`,
          `£${item.newPrice.toFixed(2)}`,
          `${change > 0 ? "+" : ""}${changePercent}%`,
          item.liveDate
        ].join(",")
      })
    ]
    
    const csvContent = csvRows.join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `albion-pricing-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Announcement Bar */}
      <div className="bg-[#E85A71] text-white py-2.5 text-center">
        <p className="text-sm font-medium">
          Read our latest Edition | <span className="italic">The Digest</span> 
          <span className="ml-2">→</span>
        </p>
      </div>

      {/* Header */}
      <header className="bg-[#2D3436] text-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Search */}
            <div className="flex items-center gap-2 bg-white rounded px-3 py-2 w-64">
              <Input 
                placeholder="Search products..." 
                className="border-0 p-0 h-auto text-gray-800 placeholder:text-gray-400 focus-visible:ring-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="h-5 w-5 text-[#00B894]" />
            </div>

            {/* Logo */}
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-wide">ALBION</h1>
              <p className="text-xs tracking-[0.3em] text-gray-300">FINE FOODS</p>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 text-sm hover:text-gray-300">
                <User className="h-5 w-5" />
                Sign in / Register
              </button>
              <button className="hover:text-gray-300">
                <Heart className="h-5 w-5" />
              </button>
              <button className="flex items-center gap-2 hover:text-gray-300">
                <ShoppingCart className="h-5 w-5" />
                <span>£0.00</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="border-t border-gray-600">
          <div className="max-w-7xl mx-auto px-6">
            <ul className="flex items-center justify-center gap-8 py-3 text-sm">
              {navCategories.map((cat) => (
                <li key={cat}>
                  <a href="#" className="hover:text-[#00B894] transition-colors">{cat}</a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative bg-[#2D3436] text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#2D3436] via-[#2D3436]/90 to-transparent z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200')" }}
        />
        <div className="relative z-20 max-w-7xl mx-auto px-6 py-20">
          <div className="max-w-2xl">
            <h2 className="text-5xl font-bold mb-4 text-[#00B894]">
              PRICING UPDATE
            </h2>
            <p className="text-2xl font-light mb-2">
              Effective from {effectiveDate}
            </p>
            <p className="text-gray-300 text-lg">
              Please review our updated pricing schedule below
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="p-6 flex items-start gap-4 border-0 shadow-md">
            <div className="p-3 rounded-full bg-[#00B894]/10">
              <Calendar className="h-6 w-6 text-[#00B894]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Effective Date</p>
              <p className="text-xl font-semibold text-gray-900">{effectiveDate}</p>
            </div>
          </Card>
          <Card className="p-6 flex items-start gap-4 border-0 shadow-md">
            <div className="p-3 rounded-full bg-[#00B894]/10">
              <TrendingUp className="h-6 w-6 text-[#00B894]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-xl font-semibold text-gray-900">{pricingData.length} items</p>
            </div>
          </Card>
          <Card className="p-6 flex items-start gap-4 border-0 shadow-md">
            <div className="p-3 rounded-full bg-[#00B894]/10">
              <FileSpreadsheet className="h-6 w-6 text-[#00B894]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="text-xl font-semibold text-gray-900">{lastUpdated}</p>
            </div>
          </Card>
        </div>

        {/* Notice */}
        <div className="bg-[#00B894]/10 border-l-4 border-[#00B894] p-5 mb-10 rounded-r-lg">
          <p className="text-gray-700">
            <span className="font-semibold">Important Notice:</span> The prices shown below will come into effect on {effectiveDate}. 
            Please update your records accordingly. For any queries regarding these price changes, please contact your dedicated account manager.
          </p>
        </div>

        {/* Customer Search */}
        <Card className="p-6 mb-8 border-0 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="h-5 w-5 text-[#00B894]" />
            <h3 className="text-lg font-semibold text-gray-900">Find Your Customer Pricing</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Search for a client by name or customer number to view their specific pricing schedule.
          </p>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by client name or customer number (e.g., CUST001)..."
              value={customerSearch}
              onChange={(e) => {
                setCustomerSearch(e.target.value)
                setShowCustomerResults(e.target.value.length > 0)
              }}
              onFocus={() => customerSearch.length > 0 && setShowCustomerResults(true)}
              className="pl-10 h-12 text-base"
            />
            
            {/* Search Results Dropdown */}
            {showCustomerResults && customerSearch.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg z-10 max-h-64 overflow-auto">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <button
                      key={customer.id}
                      onClick={() => goToCustomerPricing(customer.id)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 border-b last:border-b-0 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-[#00B894]/10">
                          <Building2 className="h-4 w-4 text-[#00B894]" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-gray-900">{customer.name}</p>
                          <p className="text-sm text-gray-500">{customer.id}</p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-gray-500">
                    <p>No customers found matching "{customerSearch}"</p>
                    <p className="text-sm mt-1">Try searching by name or customer number</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Quick Links */}
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-500 mb-2">Quick access:</p>
            <div className="flex flex-wrap gap-2">
              {customers.slice(0, 3).map((customer) => (
                <Button
                  key={customer.id}
                  variant="outline"
                  size="sm"
                  onClick={() => goToCustomerPricing(customer.id)}
                  className="text-xs"
                >
                  {customer.name}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Pricing Table */}
        <Card className="overflow-hidden border-0 shadow-lg">
          {/* Price Type Toggle */}
          <div className="p-4 border-b bg-gray-50 flex items-center justify-center gap-2">
            <span className="text-sm text-gray-600 mr-2">View pricing for:</span>
            <div className="flex gap-1 p-1 bg-gray-200 rounded-lg">
              <button
                onClick={() => setPriceType("fixed")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  priceType === "fixed"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Fixed Price
              </button>
              <button
                onClick={() => setPriceType("bandA")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  priceType === "bandA"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                List Prices
              </button>
            </div>
          </div>
          
          <div className="p-6 border-b bg-[#2D3436] text-white flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Product Pricing Schedule 
                <span className="ml-2 text-sm font-normal text-[#00B894]">
                  ({priceType === "fixed" ? "Fixed Price" : "List Prices"})
                </span>
              </h2>
              <p className="text-gray-300 text-sm mt-1">
                {filteredData.length} products {searchQuery && `matching "${searchQuery}"`}
              </p>
            </div>
            <Button 
              onClick={exportToCSV}
              variant="outline" 
              className="gap-2 bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">Product Code</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-right">Current Price</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-right">New Price</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-right">Change</TableHead>
                  <TableHead className="font-semibold text-gray-700">Effective Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => {
                  const change = item.newPrice - item.currentPrice
                  const changePercent = ((change / item.currentPrice) * 100).toFixed(1)
                  return (
                    <TableRow key={item.id} className="hover:bg-gray-50">
                      <TableCell className="font-mono text-sm font-medium text-gray-900">{item.code}</TableCell>
                      <TableCell className="text-right text-gray-500">
                        £{item.currentPrice.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-gray-900">
                        £{item.newPrice.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          change > 0 
                            ? "bg-amber-100 text-amber-800" 
                            : change < 0 
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-600"
                        }`}>
                          {change > 0 ? "+" : ""}{changePercent}%
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-600">{item.liveDate}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <p>This pricing schedule is confidential and intended only for the recipient.</p>
            <p>© {new Date().getFullYear()} Albion Fine Foods. All rights reserved.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
