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
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { useUsers, type RoleType, availablePermissions } from "@/context/users-context"

// Available colors for new roles
const roleColors = [
  { name: "Lavender", color: "bg-[#b2a0d2]" },
  { name: "Gold", color: "bg-[#f6d06f]" },
  { name: "Green", color: "bg-[#60aa74]" },
  { name: "Charcoal", color: "bg-[#323132]" },
  { name: "Blue", color: "bg-[#6b9bd2]" },
  { name: "Coral", color: "bg-[#e07a5f]" },
  { name: "Teal", color: "bg-[#4a9d9a]" },
  { name: "Pink", color: "bg-[#d4a5a5]" },
]

// Group permissions by category
const permissionsByCategory = availablePermissions.reduce((acc, permission) => {
  if (!acc[permission.category]) {
    acc[permission.category] = []
  }
  acc[permission.category].push(permission)
  return acc
}, {} as Record<string, typeof availablePermissions>)

export default function RolesPage() {
  const { roles, users, getUsersByRole, updateRole, addRole } = useUsers()
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null)
  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editPermissions, setEditPermissions] = useState<string[]>([])
  const [editPermissionSearch, setEditPermissionSearch] = useState("")
  
  // Add role state
  const [newRoleName, setNewRoleName] = useState("")
  const [newRoleDescription, setNewRoleDescription] = useState("")
  const [newRoleColor, setNewRoleColor] = useState(roleColors[4].color)
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([])
  const [newRolePermissions, setNewRolePermissions] = useState<string[]>([])
  const [newPermissionSearch, setNewPermissionSearch] = useState("")
  const [roleSearchQuery, setRoleSearchQuery] = useState("")

  // Filter roles based on search query
  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(roleSearchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(roleSearchQuery.toLowerCase())
  )

  const openEditDialog = (role: RoleType) => {
    setSelectedRole(role)
    setEditName(role.name)
    setEditDescription(role.description)
    setEditPermissions(role.permissions || [])
    setEditPermissionSearch("")
    setShowEditDialog(true)
  }

  const handleSaveRole = () => {
    if (selectedRole) {
      updateRole(selectedRole.id, editName, editDescription, editPermissions)
    }
    setShowEditDialog(false)
  }

  const toggleEditPermission = (permissionId: string) => {
    setEditPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    )
  }

  const toggleNewRolePermission = (permissionId: string) => {
    setNewRolePermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    )
  }

  const selectAllEditPermissions = () => {
    setEditPermissions(availablePermissions.map(p => p.id))
  }

  const deselectAllEditPermissions = () => {
    setEditPermissions([])
  }

  const selectAllNewPermissions = () => {
    setNewRolePermissions(availablePermissions.map(p => p.id))
  }

  const deselectAllNewPermissions = () => {
    setNewRolePermissions([])
  }

  const filterPermissions = (searchTerm: string) => {
    if (!searchTerm.trim()) return permissionsByCategory
    
    const filtered: Record<string, typeof availablePermissions> = {}
    Object.entries(permissionsByCategory).forEach(([category, permissions]) => {
      const matchedPermissions = permissions.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.toLowerCase().includes(searchTerm.toLowerCase())
      )
      if (matchedPermissions.length > 0) {
        filtered[category] = matchedPermissions
      }
    })
    return filtered
  }

  const openAddDialog = () => {
    setNewRoleName("")
    setNewRoleDescription("")
    setNewRoleColor(roleColors[4].color)
    setSelectedUserIds([])
    setNewRolePermissions([])
    setNewPermissionSearch("")
    setShowAddDialog(true)
  }

  const handleAddRole = () => {
    if (newRoleName.trim()) {
      addRole(newRoleName, newRoleDescription, newRoleColor, selectedUserIds, newRolePermissions)
      setShowAddDialog(false)
    }
  }

  const toggleUserSelection = (userId: number) => {
    setSelectedUserIds(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
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
<Button className="gap-2" onClick={openAddDialog}>
                  <Plus className="h-4 w-4" />
                  Add Role
                </Button>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
              placeholder="Search roles..." 
              className="pl-10" 
              value={roleSearchQuery}
              onChange={(e) => setRoleSearchQuery(e.target.value)}
            />
            </div>
          </div>

{/* Roles Grid */}
          {filteredRoles.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No roles found matching "{roleSearchQuery}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRoles.map((role) => (
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
                  <span>{getUsersByRole(role.name).length} users</span>
                </div>
</div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      {/* Edit Role Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
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

            {/* Permissions */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Permissions</Label>
                <div className="flex items-center gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={selectAllEditPermissions}
                  >
                    Select All
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={deselectAllEditPermissions}
                  >
                    Deselect All
                  </Button>
                </div>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search permissions..."
                  value={editPermissionSearch}
                  onChange={(e) => setEditPermissionSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {editPermissions.length} of {availablePermissions.length} permissions selected
              </p>
              <div className="border rounded-lg max-h-64 overflow-y-auto">
                {Object.keys(filterPermissions(editPermissionSearch)).length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No permissions found matching "{editPermissionSearch}"
                  </div>
                ) : (
                  Object.entries(filterPermissions(editPermissionSearch)).map(([category, permissions]) => (
                    <div key={category} className="border-b last:border-b-0">
                      <div className="bg-muted/50 px-4 py-2">
                        <h4 className="text-sm font-medium text-foreground">{category}</h4>
                      </div>
                      <div className="divide-y">
                        {permissions.map(permission => (
                          <div 
                            key={permission.id} 
                            className="flex items-center justify-between px-4 py-3"
                          >
                            <div className="flex-1 min-w-0 pr-4">
                              <p className="text-sm font-medium text-foreground">
                                {permission.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {permission.description}
                              </p>
                            </div>
                            <Switch
                              checked={editPermissions.includes(permission.id)}
                              onCheckedChange={() => toggleEditPermission(permission.id)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Assigned Users */}
            {selectedRole && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Assigned Users</Label>
                  <span className="text-sm text-muted-foreground">
                    {getUsersByRole(selectedRole.name).length} users
                  </span>
                </div>
                <div className="border rounded-lg max-h-48 overflow-y-auto">
                  {getUsersByRole(selectedRole.name).length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No users assigned to this role
                    </div>
                  ) : (
                    <div className="divide-y">
                      {getUsersByRole(selectedRole.name).map(user => (
                        <div key={user.id} className="flex items-center gap-3 p-3">
                          {user.photo ? (
                            <img 
                              src={user.photo} 
                              alt={user.name}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
                              <span className="text-xs font-medium text-white">
                                {getInitials(user.name)}
                              </span>
                            </div>
                          )}
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

      {/* Add Role Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Role</DialogTitle>
            <DialogDescription>
              Create a new role and optionally assign users to it
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-6">
            {/* Role Name */}
            <div className="space-y-2">
              <Label htmlFor="new-role-name">Role Name</Label>
              <Input
                id="new-role-name"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                placeholder="Enter role name"
              />
            </div>

            {/* Role Description */}
            <div className="space-y-2">
              <Label htmlFor="new-role-description">Description</Label>
              <Textarea
                id="new-role-description"
                value={newRoleDescription}
                onChange={(e) => setNewRoleDescription(e.target.value)}
                placeholder="Describe the role's permissions and responsibilities"
                rows={3}
              />
            </div>

            {/* Role Color */}
            <div className="space-y-2">
              <Label>Role Color</Label>
              <div className="flex flex-wrap gap-2">
                {roleColors.map((rc) => (
                  <button
                    key={rc.color}
                    type="button"
                    onClick={() => setNewRoleColor(rc.color)}
                    className={`h-8 w-8 rounded-full ${rc.color} transition-all ${
                      newRoleColor === rc.color
                        ? "ring-2 ring-offset-2 ring-accent"
                        : "hover:scale-110"
                    }`}
                    title={rc.name}
                  />
                ))}
              </div>
            </div>

            {/* Permissions */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Permissions</Label>
                <div className="flex items-center gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={selectAllNewPermissions}
                  >
                    Select All
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={deselectAllNewPermissions}
                  >
                    Deselect All
                  </Button>
                </div>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search permissions..."
                  value={newPermissionSearch}
                  onChange={(e) => setNewPermissionSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {newRolePermissions.length} of {availablePermissions.length} permissions selected
              </p>
              <div className="border rounded-lg max-h-64 overflow-y-auto">
                {Object.keys(filterPermissions(newPermissionSearch)).length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No permissions found matching "{newPermissionSearch}"
                  </div>
                ) : (
                  Object.entries(filterPermissions(newPermissionSearch)).map(([category, permissions]) => (
                    <div key={category} className="border-b last:border-b-0">
                      <div className="bg-muted/50 px-4 py-2">
                        <h4 className="text-sm font-medium text-foreground">{category}</h4>
                      </div>
                      <div className="divide-y">
                        {permissions.map(permission => (
                          <div 
                            key={permission.id} 
                            className="flex items-center justify-between px-4 py-3"
                          >
                            <div className="flex-1 min-w-0 pr-4">
                              <p className="text-sm font-medium text-foreground">
                                {permission.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {permission.description}
                              </p>
                            </div>
                            <Switch
                              checked={newRolePermissions.includes(permission.id)}
                              onCheckedChange={() => toggleNewRolePermission(permission.id)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Assign Users */}
            <div className="space-y-3">
              <Label>Assign Users (Optional)</Label>
              <div className="border rounded-lg max-h-48 overflow-y-auto">
                {users.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No users available
                  </div>
                ) : (
                  <div className="divide-y">
                    {users.map(user => (
                      <div 
                        key={user.id} 
                        className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer"
                        onClick={() => toggleUserSelection(user.id)}
                      >
                        <Checkbox 
                          checked={selectedUserIds.includes(user.id)}
                          onCheckedChange={() => toggleUserSelection(user.id)}
                        />
                        {user.photo ? (
                          <img 
                            src={user.photo} 
                            alt={user.name}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
                            <span className="text-xs font-medium text-white">
                              {getInitials(user.name)}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Current: {user.role}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {selectedUserIds.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {selectedUserIds.length} user(s) will be assigned to this role
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRole} disabled={!newRoleName.trim()}>
              Create Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
