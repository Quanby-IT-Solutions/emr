"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { UserRole } from '@/lib/auth/roles'

interface User {
  id: string
  username: string
  email: string
  role: UserRole
  isActive: boolean
  staffId?: string
  staffFirstName?: string
  staffLastName?: string
  staffJobTitle?: string
  staffDepartment?: string
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
const STORAGE_KEY = 'emr-user'

export const DEMO_USERNAMES = [
  'admin', 'scheduler', 'registrar', 'nurse', 'clinician',
  'pharmacist', 'labtech', 'himcoder', 'biller', 'patient', 'auditor',
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (json?.data) {
          setUser(json.data)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(json.data))
        } else {
          localStorage.removeItem(STORAGE_KEY)
        }
      })
      .catch(() => {
        try {
          const stored = localStorage.getItem(STORAGE_KEY)
          if (stored) setUser(JSON.parse(stored))
        } catch {}
      })
      .finally(() => setIsLoading(false))
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim().toLowerCase(), password }),
      })
      if (!res.ok) return false
      const json = await res.json()
      if (!json?.data) return false
      localStorage.setItem(STORAGE_KEY, JSON.stringify(json.data))
      setUser(json.data)
      return true
    } catch {
      return false
    }
  }

  const logout = () => {
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
