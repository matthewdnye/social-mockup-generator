'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { exportToImage, downloadImage } from '@/lib/export'
import { Download, Loader2 } from 'lucide-react'

interface ExportButtonProps {
  targetRef: React.RefObject<HTMLElement | null>
  filename?: string
  scale?: number
}

export function ExportButton({
  targetRef,
  filename = 'social-mockup',
  scale = 2,
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = React.useState(false)

  const handleExport = async () => {
    if (!targetRef.current) return

    setIsExporting(true)
    try {
      const blob = await exportToImage(targetRef.current, { scale })
      if (blob) {
        downloadImage(blob, `${filename}.png`)
      }
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting}
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
  )
}

interface ExportOptionsProps {
  targetRef: React.RefObject<HTMLElement | null>
  filename?: string
}

export function ExportOptions({ targetRef, filename = 'social-mockup' }: ExportOptionsProps) {
  const [isExporting, setIsExporting] = React.useState(false)

  const handleExport = async (scale: number, suffix: string) => {
    if (!targetRef.current) return

    setIsExporting(true)
    try {
      const blob = await exportToImage(targetRef.current, { scale })
      if (blob) {
        downloadImage(blob, `${filename}-${suffix}.png`)
      }
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        onClick={() => handleExport(1, '1x')}
        disabled={isExporting}
        variant="outline"
        size="sm"
      >
        1x
      </Button>
      <Button
        onClick={() => handleExport(2, '2x')}
        disabled={isExporting}
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
        disabled={isExporting}
        variant="outline"
        size="sm"
      >
        3x
      </Button>
    </div>
  )
}
