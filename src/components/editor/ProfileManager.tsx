'use client'

import * as React from 'react'
import { useState, useEffect, useCallback } from 'react'
import {
  useProfileStore,
  type SavedProfile,
  MAX_PROFILES,
  MAX_PROFILE_NAME_LENGTH
} from '@/hooks/useProfileStore'
import { usePostStore } from '@/hooks/usePostStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Avatar component with error handling
function ProfileAvatar({ src, alt }: { src?: string; alt: string }) {
  const [hasError, setHasError] = useState(false)

  // Reset error state when src changes
  useEffect(() => {
    setHasError(false)
  }, [src])

  const showFallback = hasError || !src || src === '/avatars/default.png'

  if (showFallback) {
    return (
      <div
        className="w-5 h-5 rounded-full bg-gray-300 flex-shrink-0"
        aria-label={alt}
      />
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-5 h-5 rounded-full object-cover flex-shrink-0"
      onError={() => setHasError(true)}
    />
  )
}

export function ProfileManager() {
  const [mounted, setMounted] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [profileName, setProfileName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const { profiles, saveProfile, deleteProfile, getProfileCount } = useProfileStore()
  const { author, setAuthor } = usePostStore()

  // Handle hydration mismatch - only render after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Clear error after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [error])

  const handleSelectProfile = useCallback((profileId: string) => {
    const profile = profiles.find((p) => p.id === profileId)
    if (profile) {
      // Deep clone the author to avoid reference issues
      setAuthor(structuredClone(profile.author))
    }
  }, [profiles, setAuthor])

  const handleSaveProfile = useCallback(() => {
    if (!profileName.trim()) return

    const result = saveProfile(profileName.trim(), author)

    if (result.success) {
      setProfileName('')
      setIsCreating(false)
      setError(null)
    } else {
      setError(result.error || 'Failed to save profile')
    }
  }, [profileName, author, saveProfile])

  const handleDeleteProfile = useCallback((e: React.MouseEvent, profileId: string) => {
    e.preventDefault()
    e.stopPropagation()

    // Prevent rapid double-clicks
    if (isDeleting) return

    setIsDeleting(profileId)
    deleteProfile(profileId)

    // Reset deleting state after a short delay
    setTimeout(() => setIsDeleting(null), 300)
  }, [deleteProfile, isDeleting])

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Limit input length
    const value = e.target.value.slice(0, MAX_PROFILE_NAME_LENGTH)
    setProfileName(value)
    setError(null)
  }, [])

  const profileCount = getProfileCount()
  const canAddMore = profileCount < MAX_PROFILES

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="space-y-3">
        <Label className="text-base font-semibold text-gray-900">Saved Profiles</Label>
        <div className="h-10 bg-gray-100 rounded-md animate-pulse" aria-busy="true" />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold text-gray-900">Saved Profiles</Label>
        <span className="text-xs text-gray-500">
          {profileCount}/{MAX_PROFILES}
        </span>
      </div>

      {/* Error message */}
      {error && (
        <div
          className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* Profile selector */}
      <Select onValueChange={handleSelectProfile}>
        <SelectTrigger aria-label="Select a saved profile">
          <SelectValue placeholder="Select a saved profile..." />
        </SelectTrigger>
        <SelectContent>
          {profiles.length === 0 ? (
            <div className="px-2 py-4 text-center text-sm text-gray-500">
              No saved profiles yet
            </div>
          ) : (
            profiles.map((profile) => (
              <SelectItem key={profile.id} value={profile.id}>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <ProfileAvatar
                      src={profile.author.avatar}
                      alt={`${profile.name} avatar`}
                    />
                    <span>{profile.name}</span>
                  </div>
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      {/* Delete buttons shown separately */}
      {profiles.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {profiles.map((profile) => (
            <button
              key={profile.id}
              onClick={(e) => handleDeleteProfile(e, profile.id)}
              disabled={isDeleting === profile.id}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 hover:bg-red-100 hover:text-red-600 rounded transition-colors disabled:opacity-50"
              title={`Delete "${profile.name}"`}
              aria-label={`Delete profile ${profile.name}`}
            >
              <span className="max-w-[80px] truncate">{profile.name}</span>
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ))}
        </div>
      )}

      {/* Save new profile */}
      {isCreating ? (
        <div className="space-y-2">
          <Input
            value={profileName}
            onChange={handleNameChange}
            placeholder="Profile name (e.g., My Brand)"
            maxLength={MAX_PROFILE_NAME_LENGTH}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveProfile()
              if (e.key === 'Escape') {
                setIsCreating(false)
                setProfileName('')
                setError(null)
              }
            }}
            autoFocus
            aria-label="Profile name"
            aria-invalid={!!error}
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleSaveProfile}
              disabled={!profileName.trim()}
            >
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setIsCreating(false)
                setProfileName('')
                setError(null)
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => setIsCreating(true)}
          disabled={!canAddMore}
          title={!canAddMore ? `Maximum ${MAX_PROFILES} profiles reached` : undefined}
        >
          {canAddMore ? 'Save Current as Profile' : `Max ${MAX_PROFILES} Profiles Reached`}
        </Button>
      )}
    </div>
  )
}
