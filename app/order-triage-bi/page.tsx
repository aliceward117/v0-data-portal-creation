"use client"
import { Database, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Card } from "@/components/ui/card"

export default function OrderTriageBIReport() {
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
                href="/roles"
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-accent hover:border-b-2 hover:border-accent transition-colors"
              >
                Roles
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

      <main className="p-6 h-[calc(100vh-80px)]">
        <div className="h-full flex flex-col">
          {/* Page Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link href="/order-triage" className="p-2 hover:bg-muted rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Order Triage BI Report</h1>
              <p className="text-muted-foreground mt-1">Business Intelligence analytics and insights dashboard</p>
            </div>
          </div>

          {/* Power BI Embed Container */}
          <Card className="flex-1 p-0 overflow-hidden">
            <iframe src="YOUR_POWER_BI_EMBED_URL" className="w-full h-full border-0" allowFullScreen />
          </Card>
        </div>
      </main>
    </div>
  )
}
