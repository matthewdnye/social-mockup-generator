'use client'

import { Header } from './Header'
import { Footer } from './Footer'

interface PageWrapperProps {
  children: React.ReactNode
  /** Whether to show the header - defaults to true */
  showHeader?: boolean
  /** Whether to show the footer - defaults to true */
  showFooter?: boolean
  /** Header variant - 'default' shows full nav, 'minimal' shows just logo */
  headerVariant?: 'default' | 'minimal'
  /** Background style - 'gradient' for homepage, 'solid' for inner pages */
  background?: 'gradient' | 'solid' | 'transparent'
  /** Max width constraint for main content */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full'
  /** Whether to add default padding to main content */
  padded?: boolean
  /** Custom className for main element */
  className?: string
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
} as const

const backgroundClasses = {
  gradient: 'bg-gradient-to-br from-gray-50 via-white to-gray-100',
  solid: 'bg-gray-50',
  transparent: 'bg-transparent',
} as const

export function PageWrapper({
  children,
  showHeader = true,
  showFooter = true,
  headerVariant = 'default',
  background = 'solid',
  maxWidth = '7xl',
  padded = true,
  className = '',
}: PageWrapperProps) {
  return (
    <div className={`flex min-h-screen flex-col ${backgroundClasses[background]}`}>
      {showHeader && <Header variant={headerVariant} />}

      <main
        className={`
          flex-1
          ${padded ? 'px-4 py-8 sm:px-6 lg:px-8' : ''}
          ${className}
        `}
      >
        <div className={`mx-auto ${maxWidthClasses[maxWidth]}`}>
          {children}
        </div>
      </main>

      {showFooter && <Footer />}
    </div>
  )
}

export default PageWrapper
