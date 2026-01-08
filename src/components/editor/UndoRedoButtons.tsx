'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Undo2, Redo2 } from 'lucide-react'
import { useUndoRedo } from '@/hooks/useUndoRedo'

export function UndoRedoButtons() {
  const { undo, redo, canUndo, canRedo } = useUndoRedo()

  // Keyboard shortcuts for undo/redo
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Use userAgentData with fallback to userAgent (navigator.platform is deprecated)
      const isMac =
        // @ts-expect-error - userAgentData not in all TS types yet
        navigator.userAgentData?.platform === 'macOS' ||
        /Mac|iPhone|iPad|iPod/.test(navigator.userAgent)
      const modifier = isMac ? e.metaKey : e.ctrlKey

      if (modifier && e.key === 'z') {
        if (e.shiftKey) {
          e.preventDefault()
          if (canRedo) redo()
        } else {
          e.preventDefault()
          if (canUndo) undo()
        }
      }

      // Ctrl+Y for redo (Windows/Linux alternative)
      if (!isMac && e.ctrlKey && e.key === 'y') {
        e.preventDefault()
        if (canRedo) redo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo, canUndo, canRedo])

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="sm"
        onClick={undo}
        disabled={!canUndo}
        className="h-8 w-8 p-0"
        aria-label="Undo (Ctrl+Z)"
        title="Undo (Ctrl+Z)"
      >
        <Undo2 className="h-4 w-4" aria-hidden="true" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={redo}
        disabled={!canRedo}
        className="h-8 w-8 p-0"
        aria-label="Redo (Ctrl+Shift+Z)"
        title="Redo (Ctrl+Shift+Z)"
      >
        <Redo2 className="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  )
}
