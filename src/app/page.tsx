'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

const platforms = [
  {
    id: 'twitter',
    name: 'X / Twitter',
    description: 'Create realistic X/Twitter post screenshots',
    icon: (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    color: 'bg-black hover:bg-gray-800',
    available: true,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Generate LinkedIn post mockups',
    icon: (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
        <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
      </svg>
    ),
    color: 'bg-[#0A66C2] hover:bg-[#004182]',
    available: true,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    description: 'Create Facebook post screenshots',
    icon: (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    color: 'bg-[#1877F2] hover:bg-[#0b5ed7]',
    available: true,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'Generate Instagram post mockups',
    icon: (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
    color: 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] hover:opacity-90',
    available: true,
  },
  {
    id: 'threads',
    name: 'Threads',
    description: 'Create Threads post screenshots',
    icon: (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
        <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.59 12c.025 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.182.408-2.256 1.33-3.022.88-.73 2.102-1.138 3.446-1.151.95-.01 1.83.109 2.637.357.032-.723.005-1.39-.082-2.004-.205-1.452-.788-2.162-1.716-2.336-.576-.108-1.104-.004-1.568.31-.418.284-.695.736-.778 1.272l-2.027-.426c.215-1.122.8-2.023 1.692-2.605.992-.647 2.208-.9 3.52-.733 2.092.266 3.39 1.622 3.753 3.918.127.803.17 1.7.127 2.69.486.29.933.63 1.332 1.02 1.063 1.04 1.666 2.357 1.743 3.81.082 1.548-.339 2.97-1.255 4.237-1.072 1.484-2.665 2.5-4.74 3.02-1.166.293-2.434.44-3.778.44zm.193-8.234c-.86.008-1.593.202-2.12.562-.46.314-.667.7-.638 1.18.03.562.308 1.005.804 1.28.538.3 1.228.432 2 .389 1.06-.057 1.858-.45 2.435-1.2.376-.49.655-1.123.83-1.89-.978-.24-2.072-.335-3.31-.321z" />
      </svg>
    ),
    color: 'bg-black hover:bg-gray-800',
    available: false,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Social Mockup Generator
          </h1>
          <p className="mt-1 text-gray-600">
            Create realistic social media post screenshots for presentations, ad
            previews, and content planning
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="mb-8 text-lg font-medium text-gray-700">
          Choose a platform to get started
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {platforms.map((platform) => (
            <div
              key={platform.id}
              className={`group relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition-all ${
                platform.available
                  ? 'hover:shadow-lg hover:border-gray-300'
                  : 'opacity-60'
              }`}
            >
              <div className="mb-4 flex items-center gap-3">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-xl text-white ${platform.color}`}
                >
                  {platform.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {platform.name}
                  </h3>
                  {!platform.available && (
                    <span className="text-xs text-amber-600 font-medium">
                      Coming Soon
                    </span>
                  )}
                </div>
              </div>
              <p className="mb-4 text-sm text-gray-600">{platform.description}</p>
              {platform.available ? (
                <Link href={`/create/${platform.id}`}>
                  <Button className={`w-full ${platform.color} text-white`}>
                    Create Mockup
                  </Button>
                </Link>
              ) : (
                <Button disabled className="w-full">
                  Coming Soon
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Features Section */}
        <section className="mt-16">
          <h2 className="mb-6 text-lg font-medium text-gray-700">Features</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'Pixel Perfect',
                description: 'Accurate recreations of each platform\'s design',
              },
              {
                title: 'High Resolution',
                description: 'Export at 2x or 3x for crisp images',
              },
              {
                title: 'Dark Mode',
                description: 'Support for light, dark, and dim themes',
              },
              {
                title: 'Instant Download',
                description: 'Download as PNG instantly',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border bg-white p-4"
              >
                <h3 className="font-medium text-gray-900">{feature.title}</h3>
                <p className="mt-1 text-sm text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-6">
        <div className="mx-auto max-w-5xl px-4 text-center text-sm text-gray-500">
          Built for ad creative previews, content planning, and presentations.
        </div>
      </footer>
    </div>
  )
}
