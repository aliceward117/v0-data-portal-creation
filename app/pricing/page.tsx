import { FileSpreadsheet, Calendar, TrendingUp } from "lucide-react"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Sample pricing data - in production this would come from a database or API
const pricingData = [
  { id: "1", code: "ALB-001", currentPrice: 22.50, newPrice: 24.50, liveDate: "01/04/2026" },
  { id: "2", code: "ALB-002", currentPrice: 3.50, newPrice: 3.75, liveDate: "01/04/2026" },
  { id: "3", code: "ALB-003", currentPrice: 42.00, newPrice: 45.90, liveDate: "01/04/2026" },
  { id: "4", code: "ALB-004", currentPrice: 65.00, newPrice: 67.25, liveDate: "01/04/2026" },
  { id: "5", code: "ALB-005", currentPrice: 17.50, newPrice: 18.30, liveDate: "01/04/2026" },
  { id: "6", code: "ALB-006", currentPrice: 85.00, newPrice: 89.00, liveDate: "01/04/2026" },
  { id: "7", code: "ALB-007", currentPrice: 235.00, newPrice: 245.00, liveDate: "01/04/2026" },
  { id: "8", code: "ALB-008", currentPrice: 11.50, newPrice: 12.50, liveDate: "01/04/2026" },
  { id: "9", code: "ALB-009", currentPrice: 8.25, newPrice: 8.95, liveDate: "01/04/2026" },
  { id: "10", code: "ALB-010", currentPrice: 14.50, newPrice: 15.75, liveDate: "01/04/2026" },
]

export default function PublicPricingPage() {
  const effectiveDate = "1st April 2026"
  const lastUpdated = new Date().toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Albion Fine Foods</h1>
              <p className="text-primary-foreground/80">Pricing Schedule</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="p-5 flex items-start gap-4">
            <div className="p-3 rounded-lg bg-accent/10">
              <Calendar className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Effective Date</p>
              <p className="text-lg font-semibold text-foreground">{effectiveDate}</p>
            </div>
          </Card>
          <Card className="p-5 flex items-start gap-4">
            <div className="p-3 rounded-lg bg-accent/10">
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Products</p>
              <p className="text-lg font-semibold text-foreground">{pricingData.length} items</p>
            </div>
          </Card>
        </div>

        {/* Notice */}
        <Card className="p-5 mb-8 border-l-4 border-l-accent bg-accent/5">
          <p className="text-sm text-foreground">
            <span className="font-semibold">Important:</span> The prices shown below will come into effect on {effectiveDate}. 
            Please update your records accordingly. For any queries, contact your account manager.
          </p>
        </Card>

        {/* Pricing Table */}
        <Card className="overflow-hidden">
          <div className="p-5 border-b bg-muted/30">
            <h2 className="text-lg font-semibold text-foreground">Product Pricing</h2>
            <p className="text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Product Code</TableHead>
                  <TableHead className="font-semibold text-right">Current Price</TableHead>
                  <TableHead className="font-semibold text-right">New Price</TableHead>
                  <TableHead className="font-semibold text-right">Change</TableHead>
                  <TableHead className="font-semibold">Effective Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pricingData.map((item) => {
                  const change = item.newPrice - item.currentPrice
                  const changePercent = ((change / item.currentPrice) * 100).toFixed(1)
                  return (
                    <TableRow key={item.id} className="hover:bg-muted/30">
                      <TableCell className="font-mono text-sm font-medium">{item.code}</TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        £{item.currentPrice.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        £{item.newPrice.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          change > 0 
                            ? "bg-amber-100 text-amber-800" 
                            : change < 0 
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                        }`}>
                          {change > 0 ? "+" : ""}{changePercent}%
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{item.liveDate}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>This pricing schedule is confidential and intended only for the recipient.</p>
          <p className="mt-1">© {new Date().getFullYear()} Albion Fine Foods. All rights reserved.</p>
        </div>
      </main>
    </div>
  )
}
