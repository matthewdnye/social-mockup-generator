'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { exportViaPlaywright, downloadImage } from '@/lib/export'
import { serializeMockupState } from '@/lib/mockup-serializer'
import { useUser } from '@/lib/user-context'
import { usePostStore } from '@/hooks/usePostStore'
import { EmailCaptureModal } from './EmailCaptureModal'
import { Download, Loader2 } from 'lucide-react'

interface ExportButtonProps {
  targetRef: React.RefObject<HTMLElement | null>
  filename?: string
  scale?: 1 | 2 | 3
}

export function ExportButton({
  targetRef,
  filename = 'social-mockup',
  scale = 2,
}: ExportButtonProps) {
  const { hasValidUser, isLoading } = useUser()
  const [isExporting, setIsExporting] = React.useState(false)
  const [showModal, setShowModal] = React.useState(false)
  const [pendingExport, setPendingExport] = React.useState(false)

  // Get current mockup state from store
  const store = usePostStore()

  const performExport = React.useCallback(async () => {
    setIsExporting(true)
    try {
      // Serialize the current store state
      const mockupState = serializeMockupState({
        platform: store.platform,
        theme: store.theme,
        author: store.author,
        content: store.content,
        timestamp: store.timestamp,
        metrics: store.metrics,
        images: store.images,
        client: store.client,
        privacy: store.privacy,
      })

      const blob = await exportViaPlaywright(mockupState, { scale })
      if (blob) {
        downloadImage(blob, `${filename}.png`)
      }
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }, [store, filename, scale])

  const handleExport = async () => {
    if (!hasValidUser) {
      setPendingExport(true)
      setShowModal(true)
      return
    }
    await performExport()
  }

  const handleModalSuccess = async () => {
    setShowModal(false)
    if (pendingExport) {
      setPendingExport(false)
      await performExport()
    }
  }

  return (
    <>
      <Button
        onClick={handleExport}
        disabled={isExporting || isLoading}
        className="gap-2"
      >
        {isExporting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Exporting...
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            Download PNG
          </>
        )}
      </Button>

      <EmailCaptureModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setPendingExport(false)
        }}
        onSuccess={handleModalSuccess}
      />
    </>
  )
}

interface ExportOptionsProps {
  targetRef: React.RefObject<HTMLElement | null>
  filename?: string
}

export function ExportOptions({ targetRef, filename = 'social-mockup' }: ExportOptionsProps) {
  const { hasValidUser, isLoading } = useUser()
  const [isExporting, setIsExporting] = React.useState(false)
  const [showModal, setShowModal] = React.useState(false)
  const [pendingScale, setPendingScale] = React.useState<{ scale: 1 | 2 | 3; suffix: string } | null>(null)
  const [showDropdown, setShowDropdown] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  // Get current mockup state from store
  const store = usePostStore()

  const performExport = React.useCallback(async (scale: 1 | 2 | 3, suffix: string) => {
    setIsExporting(true)
    setShowDropdown(false)
    try {
      // Serialize the current store state
      const mockupState = serializeMockupState({
        platform: store.platform,
        theme: store.theme,
        author: store.author,
        content: store.content,
        timestamp: store.timestamp,
        metrics: store.metrics,
        images: store.images,
        client: store.client,
        privacy: store.privacy,
      })

      const blob = await exportViaPlaywright(mockupState, { scale })
      if (blob) {
        downloadImage(blob, `${filename}-${suffix}.png`)
      }
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }, [store, filename])

  const handleExport = React.useCallback(async (scale: 1 | 2 | 3, suffix: string) => {
    if (!hasValidUser) {
      setPendingScale({ scale, suffix })
      setShowModal(true)
      return
    }
    await performExport(scale, suffix)
  }, [hasValidUser, performExport])

  const handleModalSuccess = async () => {
    setShowModal(false)
    if (pendingScale) {
      const { scale, suffix } = pendingScale
      setPendingScale(null)
      await performExport(scale, suffix)
    }
  }

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard shortcut for quick export (Cmd/Ctrl + S)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        if (!isExporting && !isLoading) {
          handleExport(2, '2x')
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isExporting, isLoading, handleExport])

  return (
    <>
      {/* Desktop: Show all buttons */}
      <div className="hidden sm:flex gap-2">
        <Button
          onClick={() => handleExport(1, '1x')}
          disabled={isExporting || isLoading}
          variant="outline"
          size="sm"
          aria-label="Export at 1x resolution"
        >
          1x
        </Button>
        <Button
          onClick={() => handleExport(2, '2x')}
          disabled={isExporting || isLoading}
          variant="default"
          size="sm"
          className="gap-2"
          aria-label="Export at 2x resolution (recommended)"
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Download className="h-4 w-4" aria-hidden="true" />
          )}
          2x
        </Button>
        <Button
          onClick={() => handleExport(3, '3x')}
          disabled={isExporting || isLoading}
          variant="outline"
          size="sm"
          aria-label="Export at 3x resolution"
        >
          3x
        </Button>
      </div>

      {/* Mobile: Consolidated dropdown */}
      <div className="sm:hidden relative" ref={dropdownRef}>
        <Button
          onClick={() => setShowDropdown(!showDropdown)}
          disabled={isExporting || isLoading}
          variant="default"
          size="sm"
          className="gap-2"
          aria-label="Export options"
          aria-expanded={showDropdown}
          aria-haspopup="true"
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Download className="h-4 w-4" aria-hidden="true" />
          )}
          Export
        </Button>
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
            <button
              onClick={() => handleExport(1, '1x')}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
            >
              1x - Standard
            </button>
            <button
              onClick={() => handleExport(2, '2x')}
              className="w-full px-4 py-2 text-left text-sm font-medium text-[#D9B01C] hover:bg-gray-100 transition-colors"
            >
              2x - Recommended
            </button>
            <button
              onClick={() => handleExport(3, '3x')}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
            >
              3x - High Quality
            </button>
          </div>
        )}
      </div>

      <EmailCaptureModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setPendingScale(null)
        }}
        onSuccess={handleModalSuccess}
      />
    </>
  )
}
