import { Database, Users, Settings, BarChart3, FileText, Shield } from "lucide-react"
import Link from "next/link"

export default function DataPortal() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
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
                className="px-3 py-2 text-sm font-medium text-accent border-b-2 border-accent transition-colors"
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
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-accent hover:border-b-2 hover:border-accent transition-colors"
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

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to Albion Insights</h1>
          <p className="text-muted-foreground mb-8">
            Manage your data, users, and system settings from a centralized dashboard
          </p>

          {/* Quick Access Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              href="/data"
              className="group p-6 bg-card border border-border rounded-lg hover:border-primary transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Data Analytics</h3>
              <p className="text-sm text-muted-foreground">
                View and analyze your data with powerful visualization tools
              </p>
            </Link>

            <Link
              href="/roles"
              className="group p-6 bg-card border border-border rounded-lg hover:border-primary transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Roles & Permissions</h3>
              <p className="text-sm text-muted-foreground">Manage user roles and configure access permissions</p>
            </Link>

            <Link
              href="/settings"
              className="group p-6 bg-card border border-border rounded-lg hover:border-primary transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Settings className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">System Settings</h3>
              <p className="text-sm text-muted-foreground">Configure system preferences and integration settings</p>
            </Link>

            <Link
              href="/reports"
              className="group p-6 bg-card border border-border rounded-lg hover:border-primary transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-muted rounded-lg">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Reports</h3>
              <p className="text-sm text-muted-foreground">Generate and export detailed reports</p>
            </Link>

            <Link
              href="/security"
              className="group p-6 bg-card border border-border rounded-lg hover:border-primary transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-muted rounded-lg">
                  <Shield className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Security</h3>
              <p className="text-sm text-muted-foreground">Monitor security events and manage authentication</p>
            </Link>

            <Link
              href="/order-triage"
              className="group p-6 bg-card border border-border rounded-lg hover:border-primary transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-muted rounded-lg">
                  {/* Placeholder icon for Order Triage */}
                  <div className="h-6 w-6 bg-primary text-primary-foreground flex items-center justify-center rounded-lg">
                    OT
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Order Triage</h3>
              <p className="text-sm text-muted-foreground">Manage and prioritize orders efficiently</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
