"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export type UserType = {
  id: number
  name: string
  email: string
  role: string
  roleColor: string
  lastActive: string
  status: string
  photo?: string
}

export type RoleType = {
  id: number
  name: string
  description: string
  color: string
}

type UsersContextType = {
  users: UserType[]
  setUsers: React.Dispatch<React.SetStateAction<UserType[]>>
  roles: RoleType[]
  setRoles: React.Dispatch<React.SetStateAction<RoleType[]>>
  getUsersByRole: (roleName: string) => UserType[]
  getRoleColor: (roleName: string) => string
  updateRole: (roleId: number, newName: string, newDescription: string) => void
  addRole: (name: string, description: string, color: string, assignedUserIds: number[]) => void
}

const initialRoles: RoleType[] = [
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

const initialUsers: UserType[] = [
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
]

const UsersContext = createContext<UsersContextType | undefined>(undefined)

export function UsersProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<UserType[]>(initialUsers)
  const [roles, setRoles] = useState<RoleType[]>(initialRoles)

  const getUsersByRole = (roleName: string) => {
    return users.filter(user => user.role === roleName)
  }

  const getRoleColor = (roleName: string) => {
    const role = roles.find(r => r.name === roleName)
    return role?.color || "bg-gray-500"
  }

  const updateRole = (roleId: number, newName: string, newDescription: string) => {
    // Find the old role name
    const oldRole = roles.find(r => r.id === roleId)
    if (!oldRole) return

    const oldName = oldRole.name

    // Update the role
    setRoles(prevRoles =>
      prevRoles.map(role =>
        role.id === roleId
          ? { ...role, name: newName, description: newDescription }
          : role
      )
    )

    // Update all users who had the old role name
    if (oldName !== newName) {
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.role === oldName
            ? { ...user, role: newName }
            : user
        )
      )
    }
  }

  const addRole = (name: string, description: string, color: string, assignedUserIds: number[]) => {
    // Generate a new ID
    const newId = Math.max(...roles.map(r => r.id), 0) + 1
    
    // Add the new role
    const newRole: RoleType = {
      id: newId,
      name,
      description,
      color,
    }
    setRoles(prevRoles => [...prevRoles, newRole])
    
    // Assign selected users to the new role
    if (assignedUserIds.length > 0) {
      setUsers(prevUsers =>
        prevUsers.map(user =>
          assignedUserIds.includes(user.id)
            ? { ...user, role: name, roleColor: color }
            : user
        )
      )
    }
  }

  return (
    <UsersContext.Provider value={{ users, setUsers, roles, setRoles, getUsersByRole, getRoleColor, updateRole, addRole }}>
      {children}
    </UsersContext.Provider>
  )
}

export function useUsers() {
  const context = useContext(UsersContext)
  if (context === undefined) {
    throw new Error("useUsers must be used within a UsersProvider")
  }
  return context
}
