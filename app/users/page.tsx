import { Users, Database, Plus, Search, MoreHorizontal, Mail, Shield } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function UsersPage() {
  const users = [
    {
      id: 1,
      name: "Alex Davidson",
      email: "alex.davidson@albion.com",
      role: "Administrator",
      status: "Active",
      lastActive: "2 hours ago",
      initials: "AD",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.johnson@albion.com",
      role: "Data Analyst",
      status: "Active",
      lastActive: "5 mins ago",
      initials: "SJ",
    },
    {
      id: 3,
      name: "Tim Roberts",
      email: "tim.roberts@albion.com",
      role: "Editor",
      status: "Active",
      lastActive: "1 day ago",
      initials: "TR",
    },
    {
      id: 4,
      name: "Gary Peters",
      email: "gary.peters@albion.com",
      role: "Viewer",
      status: "Inactive",
      lastActive: "2 weeks ago",
      initials: "GP",
    },
    {
      id: 5,
      name: "Lisa Morgan",
      email: "lisa.morgan@albion.com",
      role: "Data Analyst",
      status: "Active",
      lastActive: "30 mins ago",
      initials: "LM",
    },
    {
      id: 6,
      name: "Mark Williams",
      email: "mark.williams@albion.com",
      role: "Editor",
      status: "Active",
      lastActive: "3 hours ago",
      initials: "MW",
    },
    {
      id: 7,
      name: "Jane Davies",
      email: "jane.davies@albion.com",
      role: "Viewer",
      status: "Active",
      lastActive: "Just now",
      initials: "JD",
    },
    {
      id: 8,
      name: "Paul Morgan",
      email: "paul.morgan@albion.com",
      role: "Administrator",
      status: "Active",
      lastActive: "1 hour ago",
      initials: "PM",
    },
  ]

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Administrator":
        return "bg-[#b2a0d2] text-white"
      case "Data Analyst":
        return "bg-[#f6d06f] text-foreground"
      case "Editor":
        return "bg-[#60aa74] text-white"
      case "Viewer":
        return "bg-[#323132] text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusColor = (status: string) => {
    return status === "Active"
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-600"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Database className="h-6 w-6 text-primary" />
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
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-accent hover:border-b-2 hover:border-accent transition-colors"
              >
                Roles
              </Link>
              <Link
                href="/users"
                className="px-3 py-2 text-sm font-medium text-accent border-b-2 border-accent transition-colors"
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Users</h1>
              <p className="text-muted-foreground">Manage user accounts and their access permissions</p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search users..." className="pl-10" />
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">User</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Role</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Last Active</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                            {user.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        <Shield className="h-3 w-3" />
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {user.lastActive}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Users className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Shield className="h-4 w-4 mr-2" />
                            Change Role
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {users.length} users
          </div>
        </div>
      </main>
    </div>
  )
}
