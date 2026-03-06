import { Users, Shield, Plus, Search } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function RolesPage() {
  const roles = [
    {
      id: 1,
      name: "Administrator",
      description: "Full system access with all permissions",
      userCount: 3,
      color: "bg-[#b2a0d2]", // Soft lavender
    },
    {
      id: 2,
      name: "Data Analyst",
      description: "Read access to analytics and reports",
      userCount: 12,
      color: "bg-[#f6d06f]", // Warm gold/yellow
    },
    {
      id: 3,
      name: "Editor",
      description: "Create and edit content with limited access",
      userCount: 8,
      color: "bg-[#60aa74]", // System accent color
    },
    {
      id: 4,
      name: "Viewer",
      description: "Read-only access to portal content",
      userCount: 24,
      color: "bg-[#323132]", // System primary color
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
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
                href="/roles"
                className="px-3 py-2 text-sm font-medium text-accent border-b-2 border-accent transition-colors"
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

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Roles & Permissions</h1>
              <p className="text-muted-foreground">Manage user roles and configure access permissions</p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Role
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search roles..." className="pl-10" />
            </div>
          </div>

          {/* Roles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roles.map((role) => (
              <div
                key={role.id}
                className="p-6 bg-card border border-border rounded-lg hover:border-primary transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`${role.color} h-3 w-3 rounded-full`} />
                    <h3 className="text-lg font-semibold text-foreground">{role.name}</h3>
                  </div>
                  <Button variant="ghost" size="sm" className="border border-accent hover:bg-accent hover:text-white">
                    Edit
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{role.description}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{role.userCount} users</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
