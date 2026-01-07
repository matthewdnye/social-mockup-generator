'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { RotateCcw } from 'lucide-react'

/**
 * Shared reset button component for editor pages.
 * Dynamically imports the store to avoid SSR issues with Zustand.
 */
export function ResetButton() {
  const [mounted, setMounted] = React.useState(false)

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
    <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
      <RotateCcw className="h-4 w-4" aria-hidden="true" />
      Reset
    </Button>
  )
}
