'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { brand } from '@/lib/branding'

interface EditorLayoutProps {
  children: React.ReactNode
  title: string
  description: string
  actions?: React.ReactNode
}

export function EditorLayout({
  children,
  title,
  description,
  actions,
}: EditorLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header with MDN branding */}
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-sm px-4 py-3">
        <div className="mx-auto max-w-7xl">
          {/* Top row: Logo and actions */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 group"
            >
              <div className="relative h-8 w-8 flex-shrink-0">
                <Image
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  width={32}
                  height={32}
                  className="rounded-lg object-contain"
                />
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-1 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 transition-colors">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Back</span>
              </span>
            </Link>
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
      </header>

      {/* Main Content */}
      {children}
    </div>
  )
}
