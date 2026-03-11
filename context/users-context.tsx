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

type UsersContextType = {
  users: UserType[]
  setUsers: React.Dispatch<React.SetStateAction<UserType[]>>
  getUsersByRole: (roleName: string) => UserType[]
  getRoleColor: (roleName: string) => string
}

const roleColors: Record<string, string> = {
  "Administrator": "bg-[#b2a0d2]",
  "Data Analyst": "bg-[#f6d06f]",
  "Editor": "bg-[#60aa74]",
  "Viewer": "bg-[#323132]",
}

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

  const getUsersByRole = (roleName: string) => {
    return users.filter(user => user.role === roleName)
  }

  const getRoleColor = (roleName: string) => {
    return roleColors[roleName] || "bg-gray-500"
  }

  return (
    <UsersContext.Provider value={{ users, setUsers, getUsersByRole, getRoleColor }}>
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
