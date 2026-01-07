'use client'

import Link from 'next/link'
import Image from 'next/image'
import { brand } from '@/lib/branding'
import { LinkedInIcon, PlusIcon } from '@/components/icons'

interface HeaderProps {
  variant?: 'default' | 'minimal'
}

export function Header({ variant = 'default' }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* MDN Logo */}
            <div className="relative h-10 w-10 transition-transform group-hover:scale-105">
              <Image
                src={brand.logo}
                alt={`${brand.name} logo`}
                width={40}
                height={40}
                className="rounded-lg object-contain"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-semibold text-gray-900">
                Social Mockup Generator
              </div>
              <div className="text-xs text-gray-500">
                by {brand.name}
              </div>
            </div>
          </Link>

          {/* Navigation - Only show on default variant */}
          {variant === 'default' && (
            <nav className="hidden md:flex items-center gap-6" role="navigation" aria-label="Main navigation">
              <Link
                href="/"
                className="text-sm font-medium text-gray-600 transition-colors"
                style={{ ['--hover-color' as string]: brand.colors.primary }}
                onMouseEnter={(e) => (e.currentTarget.style.color = brand.colors.primary)}
                onMouseLeave={(e) => (e.currentTarget.style.color = '')}
              >
                Platforms
              </Link>
              <a
                href={brand.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-gray-600 transition-colors"
                onMouseEnter={(e) => (e.currentTarget.style.color = brand.colors.primary)}
                onMouseLeave={(e) => (e.currentTarget.style.color = '')}
              >
                About
              </a>
              {brand.social.linkedin && (
                <a
                  href={brand.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#0A66C2] transition-colors"
                  aria-label="Follow on LinkedIn"
                >
                  <LinkedInIcon />
                </a>
              )}
            </nav>
          )}

          {/* CTA Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
            style={{
              backgroundColor: brand.colors.primary,
              color: brand.colors.secondary,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = brand.colors.primaryHover)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = brand.colors.primary)}
          >
            <PlusIcon />
            <span className="hidden sm:inline">Create Mockup</span>
            <span className="sm:hidden">Create</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
