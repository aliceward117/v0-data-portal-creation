"use client"

import { useState, useRef } from "react"
import { Users, Shield, Plus, Search, Mail, Calendar, MoreHorizontal, User, RefreshCw, Check, Camera, Clock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type UserType = {
  id: number
  name: string
  email: string
  role: string
  roleColor: string
  lastActive: string
  status: string
  photo?: string
}

export default function UsersPage() {
  const [showRoleDialog, setShowRoleDialog] = useState(false)
  const [showProfileDialog, setShowProfileDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  
  // Profile editing state
  const [editName, setEditName] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [editRole, setEditRole] = useState("")
  const [editPhoto, setEditPhoto] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const openProfileDialog = (user: UserType) => {
    setSelectedUser(user)
    setEditName(user.name)
    setEditEmail(user.email)
    setEditRole(user.role)
    setEditPhoto(user.photo || null)
    setShowProfileDialog(true)
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditPhoto(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const roles = [
    {
      id: 1,
      name: "Administrator",
      description: "Full system access with all permissions",
      color: "bg-[#b2a0d2]",
    },
    {
      id: 2,
      name: "Data Analyst",
      description: "Read access to analytics and reports",
      color: "bg-[#f6d06f]",
    },
    {
      id: 3,
      name: "Editor",
      description: "Create and edit content with limited access",
      color: "bg-[#60aa74]",
    },
    {
      id: 4,
      name: "Viewer",
      description: "Read-only access to portal content",
      color: "bg-[#323132]",
    },
  ]

  const [users, setUsers] = useState<UserType[]>([
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice.johnson@albion.com",
      role: "Administrator",
      roleColor: "bg-[#b2a0d2]",
      lastActive: "2 hours ago",
      status: "Active",
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob.smith@albion.com",
      role: "Data Analyst",
      roleColor: "bg-[#f6d06f]",
      lastActive: "1 day ago",
      status: "Active",
    },
    {
      id: 3,
      name: "Carol Williams",
      email: "carol.williams@albion.com",
      role: "Editor",
      roleColor: "bg-[#60aa74]",
      lastActive: "3 hours ago",
      status: "Active",
    },
    {
      id: 4,
      name: "David Brown",
      email: "david.brown@albion.com",
      role: "Viewer",
      roleColor: "bg-[#323132]",
      lastActive: "1 week ago",
      status: "Inactive",
    },
    {
      id: 5,
      name: "Emma Davis",
      email: "emma.davis@albion.com",
      role: "Data Analyst",
      roleColor: "bg-[#f6d06f]",
      lastActive: "5 minutes ago",
      status: "Active",
    },
    {
      id: 6,
      name: "Frank Miller",
      email: "frank.miller@albion.com",
      role: "Editor",
      roleColor: "bg-[#60aa74]",
      lastActive: "2 days ago",
      status: "Active",
    },
  ])

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
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
                Upload
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
              <p className="text-muted-foreground">Manage user accounts and access</p>
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
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
<td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.photo ? (
                          <div className="h-10 w-10 rounded-full overflow-hidden">
                            <img 
                              src={user.photo} 
                              alt={user.name} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                            <span className="text-sm font-medium text-primary-foreground">
                              {user.name.split(" ").map(n => n[0]).join("")}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-foreground">{user.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`${user.roleColor} h-2 w-2 rounded-full`} />
                        <span className="text-sm text-foreground">{user.role}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.status === "Active"
                            ? "bg-[#60aa74]/10 text-[#60aa74]"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {user.lastActive}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem 
                            className="gap-2 cursor-pointer"
                            onClick={() => openProfileDialog(user)}
                          >
                            <User className="h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            <Mail className="h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="gap-2 cursor-pointer"
                            onClick={() => {
                              setSelectedUser(user)
                              setSelectedRole(user.role)
                              setShowRoleDialog(true)
                            }}
                          >
                            <RefreshCw className="h-4 w-4" />
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
        </div>
      </main>

      {/* Change Role Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Role</DialogTitle>
            <DialogDescription>
              Select a new role for {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-2">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.name)}
                  className={`w-full p-4 rounded-lg border text-left transition-all ${
                    selectedRole === role.name
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-accent/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`${role.color} h-3 w-3 rounded-full`} />
                      <div>
                        <p className="font-medium text-foreground">{role.name}</p>
                        <p className="text-sm text-muted-foreground">{role.description}</p>
                      </div>
                    </div>
                    {selectedRole === role.name && (
                      <Check className="h-5 w-5 text-accent" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowRoleDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                if (selectedUser && selectedRole) {
                  const roleData = roles.find(r => r.name === selectedRole)
                  setUsers(prevUsers => 
                    prevUsers.map(user => 
                      user.id === selectedUser.id 
                        ? { ...user, role: selectedRole, roleColor: roleData?.color || user.roleColor }
                        : user
                    )
                  )
                }
                setShowRoleDialog(false)
              }}
              disabled={!selectedRole || selectedRole === selectedUser?.role}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Profile Dialog */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
            <DialogDescription>
              View and edit user profile information
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-6">
            {/* Photo Upload */}
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="relative group"
              >
                {editPhoto ? (
                  <div className="h-24 w-24 rounded-full overflow-hidden">
                    <img 
                      src={editPhoto} 
                      alt={editName} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-24 w-24 rounded-full bg-accent flex items-center justify-center text-white text-2xl font-semibold">
                    {getInitials(editName)}
                  </div>
                )}
                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-6 w-6 text-white" />
                </div>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <p className="text-sm text-muted-foreground">Click to upload photo</p>
            </div>

            {/* Editable Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profile-name">Name</Label>
                <Input
                  id="profile-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-email">Email Address</Label>
                <Input
                  id="profile-email"
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-role">Role</Label>
                <Select value={editRole} onValueChange={setEditRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.name}>
                        <div className="flex items-center gap-2">
                          <div className={`${role.color} h-2 w-2 rounded-full`} />
                          {role.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Read-only Fields */}
              <div className="pt-4 border-t space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedUser?.status === "Active" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {selectedUser?.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Active</span>
                  <span className="text-sm text-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {selectedUser?.lastActive}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowProfileDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              if (selectedUser) {
                const roleData = roles.find(r => r.name === editRole)
                setUsers(prevUsers => 
                  prevUsers.map(user => 
                    user.id === selectedUser.id 
                      ? { 
                          ...user, 
                          name: editName, 
                          email: editEmail, 
                          role: editRole, 
                          roleColor: roleData?.color || user.roleColor,
                          photo: editPhoto || undefined
                        }
                      : user
                  )
                )
              }
              setShowProfileDialog(false)
            }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
