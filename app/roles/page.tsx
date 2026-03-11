"use client"

import { useState } from "react"
import { Users, Shield, Plus, Search } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type Role = {
  id: number
  name: string
  description: string
  userCount: number
  color: string
}

type UserAssignment = {
  id: number
  name: string
  email: string
  role: string
}

export default function RolesPage() {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")

  // Users data to show assignments
  const usersData: UserAssignment[] = [
    { id: 1, name: "Alice Johnson", email: "alice.johnson@albion.com", role: "Administrator" },
    { id: 2, name: "Bob Smith", email: "bob.smith@albion.com", role: "Data Analyst" },
    { id: 3, name: "Carol Williams", email: "carol.williams@albion.com", role: "Editor" },
    { id: 4, name: "David Brown", email: "david.brown@albion.com", role: "Viewer" },
    { id: 5, name: "Emma Davis", email: "emma.davis@albion.com", role: "Data Analyst" },
    { id: 6, name: "Frank Miller", email: "frank.miller@albion.com", role: "Editor" },
    { id: 7, name: "Grace Lee", email: "grace.lee@albion.com", role: "Administrator" },
    { id: 8, name: "Henry Wilson", email: "henry.wilson@albion.com", role: "Viewer" },
    { id: 9, name: "Ivy Chen", email: "ivy.chen@albion.com", role: "Data Analyst" },
    { id: 10, name: "Jack Taylor", email: "jack.taylor@albion.com", role: "Administrator" },
  ]

  const [roles, setRoles] = useState<Role[]>([
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
  ])

  const openEditDialog = (role: Role) => {
    setSelectedRole(role)
    setEditName(role.name)
    setEditDescription(role.description)
    setShowEditDialog(true)
  }

  const handleSaveRole = () => {
    if (selectedRole) {
      setRoles(prevRoles =>
        prevRoles.map(role =>
          role.id === selectedRole.id
            ? { ...role, name: editName, description: editDescription }
            : role
        )
      )
    }
    setShowEditDialog(false)
  }

  const getUsersForRole = (roleName: string) => {
    return usersData.filter(user => user.role === roleName)
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
  href="/upload"
  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-accent hover:border-b-2 hover:border-accent transition-colors"
  >
  Pricing Communication
  </Link>
              <Link
                href="/roles"
                className="px-3 py-2 text-sm font-medium text-accent border-b-2 border-accent transition-colors"
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
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="border border-accent hover:bg-accent hover:text-white"
                    onClick={() => openEditDialog(role)}
                  >
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

      {/* Edit Role Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Update the role details and view assigned users
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-6">
            {/* Role Color Indicator */}
            {selectedRole && (
              <div className="flex items-center gap-3">
                <div className={`${selectedRole.color} h-4 w-4 rounded-full`} />
                <span className="text-sm text-muted-foreground">Role color indicator</span>
              </div>
            )}

            {/* Editable Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role-name">Role Name</Label>
                <Input
                  id="role-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role-description">Description</Label>
                <Textarea
                  id="role-description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            {/* Assigned Users */}
            {selectedRole && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Assigned Users</Label>
                  <span className="text-sm text-muted-foreground">
                    {getUsersForRole(selectedRole.name).length} users
                  </span>
                </div>
                <div className="border rounded-lg max-h-48 overflow-y-auto">
                  {getUsersForRole(selectedRole.name).length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No users assigned to this role
                    </div>
                  ) : (
                    <div className="divide-y">
                      {getUsersForRole(selectedRole.name).map(user => (
                        <div key={user.id} className="flex items-center gap-3 p-3">
                          <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
                            <span className="text-xs font-medium text-white">
                              {getInitials(user.name)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {user.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRole}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
