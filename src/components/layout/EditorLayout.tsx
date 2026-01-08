'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Header } from './Header'
import { Footer } from './Footer'
import { PlatformSwitcher } from '@/components/editor/PlatformSwitcher'
import type { Platform } from '@/lib/types'

interface EditorLayoutProps {
  children: React.ReactNode
  title: string
  description: string
  actions?: React.ReactNode
  platform?: Platform
}

export function EditorLayout({
  children,
  title,
  description,
  actions,
  platform,
}: EditorLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Branded Header */}
      <Header variant="default" />

      {/* Editor Sub-header with title, description, and actions */}
      <div className="border-b bg-white px-4 py-3">
        <div className="mx-auto max-w-7xl">
          {/* Top row: Back link, platform switcher and actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1 px-2 py-1 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Back to Platforms"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Back</span>
              </Link>
              {platform && (
                <div className="border-l border-gray-200 pl-2">
                  <PlatformSwitcher currentPlatform={platform} />
                </div>
              )}
            </div>
            {/* Title - hidden on mobile, show on sm+ */}
            <div className="hidden sm:block border-l pl-4 border-gray-200 flex-1 mx-4">
              <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
            {/* Actions */}
            {actions && (
              <div className="flex items-center gap-2 flex-wrap justify-end">
                {actions}
              </div>
            )}
          </div>
          {/* Mobile title row */}
          <div className="sm:hidden mt-2 pt-2 border-t border-gray-100">
            <h1 className="text-base font-semibold text-gray-900">{title}</h1>
            <p className="text-xs text-gray-600">{description}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>

      {/* Branded Footer */}
      <Footer />
    </div>
  )
}
