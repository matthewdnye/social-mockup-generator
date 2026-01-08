'use client'

import * as React from 'react'
import { useEffect, useState, useRef, useCallback } from 'react'

interface ScalableMockupWrapperProps {
  children: React.ReactNode
  mockupWidth: number // The fixed width of the mockup (e.g., 598 for Twitter)
  className?: string
}

/**
 * A wrapper component that scales its children to fit the viewport on mobile devices
 * while maintaining the exact pixel dimensions needed for screenshot export.
 *
 * On desktop (viewport >= mockupWidth + padding), renders at full size.
 * On mobile (viewport < mockupWidth + padding), scales down proportionally.
 */
export function ScalableMockupWrapper({
  children,
  mockupWidth,
  className = '',
}: ScalableMockupWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [containerWidth, setContainerWidth] = useState<number | null>(null)

  const calculateScale = useCallback(() => {
    if (!containerRef.current) return

    const parentWidth = containerRef.current.parentElement?.clientWidth || window.innerWidth
    // Account for padding (32px on each side on mobile, 64px on desktop)
    const availableWidth = parentWidth - 32

    if (availableWidth < mockupWidth) {
      // Scale down to fit
      const newScale = Math.max(0.5, availableWidth / mockupWidth)
      setScale(newScale)
      setContainerWidth(availableWidth)
    } else {
      // Full size
      setScale(1)
      setContainerWidth(null)
    }
  }, [mockupWidth])

  useEffect(() => {
    // Initial calculation
    calculateScale()

    // Use ResizeObserver for efficient resize handling
    const resizeObserver = new ResizeObserver(() => {
      calculateScale()
    })

    // Observe parent element for size changes
    const parent = containerRef.current?.parentElement
    if (parent) {
      resizeObserver.observe(parent)
    }

    // Fallback to window resize for edge cases
    window.addEventListener('resize', calculateScale)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', calculateScale)
    }
  }, [calculateScale])

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{
        width: containerWidth || 'auto',
        height: scale < 1 ? `calc(${scale} * 100%)` : 'auto',
        overflow: 'visible',
      }}
    >
      <div
        style={{
          transform: scale < 1 ? `scale(${scale})` : 'none',
          transformOrigin: 'top left',
          width: mockupWidth,
        }}
      >
        {children}
      </div>
    </div>
  )
}
