'use client'

import Link from 'next/link'
import Image from 'next/image'
import { brand } from '@/lib/branding'

interface HeaderProps {
  variant?: 'default' | 'minimal'
}

export function Header({ variant = 'default' }: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-50"
      style={{ backgroundColor: brand.colors.secondary }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src={brand.logo}
              alt={`${brand.name} logo`}
              width={160}
              height={40}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* Navigation - Only show on default variant */}
          {variant === 'default' && (
            <nav
              className="hidden md:flex items-center gap-8"
              role="navigation"
              aria-label="Main navigation"
            >
              <Link
                href="/"
                className="text-sm font-medium text-white transition-colors hover:opacity-80"
              >
                Platforms
              </Link>
              <a
                href={brand.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-white transition-colors hover:opacity-80"
              >
                About
              </a>
              <a
                href={brand.social.linkedin || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-white transition-colors hover:opacity-80"
              >
                LinkedIn
              </a>
            </nav>
          )}

          {/* CTA Button */}
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all hover:opacity-90"
            style={{
              backgroundColor: brand.colors.primary,
              color: brand.colors.secondary,
            }}
          >
            Create Mockup
          </Link>
        </div>
      </div>
    </header>
  )
}
