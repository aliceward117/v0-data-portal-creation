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
                  <TableHead className="font-semibold text-right">Price</TableHead>
                  <TableHead className="font-semibold text-right">Change</TableHead>
                  <TableHead className="font-semibold">Date pricing goes live</TableHead>
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
