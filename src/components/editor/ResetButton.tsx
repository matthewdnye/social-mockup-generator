'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/dialog'
import { RotateCcw } from 'lucide-react'

/**
 * Shared reset button component for editor pages.
 * Dynamically imports the store to avoid SSR issues with Zustand.
 * Includes confirmation dialog to prevent accidental resets.
 */
export function ResetButton() {
  const [mounted, setMounted] = React.useState(false)
  const [showConfirm, setShowConfirm] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleReset = React.useCallback(async () => {
    if (mounted) {
      const { usePostStore } = await import('@/hooks/usePostStore')
      usePostStore.getState().reset()
    }
  }, [mounted])

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowConfirm(true)}
        className="gap-2"
        aria-label="Reset all fields"
      >
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        Reset
      </Button>
      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Reset all fields?"
        description="This will clear all your changes and restore default values. This action cannot be undone."
        confirmLabel="Reset"
        cancelLabel="Cancel"
        onConfirm={handleReset}
        variant="destructive"
      />
    </>
  )
}
