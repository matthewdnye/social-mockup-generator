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
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            {/* MDN Logo/Back button */}
            <Link
              href="/"
              className="flex items-center gap-3 group"
            >
              <div className="relative h-9 w-9">
                <Image
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  width={36}
                  height={36}
                  className="rounded-lg object-contain"
                />
              </div>
              <span className="inline-flex items-center gap-2 -ml-2 px-3 py-1.5 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 transition-colors">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back
              </span>
            </Link>
            <div className="border-l pl-4 border-gray-200">
              <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </div>
          {actions && (
            <div className="flex items-center gap-3">
              {actions}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      {children}
    </div>
  )
}
