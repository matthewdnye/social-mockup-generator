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

  // Get current mockup state from store
  const store = usePostStore()

  const performExport = React.useCallback(async (scale: 1 | 2 | 3, suffix: string) => {
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
        downloadImage(blob, `${filename}-${suffix}.png`)
      }
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }, [store, filename])

  const handleExport = async (scale: 1 | 2 | 3, suffix: string) => {
    if (!hasValidUser) {
      setPendingScale({ scale, suffix })
      setShowModal(true)
      return
    }
    await performExport(scale, suffix)
  }

  const handleModalSuccess = async () => {
    setShowModal(false)
    if (pendingScale) {
      const { scale, suffix } = pendingScale
      setPendingScale(null)
      await performExport(scale, suffix)
    }
  }

  return (
    <>
      <div className="flex gap-2">
        <Button
          onClick={() => handleExport(1, '1x')}
          disabled={isExporting || isLoading}
          variant="outline"
          size="sm"
        >
          1x
        </Button>
        <Button
          onClick={() => handleExport(2, '2x')}
          disabled={isExporting || isLoading}
          variant="default"
          size="sm"
          className="gap-2"
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          2x (Recommended)
        </Button>
        <Button
          onClick={() => handleExport(3, '3x')}
          disabled={isExporting || isLoading}
          variant="outline"
          size="sm"
        >
          3x
        </Button>
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
