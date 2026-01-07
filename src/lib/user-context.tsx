'use client'

import * as React from 'react'

interface UserInfo {
  firstName: string
  lastName: string
  email: string
  capturedAt: string
}

interface UserContextType {
  user: UserInfo | null
  isLoading: boolean
  captureUser: (info: Omit<UserInfo, 'capturedAt'>) => Promise<void>
  hasValidUser: boolean
}

const UserContext = React.createContext<UserContextType | undefined>(undefined)

const STORAGE_KEY = 'smg_user_info'

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<UserInfo | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  // Load user from localStorage on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as UserInfo
        // Validate the stored data has required fields
        if (parsed.firstName && parsed.lastName && parsed.email) {
          setUser(parsed)
        }
      }
    } catch {
      // Invalid stored data, clear it
      localStorage.removeItem(STORAGE_KEY)
    }
    setIsLoading(false)
  }, [])

  const captureUser = async (info: Omit<UserInfo, 'capturedAt'>) => {
    const userInfo: UserInfo = {
      ...info,
      capturedAt: new Date().toISOString(),
    }

    // Save to localStorage first (optimistic)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userInfo))
    setUser(userInfo)

    // Send to HighLevel API
    try {
      const response = await fetch('/api/capture-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userInfo),
      })

      if (!response.ok) {
        console.error('Failed to submit to CRM:', await response.text())
      }
    } catch (error) {
      console.error('Error submitting to CRM:', error)
    }
  }

  const hasValidUser = Boolean(user?.email && user?.firstName && user?.lastName)

  return (
    <UserContext.Provider value={{ user, isLoading, captureUser, hasValidUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = React.useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
