'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'
import type { PostAuthor } from '@/lib/types'

// Constants for profile limits
const MAX_PROFILES = 20
const MAX_PROFILE_NAME_LENGTH = 50
const STORAGE_KEY = 'social-mockup-profiles'

export interface SavedProfile {
  id: string
  name: string
  author: PostAuthor
  createdAt: number
}

interface ProfileStore {
  profiles: SavedProfile[]
  saveProfile: (name: string, author: PostAuthor) => { success: boolean; error?: string }
  deleteProfile: (id: string) => void
  getProfileCount: () => number
}

// Sanitize profile name to prevent XSS
function sanitizeProfileName(name: string): string {
  return name
    .trim()
    .slice(0, MAX_PROFILE_NAME_LENGTH)
    .replace(/[<>'"&]/g, '') // Remove potential XSS characters
}

// Deep clone author to avoid reference issues with nested objects
function cloneAuthor(author: PostAuthor): PostAuthor {
  // structuredClone handles nested objects properly
  return structuredClone(author)
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      profiles: [],

      saveProfile: (name, author) => {
        const sanitizedName = sanitizeProfileName(name)

        // Validation checks
        if (!sanitizedName) {
          return { success: false, error: 'Profile name is required' }
        }

        const currentProfiles = get().profiles

        // Check profile limit
        if (currentProfiles.length >= MAX_PROFILES) {
          return {
            success: false,
            error: `Maximum ${MAX_PROFILES} profiles allowed. Delete some to add more.`
          }
        }

        // Check for duplicate names
        if (currentProfiles.some(p => p.name.toLowerCase() === sanitizedName.toLowerCase())) {
          return { success: false, error: 'A profile with this name already exists' }
        }

        try {
          set((state) => ({
            profiles: [
              ...state.profiles,
              {
                id: nanoid(),
                name: sanitizedName,
                author: cloneAuthor(author),
                createdAt: Date.now(),
              },
            ],
          }))
          return { success: true }
        } catch (error) {
          // Handle localStorage quota exceeded or other errors
          console.error('Failed to save profile:', error)
          return {
            success: false,
            error: 'Failed to save profile. Storage may be full.'
          }
        }
      },

      deleteProfile: (id) =>
        set((state) => ({
          profiles: state.profiles.filter((p) => p.id !== id),
        })),

      getProfileCount: () => get().profiles.length,
    }),
    {
      name: STORAGE_KEY,
      // Add error handling for localStorage operations
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Failed to load profiles from storage:', error)
        }
      },
    }
  )
)

// Export constants for use in UI
export { MAX_PROFILES, MAX_PROFILE_NAME_LENGTH }
