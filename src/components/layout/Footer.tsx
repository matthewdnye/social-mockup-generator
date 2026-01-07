'use client'

import Link from 'next/link'
import { brand } from '@/lib/branding'
import { LinkedInIcon, ExternalLinkIcon, EmailIcon } from '@/components/icons'

interface NavLink {
  name: string
  href: string
  external?: boolean
}

const platforms: NavLink[] = [
  { name: 'X / Twitter', href: '/create/twitter' },
  { name: 'LinkedIn', href: '/create/linkedin' },
  { name: 'Facebook', href: '/create/facebook' },
  { name: 'Instagram', href: '/create/instagram' },
  { name: 'Threads', href: '/create/threads' },
]

const resources: NavLink[] = [
  { name: 'Vibe Coding Academy', href: 'https://matthewdnye.com/vibe-coding', external: true },
  { name: 'Elite Advisor Tools', href: 'https://eliteadvisortools.com', external: true },
  { name: 'WealthRank SEO', href: 'https://matthewdnye.com/wealthrank-seo', external: true },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className="border-t border-gray-200"
      style={{ backgroundColor: brand.colors.secondary }}
      role="contentinfo"
    >
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: brand.colors.primary }}
              >
                <span
                  className="text-lg font-bold"
                  style={{ color: brand.colors.secondary }}
                >
                  {brand.shortName}
                </span>
              </div>
              <div>
                <div className="text-sm font-semibold text-white">
                  Social Mockup Generator
                </div>
                <div className="text-xs text-gray-400">
                  by {brand.name}
                </div>
              </div>
            </Link>
            <p className="mt-4 max-w-md text-sm text-gray-400">
              Create pixel-perfect social media post mockups for X/Twitter, LinkedIn,
              Facebook, Instagram, and Threads. Perfect for ad creative previews,
              content planning, and presentations.
            </p>
            <p
              className="mt-3 text-xs font-medium"
              style={{ color: brand.colors.primary }}
            >
              {brand.tagline}
            </p>
          </div>

          {/* Platforms Column */}
          <div>
            <h3 id="footer-platforms" className="text-sm font-semibold text-white">
              Platforms
            </h3>
            <ul className="mt-4 space-y-2" role="list" aria-labelledby="footer-platforms">
              {platforms.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 transition-colors"
                    style={{ ['--hover-color' as string]: brand.colors.primary }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = brand.colors.primary)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 id="footer-resources" className="text-sm font-semibold text-white">
              Resources
            </h3>
            <ul className="mt-4 space-y-2" role="list" aria-labelledby="footer-resources">
              {resources.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center gap-1 text-sm text-gray-400 transition-colors"
                    onMouseEnter={(e) => (e.currentTarget.style.color = brand.colors.primary)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                  >
                    {item.name}
                    {item.external && <ExternalLinkIcon />}
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <a
                  href={brand.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium transition-colors"
                  style={{ color: brand.colors.primary }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = brand.colors.primaryHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = brand.colors.primary)}
                >
                  Visit {brand.name}
                  <ExternalLinkIcon />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-gray-500">
              &copy; {currentYear} {brand.name}. All rights reserved.
            </p>
            <nav className="flex items-center gap-4" aria-label="Social links">
              {brand.social.linkedin && (
                <a
                  href={brand.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 transition-colors hover:text-[#0A66C2]"
                  aria-label="Follow on LinkedIn"
                >
                  <LinkedInIcon />
                </a>
              )}
              <a
                href={`mailto:${brand.contact.email}`}
                className="text-gray-500 transition-colors"
                aria-label="Send email"
                onMouseEnter={(e) => (e.currentTarget.style.color = brand.colors.primary)}
                onMouseLeave={(e) => (e.currentTarget.style.color = '')}
              >
                <EmailIcon />
              </a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}
