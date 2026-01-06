'use client'

import * as React from 'react'
import { usePostStore } from '@/hooks/usePostStore'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { Theme } from '@/lib/types'

const themes: { value: Theme; label: string; preview: string }[] = [
  { value: 'light', label: 'Light', preview: 'bg-white border-gray-200' },
  { value: 'dark', label: 'Dark', preview: 'bg-black border-gray-800' },
  { value: 'dim', label: 'Dim', preview: 'bg-[#15202b] border-gray-700' },
]

export function ThemeSelector() {
  const { theme, setTheme } = usePostStore()

  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">Theme</Label>
      <div className="flex gap-2">
        {themes.map((t) => (
          <button
            key={t.value}
            onClick={() => setTheme(t.value)}
            className={cn(
              'flex-1 rounded-lg border-2 p-3 transition-all',
              theme === t.value
                ? 'border-blue-500 ring-2 ring-blue-500/20'
                : 'border-gray-200 hover:border-gray-300'
            )}
          >
            <div
              className={cn(
                'mb-2 h-8 rounded border',
                t.preview
              )}
            />
            <span className="text-sm font-medium">{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
