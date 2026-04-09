"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { UserRole } from '@/lib/auth/roles'

interface User {
  id: string
  username: string
  email: string
  role: UserRole
  isActive: boolean
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
const STORAGE_KEY = 'emr-user'

const demoUsers: Record<string, User> = {
  admin: {
    id: 'demo-admin',
    username: 'admin',
    email: 'admin@emr.demo',
    role: UserRole.SYSTEM_ADMIN,
    isActive: true,
  },
  scheduler: {
    id: 'demo-scheduler',
    username: 'scheduler',
    email: 'scheduler@emr.demo',
    role: UserRole.SCHEDULER,
    isActive: true,
  },
  registrar: {
    id: 'demo-registrar',
    username: 'registrar',
    email: 'registrar@emr.demo',
    role: UserRole.REGISTRAR,
    isActive: true,
  },
  nurse: {
    id: 'staff_nurse_1',
    username: 'nurse',
    email: 'nurse@emr.demo',
    role: UserRole.NURSE,
    isActive: true,
  },
  clinician: {
    id: 'staff_doctor_1',
    username: 'clinician',
    email: 'clinician@emr.demo',
    role: UserRole.CLINICIAN,
    isActive: true,
  },
  pharmacist: {
    id: 'demo-pharmacist',
    username: 'pharmacist',
    email: 'pharmacist@emr.demo',
    role: UserRole.PHARMACIST,
    isActive: true,
  },
  labtech: {
    id: 'demo-labtech',
    username: 'labtech',
    email: 'labtech@emr.demo',
    role: UserRole.LAB_TECH,
    isActive: true,
  },
  himcoder: {
    id: 'demo-himcoder',
    username: 'himcoder',
    email: 'himcoder@emr.demo',
    role: UserRole.HIM_CODER,
    isActive: true,
  },
  biller: {
    id: 'demo-biller',
    username: 'biller',
    email: 'biller@emr.demo',
    role: UserRole.BILLER,
    isActive: true,
  },
  patient: {
    id: 'demo-patient',
    username: 'patient',
    email: 'patient@emr.demo',
    role: UserRole.PATIENT,
    isActive: true,
  },
  auditor: {
    id: 'demo-auditor',
    username: 'auditor',
    email: 'auditor@emr.demo',
    role: UserRole.AUDITOR,
    isActive: true,
  },
}

export const DEMO_USERNAMES = Object.keys(demoUsers)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEY)

      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem(STORAGE_KEY)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = async (username: string, _password: string): Promise<boolean> => {
    try {
      const normalizedUsername = username.trim().toLowerCase()
      const demoUser = demoUsers[normalizedUsername]

      if (!demoUser) {
        return false
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoUser))
      setUser(demoUser)
      return true
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  const logout = () => {
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
